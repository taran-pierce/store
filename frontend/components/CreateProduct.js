import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

// graphql for creating a product
// returns back product information
const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    # create product using data that is passed
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        # "create" to make a nested reference
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

// component with form to create new products
function CreateProduct() {
  // set up form data with custom form hook
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    name: 'Taran',
    price: 3400,
    description: 'Cool dude',
    image: '',
  });

  // set up createProduct mutation
  // useMutation returns two things:
  // function to trigger the action
  // object with data about the response
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    // "variables" to pass the inputs data
    {
      variables: inputs,
      // refetchQueries so we can update our "all products list"
      // this will update pages that already had that info cached
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  return (
    <>
      <Form
        // async will let us get access to "await"
        onSubmit={async (e) => {
          e.preventDefault();

          // variables could be passed here if you did not know them
          // in the previus section
          const res = await createProduct();

          // clear out the form
          clearForm();

          // go look at product you just added!
          Router.push({
            pathname: `/product/${res.data.createProduct.id}`,
          });
        }}
        aria-label="Create a product"
      >
        <DisplayError error={error} />
        {/* wrapping them all in a fieldset gives you the ability to disable the entire form */}
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="image">
            Image
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              required
            />
          </label>
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
          <button type="submit">+ Add Product</button>
        </fieldset>
      </Form>
    </>
  );
}

export default CreateProduct;
