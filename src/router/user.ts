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

]
