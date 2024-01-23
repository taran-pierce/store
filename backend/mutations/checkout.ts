/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

// just allows syntax highlighting
const graphql = String.raw;

// custom mutation to checkout (make a purchase)
async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // make sure they are signed in
  const userId = context.session.itemId;

  if (!userId) {
    throw new Error('Sorry you must be signed in to create an order!');
  }

  // query current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `,
  });

  // 2 - calculate total price
  // remove empty/deleted items
  const cartItems = user.cart.filter(cartItem => cartItem.product);

  // calculate cart total
  const amount = cartItems.reduce(function (total: number, cartItem: CartItemCreateInput) {
    return total + cartItem.quantity * cartItem.product?.price;
  }, 0);

  // create the charge with stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount: amount,
    currency: 'USD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });

  // convert the cart items to order items
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    }

    return orderItem
  })

  // create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } }
    }
  });

  // clean up old cart items
  // "user.cart" includes the "deleted" cart items
  const cartItemIds = user.cart.map(cartItem => cartItem.id);

  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });

  return order;
}

export default checkout;
