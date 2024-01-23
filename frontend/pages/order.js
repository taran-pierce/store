import { object } from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import formatMoney from '../lib/formatMoney';
import DisplayError from '../components/ErrorMessage';

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

export function SingleOrder({ query }) {
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
  const { items } = Order;

  return (
    <>
      <div>
        <h1>Thanks for your order!</h1>
        <h4>{Order?.user?.name}, your stuff is on the way!</h4>
        <h5>
          We also sent you a confirmation email here: {Order?.user?.email}
        </h5>
        {items && (
          <>
            <h2>Order Items</h2>
            <ul>
              {items.map((item) => (
                <li key={item.name}>
                  <img
                    src={item.photo.image.publicUrlTransformed}
                    alt={item.name}
                    width="100"
                  />
                  <p>
                    {item.name}{' '}
                    {item.quantity > 1 ? `(x ${item.quantity})` : ''} -{' '}
                    {item.description}
                  </p>
                  <p>{formatMoney(item.price)}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        <h3>Order Total: {formatMoney(Order.total)}</h3>
      </div>
    </>
  );
}

SingleOrder.propTypes = {
  query: object,
};

export default SingleOrder;
