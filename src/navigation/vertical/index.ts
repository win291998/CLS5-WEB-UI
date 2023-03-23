import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'admin' },
    icon: { icon: 'tabler-smart-home' },
  },

  // {
  //   title: 'Second page',
  //   to: { name: 'second-page' },
  //   icon: { icon: 'tabler-file' },
  // },
  // {
  //   title: 'Guilde',
  //   icon: { icon: 'tabler-users' },
  //   children: [
  //     { title: 'table', to: 'guilde-table' },
  //     { title: 'tableGroup', to: { name: 'guilde-table-group' } },
  //     { title: 'tree', to: { name: 'guilde-tree' } },
  //     { title: 'treeSelect', to: { name: 'guilde-tree-select' } },
  //     { title: 'importFile', to: { name: 'guilde-import-file' } },
  //   ],
  // },

  {
    title: 'Quản lý tổ chức',
    icon: { icon: 'tabler-file' },
    children: [
      { title: 'Phân quyền người dùng', to: { name: 'admin-organization-permistion' } },
      { title: 'Người dùng', to: { name: 'admin-organization-users' } },
      { title: 'Nhóm người dùng', to: { name: 'admin-organization-user-groups' } },
      { title: 'Cơ cấu tổ chức', to: { name: 'admin-organization-org-struct' } },
      { title: 'Vị trí chức danh', to: { name: 'admin-organization-position-title' } },
      { title: 'Năng lực', to: { name: 'admin-organization-capacity' } },
    ],
  },
] as VerticalNavItems
