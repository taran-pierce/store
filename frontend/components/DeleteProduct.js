/* eslint-disable no-restricted-globals */
import gql from 'graphql-tag';
import { string, any } from 'prop-types';
import { useMutation } from '@apollo/client';

// graphql for deleting a product
// returns back product id and name of deleted item
const DELETE_PRODUCT_MUTATION = gql`
  mutation DELETE_PRODUCT_MUTATION($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;

// function to remove the deleted item from cache
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteProduct));
}

export function DeleteProduct({ id, children }) {
  // set up deleteProduct mutation
  // useMutation returns two things:
  // function to trigger the action
  // object with data about the response
  const [deleteProduct, { loading }] = useMutation(
    DELETE_PRODUCT_MUTATION,
    // pass "varibles" with the id of which one to delete
    {
      variables: {
        id,
      },
      // callback after item is deleted
      update,
    }
  );
  return (
    <>
      <button
        type="button"
        onClick={() => {
          // throw a confirm to make sure the action was on purpose
          if (confirm('Are you sure you want to delete this item?')) {
            // delete it
            // catching and alerting the error here instead of a toast
            // the positioning is kind of weird
            deleteProduct().catch((err) => alert(err.message));
          }
        }}
        disabled={loading}
      >
        {children}
      </button>
    </>
  );
}

DeleteProduct.propTypes = {
  id: string,
  children: any,
};

export default DeleteProduct;
