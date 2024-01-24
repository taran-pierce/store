import 'dotenv/config';
import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { CartItem } from './schemas/CartItem';
import { Role } from './schemas/Role';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations/index';
import { permissionList } from './schemas/fields';

// set in .env with a fallback in case there is a local setup
const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

// config for the session
const sessionConfig = {
  maxAge: 60 * 60 * 24 * 260,
  secret: process.env.COOKIE_SECRET,
};

// withAuth is returned form createAuth
const { withAuth } = createAuth({
  // using the User as the main identifier
  listKey: 'User',
  // user name will be the email
  identityField: 'email',
  // using the "password" to verify
  secretField: 'password',
  // this allows you to create a brand new user when none exist
  // just something for getting the db started
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO add in initial roles
  },
  passwordResetLink: {
    // send out the reset token for pass in indentity
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

// export withAuth with the "config" and its options
export default withAuth(
  config({
    // configure server info
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    // db info
    db: {
      adapter: 'mongoose',
      url: databaseUrl,
      async onConnect(keystone) {
        // optional flag for adding dummy data from /seed-data/
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    // set up the schema for keystone to use
    lists: createSchema({
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role,
    }),
    extendGraphqlSchema,
    // ui options
    ui: {
      // only allow access if they have session data
      // which means they are logged in
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    // session takes withItemData from keystone and pass it statelessSessions, also from keystone
    // along with the config
    // second arg for withItemData is an object with the one to use, in this case "User"
    // pass the fields for it to use in a string with separated by a space
    session: withItemData(statelessSessions(sessionConfig), {
      User: `id name email role { ${permissionList.join(' ')} }`,
    }),
  })
);
