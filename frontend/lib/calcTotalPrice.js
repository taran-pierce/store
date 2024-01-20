export default function calcTotalPrice(cart) {
  // reduce all cart items into one total
  return cart.reduce((total, cartItem) => {
    // products can be deleted but still in cart
    if (!cartItem.product) {
      return total;
    }

    // take the total -> add the quantity * price
    return total + cartItem.quantity * cartItem.product.price;
  }, 0);
}
