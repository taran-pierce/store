import Link from 'next/link';
import { useUser } from '../components/User';
import formatMoney from '../lib/formatMoney';

export function OrdersPage() {
  const user = useUser();

  if (!user) {
    return <p>This page is not for you yet...</p>;
  }

  const { orders } = user;

  return (
    <>
      <p>Order History</p>
      <hr />
      {orders.length > 0 && (
        <table>
          <thead>
            <tr>
              <td>Order Id</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link href={`/order?id=${order.id}`}>{order.id}</Link>
                </td>
                <td>{formatMoney(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!orders.length && <p>You don't have any previous orders with us</p>}
    </>
  );
}

export default OrdersPage;
