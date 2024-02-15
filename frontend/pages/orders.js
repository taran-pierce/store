import Link from 'next/link';
import styled from 'styled-components';
import { useUser } from '../components/User';
import formatMoney from '../lib/formatMoney';

const TableStyles = styled.div`
  table {
    width: 100%;
  }

  thead {
    background: red;

    td {
      color: #fff;
    }
  }

  td {
    padding: 1rem;

    &:nth-child(2) {
      text-align: center;
    }
  }

  a {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export function OrdersPage() {
  const user = useUser();

  if (!user) {
    return <p>This page is not for you yet...</p>;
  }

  const { orders } = user;

  function countItemsInAnOrder(order) {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <>
      <h2>Order History</h2>
      <p>You have {orders.length} orders!</p>
      {orders.length > 0 && (
        <TableStyles>
          <table>
            <thead>
              <tr>
                <td>Order Id</td>
                <td>Items in Order</td>
                <td>Total</td>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/order?id=${order.id}`}>{order.id}</Link>
                  </td>
                  <td>{countItemsInAnOrder(order)}</td>
                  <td>{formatMoney(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableStyles>
      )}
      {!orders.length && <p>You don't have any previous orders with us</p>}
    </>
  );
}

export default OrdersPage;
