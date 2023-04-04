export default [
  {
    path: '/guilde/tree-select',
    name: 'guilde-tree-select',
    component: () => import('@/pages/guilde/tree-select.vue'),
  },
  {
    path: 'guilde/import-file',
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
    path: 'guilde/table-group',
    name: 'guilde-table-group',
    component: () => import('@/pages/guilde/table-group.vue'),
  },
  {
    path: '/guilde/demo',
    meta: {
      layout: 'blank',
      permission: {
        key: '123',
      },
    },
    name: 'guilde-demo',
    component: () => import('@/pages/guilde/demo.vue'),
  },

  // quản lý người dùng
  {
    path: '/organization',
    name: 'admin-organization',
    meta: {
      layout: 'blank',
      permission: {
        key: '',
      },
    },
    redirect: { name: 'admin-organization-permistion' },
    children: [
      {
        path: 'permistion',
        name: 'admin-organization-permistion',
        component: () => import('@/pages/admin/organization/permission/Permission.vue'),
      },
      {
        path: 'users',
        meta: {
          // requireAuth: {
          //   permission: 'UserManaging',
          // },
        },
        name: 'admin-organization-users',
        component: () => import('@/pages/admin/organization/users/Index.vue'),
        redirect: { name: 'admin-organization-users-manager' },
        children: [
          {
            path: '',
            name: 'admin-organization-users-manager',
            component: () => import('@/pages/admin/organization/users/Users.vue'),
          },
          {
            path: 'profile',
            name: 'admin-organization-users-profile',
            meta: {
              parent: 'users',
              pageTitle: 'users.add-user.title',
              breadcrumb: [
                {
                  title: 'users.user.title-table.user-list',
                  to: { name: 'admin-organization-users' },
                },
                {
                  title: 'common.add',

                  active: true,
                },
              ],
            },
            component: () => import('@/pages/admin/organization/users/profile/Profile.vue'),
          },
        ],
      },
      {
        path: 'user-groups',
        name: 'admin-organization-user-groups',
        component: () => import('@/pages/admin/organization/user-groups/UserGroups.vue'),
      },
      {
        path: 'org-struct',
        name: 'admin-organization-org-struct',
        component: () => import('@/pages/admin/organization/org-struct/OrgStruct.vue'),
      },
      {
        path: 'position-title',
        name: 'admin-organization-position-title',
        component: () => import('@/pages/admin/organization/position-title/PositionTitle.vue'),
      },
      {
        path: 'capacity',
        name: 'admin-organization-capacity',
        component: () => import('@/pages/admin/organization/capacity/Capacity.vue'),
      },
    ],
  },

]
