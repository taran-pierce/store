import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import { string } from 'prop-types';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: top;
  gap: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

// graphql for getting single item
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    # NEW_VARIABLE_NAME:
    # format for renaming while doing a query
    # for instance, did not want the object to be "Product"
    product: Product(where: { id: $id }) {
      price
      name
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export function SingleProduct({ id }) {
  // get info from useQuery
  // passing it the id
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });

  // catch and display temp UI for loading/error
  if (loading) {
    return <p>Loading item...</p>;
  }

  if (error) {
    return <p>Error!</p>;
  }

  const { product } = data;

  return (
    <>
      <ProductStyles>
        <Head>
          <title>{product.name}</title>
        </Head>
        <img
          src={product.photo.image.publicUrlTransformed}
          alt={product.photo.image.altText}
        />
        <div className="details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      </ProductStyles>
    </>
  );
}

SingleProduct.propTypes = {
  id: string,
};

export default SingleProduct;
