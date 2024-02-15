import Head from 'next/head';
import { object } from 'prop-types';
import formatMoney from '../lib/formatMoney';
import OrderStyles from './styles/OrderStyles';

export function SingleOrder({ order }) {
  return (
    <OrderStyles>
      <Head>
        <title>Order - {order?.id}</title>
      </Head>
      <h1>Thanks for your order!</h1>
      <h4>{order.user?.name}, your stuff is on the way!</h4>
      <h5>We also sent you a confirmation email here: {order?.user?.email}</h5>
      <h3>Order Total: {formatMoney(order.total)}</h3>
      <div className="items">
        {order.items.map((item) => (
          <div key={item.name} className="order-item">
            <img
              src={item.photo.image.publicUrlTransformed}
              alt={item.name}
              width="100"
            />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Each: {formatMoney(item.price)}</p>
              <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}

SingleOrder.propTypes = {
  order: object,
};

export default SingleOrder;
