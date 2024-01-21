import gql from 'graphql-tag';
import { string } from 'prop-types';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/cartState';

// graphql to call and add to cart
const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

export function AddToCart({ id }) {
  // get the addToCart function and loading state from useMutation
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    // make sure to refetch the current user info
    // so the cart display will update
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  // open up the cart when user adds something
  const { openCart } = useCart();

  function handleClick() {
    addToCart();
    openCart();
  }

  return (
    <>
      <button type="button" onClick={handleClick} disabled={loading}>
        Add{loading && 'ing'} to Cart
      </button>
    </>
  );
}

AddToCart.propTypes = {
  id: string,
};

export default AddToCart;
