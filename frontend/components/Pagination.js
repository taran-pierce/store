import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { number } from 'prop-types';
import { useQuery } from '@apollo/client';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

// graphql query to get a count of all product items
// much cheaper than querying all products then getting the length
export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export function Pagination({ page }) {
  // get info from the query
  const { error, loading, data } = useQuery(PAGINATION_QUERY);

  // temporary loading
  // to prevent counts from not working
  if (loading) {
    return <p>Loading...</p>;
  }

  // temporary error
  // should probably trigger the error component
  // to prevent counts from not working
  if (error) {
    return <p>Error...</p>;
  }

  // get the count from _allProductsMeta
  const { count = 0 } = data?._allProductsMeta;

  // get page count
  // divide the total count by the amount to display per page
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        {/* leverage aria to disable able the button when needed */}
        <a aria-disabled={page === 1}>Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next</a>
      </Link>
    </PaginationStyles>
  );
}

Pagination.propTypes = {
  page: number,
};

export default Pagination;
