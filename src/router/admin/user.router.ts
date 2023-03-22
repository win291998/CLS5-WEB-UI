export default [
  {
    path: '/user',
    name: 'user',
    meta: {
      parent: '',
      pageTitle: 'Quản lí người dùng',
      auth: {
        permissionKey: 'UserManaging',
        permissionValue: 1,
      },
    },
    component: () => import('@/pages/User.vue'),
  },
  {
    path: '/user-chil',
    name: 'user-chil',
    meta: {
      parent: '',
      pageTitle: 'Quản lí người dùng-chil',
      auth: {
        permissionKey: 'UserManaging',
        permissionValue: 1,
      },
      breadcrumb: [
        {
          title: 'Quản lí người dùng',
          to: { name: 'user' },
        },
        {
          title: 'Quản lí người dùng-chil',
          to: { name: 'user-chil' },
        },
        {
          title: 'Quản lí người dùng-chil-chil',
        },
      ],
    },
    component: () => import('@/pages/UserChil.vue'),
  },
  {
    path: '/user-chil-chil',
    name: 'user-chil-chil',
    meta: {
      parent: '',
      pageTitle: 'Quản lí người dùng-chil-chil',
      auth: {
        permissionKey: 'UserManaging',
        permissionValue: 1,
      },
    },
    component: () => import('@/pages/UserChilChil.vue'),
  },
  {
    path: '/user-chil-chil-chil',
    name: 'user-chil-chil-chil',
    meta: {
      parent: '',
      pageTitle: 'Quản lí người dùng-chil-chil-chil',
      auth: {
        permissionKey: 'UserManaging',
        permissionValue: 1,
      },
    },
    component: () => import('@/pages/UserChilChilChil.vue'),
  },
  {
    path: '/user-chil-chil-chil-chil',
    name: 'user-chil-chil-chil-chil',
    meta: {
      parent: '',
      pageTitle: 'Quản lí người dùng-chil-chil-chil-chil',
      auth: {
        permissionKey: 'UserManaging',
        permissionValue: 1,
      },
    },
    component: () => import('@/pages/UserChilChilChilChil.vue'),
  },
  {
    path: '/',
    name: 'login',
    meta: {
      layout: 'blank',
      parent: '',
      pageTitle: 'Quản lí người dùng',
      auth: {
        permissionKey: 'UserManaging',
        permissionValue: 1,
      },

    },
    component: () => import('@/pages/login.vue'),
  },
  {
    path: '/guilde/tree-select',
    name: 'guilde-tree-select',
    component: () => import('@/pages/guilde/tree-select.vue'),
  },
  {
    path: '/guilde/import-file',
    name: 'guilde-import-file',
    component: () => import('@/pages/guilde/import-file.vue'),
  },
  {
    path: '/guilde/tree',
    name: 'guilde-tree',
    component: () => import('@/pages/guilde/tree.vue'),
  },
  {
    path: '/guilde/table',
    name: 'guilde-table',
    component: () => import('@/pages/guilde/table.vue'),
  },
  {
    path: '/guilde/table-group',
    name: 'guilde-table-group',
    component: () => import('@/pages/guilde/table-group.vue'),
  },

  // quản lý người dùng
  {
    path: '/organization',
    name: 'admin-organization',
    redirect: { name: 'admin-organization-permistion' },
    children: [
      {
        path: 'permistion',
        name: 'admin-organization-permistion',
        component: () => import('@/pages/admin/organization/permistion/Index.vue'),
      },
      {
        path: 'users',
        name: 'admin-organization-users',
        component: () => import('@/pages/admin/organization/users/Index.vue'),
      },
      {
        path: 'user-groups',
        name: 'admin-organization-user-groups',
        component: () => import('@/pages/admin/organization/user-groups/Index.vue'),
      },
    ],
  },

]
