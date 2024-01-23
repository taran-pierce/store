import { object } from 'prop-types';

export function Order({ query }) {
  return <p>Order Number: {query?.id}</p>;
}

Order.propTypes = {
  query: object,
};

export default Order;
