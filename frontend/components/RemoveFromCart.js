import gql from 'graphql-tag';
import { string } from 'prop-types';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import SickButton from './styles/SickButton';

// graphql to remove cart item
// TODO does not account for quantity, just removes the whole cart item
const REMOVE_ITEM_FROM_CART = gql`
  mutation REMOVE_ITEM_FROM_CART($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

export function RemoveFromCart({ id }) {
  // grab function and loading state from useMutation
  const [removeFromCart, { loading }] = useMutation(REMOVE_ITEM_FROM_CART, {
    variables: { id },
    // refetech the current user to update the cart ui
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  return (
    <SickButton type="button" onClick={removeFromCart} disabled={loading}>
      Remove
    </SickButton>
  );
}

RemoveFromCart.propTypes = {
  id: string,
};

export default RemoveFromCart;
