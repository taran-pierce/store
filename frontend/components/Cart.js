import styled from 'styled-components';
import { object } from 'prop-types';
import { useUser } from './User';
import { useCart } from '../lib/cartState';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import SupremeStyles from './styles/Supreme';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { RemoveFromCart } from './RemoveFromCart';
import { Checkout } from './Checkout';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGray);
  display: grid;
  grid-template-columns: auto 1fr auto;

  img {
    margin-right: 1rem;
    width: 100px;
  }

  h3,
  p {
    margin: 0;
  }
`;

function CartItem({ cartItem }) {
  const { product } = cartItem;

  if (!product) {
    return null;
  }

  const { photo } = product;

  return (
    <CartItemStyles>
      <img
        src={photo.image.publicUrlTransformed}
        alt={photo.publicUrlTransformed}
      />
      <div>
        <h3>{product.name}</h3>
        <p>{formatMoney(product.price * cartItem.quantity)}</p>
        <br />-
        <br />
        <em>
          {cartItem.quantity} &times; {formatMoney(product.price)}&nbsp; each
        </em>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
}

export function Cart() {
  const me = useUser();
  const { cartOpen, toggleCart, closeCart } = useCart();

  if (!me) {
    return null;
  }

  return (
    <CartStyles open={cartOpen}>
      <header>
        <SupremeStyles>{me.name}'s Cart</SupremeStyles>
        <CloseButton type="button" onClick={closeCart}>
          Close
        </CloseButton>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
}

CartItem.propTypes = {
  cartItem: object,
};

export default Cart;
