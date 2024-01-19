import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { string } from 'prop-types';
import Router from 'next/dist/client/router';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import useForm from '../lib/useForm';

// graphql for getting single product
// does not include the image
// its not going to be editable
const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

// graphql mutation for updating the product info
const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

export function UpdateProduct({ id }) {
  // get product from useQuery
  // pass it the id
  const { data, loading, error } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id,
    },
  });

  // useMutation will return:
  // function to update product
  // data about the response, renamed cause we just used these
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  // set up the data for the form
  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);

  // hold if we are loading the data
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();

          const res = await updateProduct({
            variables: {
              id,
              name: inputs.name,
              description: inputs.description,
              price: inputs.price,
            },
          }).catch(console.error);

          // go look at product you just added!
          Router.push({
            pathname: `/product/${res.data.updateProduct.id}`,
          });
        }}
      >
        <DisplayError error={error || updateError} />
        <fieldset disabled={updateLoading} aria-busy={updateLoading}>
          <label htmlFor="name">
            Name
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="price">
            Price
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price"
              value={inputs.price}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="description">
            Description
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={inputs.description}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Update Product</button>
        </fieldset>
      </Form>
    </>
  );
}

UpdateProduct.propTypes = {
  id: string,
};

export default UpdateProduct;
