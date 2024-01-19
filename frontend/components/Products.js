import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { number } from 'prop-types';
import { perPage } from '../config';
import { Product } from './Product';

// graphql for getting all the products
// skip: number of items to skip from the begining of the list
// first: the maximium amount of items to retrieve
export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($skip: Int = 0, $first: Int) {
    allProducts(first: $first, skip: $skip) {
      id
      name
      price
      description
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export function Products({ page }) {
  // get info from useQuery
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      // current page * our amount per page
      // then subtract the page amount
      // common way to paginate through results
      skip: page * perPage - perPage,
      first: perPage,
    },
  });

  // if loading or error stall and show temporary UI
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error...</p>;
  }

  return (
    <>
      <ProductsListStyles>
        {data.allProducts.map((product) => (
          <Product key={product.name} product={product} />
        ))}
      </ProductsListStyles>
    </>
  );
}

Products.propTypes = {
  page: number,
};

export default Products;
