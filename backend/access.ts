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

// export const permissions = {
//   ...generatedPermissions,
//   isAwesome({ session }: ListAccessArgs): boolean {
//     return session?.data.name.includes('taran');
//   },
// };

// export const rules = {
//   canManageProducts({ session }: ListAccessArgs) {
//     if (!isSignedIn({ session })) {
//       return false;
//     }

//     if (permissions.canManageProducts({ session })) {
//       return true;
//     }

//     return { user: { id: session.itemId } };
//   },
//   canOrder({ session }: ListAccessArgs) {
//     if (!isSignedIn({ session })) {
//       return false;
//     }

//     if (permissions.canManageCart({ session })) {
//       return true;
//     }

//     return { user: { id: session.itemId } };
//   },
//   canManageOrderItems({ session }: ListAccessArgs) {
//     if (!isSignedIn({ session })) {
//       return false;
//     }

//     if (permissions.canManageOrderItems({ session })) {
//       return true;
//     }

//     return { order: { user: { id: session.itemId } } };
//   },
//   canReadProducts({ session }: ListAccessArgs) {
//     if (!isSignedIn({ session })) {
//       return false;
//     }

//     if (permissions.canReadProducts({ session })) {
//       return true;
//     }

//     return { status: 'AVAILABLE' };
//   },
//   canManageUsers({ session }: ListAccessArgs) {
//     if (!isSignedIn({ session })) {
//       return false;
//     }

//     if (permissions.canManageUsers({ session })) {
//       return true;
//     }

//     return { id: session.itemId };
//   },
// };

// // permissions - check for access returns boolean
export const permissions = {
  ...generatedPermissions,
};
