import { permissionList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// // permissions - check for access returns boolean
export const permissions = {
  ...generatedPermissions,
};

// rules can return a boolean or a filter to limit returned items
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // if (!isSignedIn({ session })) {
    //   return false;
    // }

    if (permissions.canManageProducts({ session })) {
      return true;
    }

    return { user: { id: session.itemId } };
  },
  // canOrder({ session }: ListAccessArgs) {
  //   if (!isSignedIn({ session })) {
  //     return false;
  //   }

  //   if (permissions.canManageCart({ session })) {
  //     return true;
  //   }

  //   return { user: { id: session.itemId } };
  // },
  // canManageOrderItems({ session }: ListAccessArgs) {
  //   if (!isSignedIn({ session })) {
  //     return false;
  //   }

  //   if (permissions.canManageOrderItems({ session })) {
  //     return true;
  //   }

  //   return { order: { user: { id: session.itemId } } };
  // },
  canReadProducts({ session }: ListAccessArgs) {
    // if they can manage products
    // let them sell all products, reguardless of availiabity
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // otherwise only show products that are available
    return { status: 'AVAILABLE' };
  },
  // canManageUsers({ session }: ListAccessArgs) {
  //   if (!isSignedIn({ session })) {
  //     return false;
  //   }

  //   if (permissions.canManageUsers({ session })) {
  //     return true;
  //   }

  //   return { id: session.itemId };
  // },
};
