import { checkbox } from '@keystone-next/fields';

export const permissionFields = {
  canManageProducts: checkbox({
    defaultValue: false,
    label: 'User can update and delete any product',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can query other users',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can edit other users',
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: 'User can CRUD roles',
  }),
  canManageCart: checkbox({
    defaultValue: false,
    label: 'User can manage cart and cart items',
  }),
  canManageOrders: checkbox({
    defaultValue: false,
    label: 'User can see and manage orders',
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionList: Permission[] = Object.keys(
  permissionFields
) as Permission[];
