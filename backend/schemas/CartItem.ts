import { integer, relationship } from '@keystone-next/fields';

import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
  },
  fields: {
    // TODO custom label
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    // a cart item will be related to a Product
    product: relationship({
      ref: 'Product',
    }),
    // also related to a User
    user: relationship({
      ref: 'User.cart',
    }),
  },
  ui: {
    listView: {
      initialColumns: ['user', 'quantity', 'user'],
    },
  },
});
