/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

// custom mutation to add item to cart
async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // query user, see if they are signed in
  const sesh = context.session as Session;

  // cant add to a cart if you are not logged in
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this');
  }

  // look for existing cart items
  const allCartItems = await context.lists.CartItem.findMany({
    // items to match
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    // fields you want back
    resolveFields: 'id, quantity'
  });

  // first item returned from "findMany" will be the matches
  const [existingCartItem] = allCartItems;

  // if it matched, just update the quantity
  if (existingCartItem) {
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  // if no matches, add a new item
  return await context.lists.CartItem.createOne({
    data: {
      // need the product item
      product: { connect: { id: productId } },
      // and the user
      user: { connect: { id: sesh.itemId } },
    }
  });

}

export default addToCart;
