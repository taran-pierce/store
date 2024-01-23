import { list } from '@keystone-next/keystone/schema';
import {
  text,
  select,
  integer,
  relationship,
  virtual,
} from '@keystone-next/fields';
import formatMoney from '../lib/formatMoney';

// set up Product schema
// a list of fields
export const Order = list({
  fields: {
    // custom label for Keystone db
    // label: virtual({
    //   graphQLReturnType: 'String',
    //   resolver(order) {
    //     console.log({
    //       order,
    //     });
    //     return `Taran is cool ${formatMoney(order?.total)}`;
    //   },
    // }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
