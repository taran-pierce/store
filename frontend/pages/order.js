import { object } from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import formatMoney from '../lib/formatMoney';
import DisplayError from '../components/ErrorMessage';
import { SingleOrder } from '../components/SingleOrder';

// graphql to get single order
const ORDER_NUMBER_QUERY = gql`
  query ORDER_NUMBER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      total
      user {
        id
        name
        email
      }
      charge
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export function SingleOrderPage({ query }) {
  // passing id in via query
  const { id } = query;

  // get the data and info from useQuery
  const { data, loading, error } = useQuery(ORDER_NUMBER_QUERY, {
    variables: { id },
  });

  // look for loading and error to update UI accordingly
  if (loading) {
    return <p>Loading order...</p>;
  }

  if (error) {
    return <DisplayError error={error} />;
  }

  // get the order and its info
  const { Order } = data;

  return (
    <>
      <div>
        <SingleOrder order={Order} />
      </div>
    </>
  );
}

SingleOrderPage.propTypes = {
  query: object,
};

export default SingleOrderPage;
