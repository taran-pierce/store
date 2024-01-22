import gql from 'graphql-tag';
import { string } from 'prop-types';
import { useMutation } from '@apollo/client';
import SickButton from './styles/SickButton';

// graphql to remove cart item
// TODO does not account for quantity, just removes the whole cart item
const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

// instead of refetching the queries on a delete
// just remove it from cache
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export function RemoveFromCart({ id }) {
  // grab function and loading state from useMutation
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    // refetech the current user to update the cart ui
    // we can do this faster
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    update,
    // "optimisticResponse" will get an immediate "happy path" response
    // followed up by the real response
    // basically just set up the object you expect to get back
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
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
