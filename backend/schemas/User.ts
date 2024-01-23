import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

// set up User schema
// a list of fields
export const User = list({
  // access:
  // ui
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    // user will have a "cart"
    // which will be related "CartItem"s
    cart: relationship({
      ref: 'CartItem.user',
      // there can be more than one CartItem
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    // TODO add: roles
    orders: relationship({ ref: 'Order.user', many: true }),
  },
});
