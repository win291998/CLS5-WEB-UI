export default [
  {
    path: 'guilde/tree-select',
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
    path: 'guilde/table-group',
    name: 'guilde-table-group',
    component: () => import('@/pages/guilde/table-group.vue'),
  },
  {
    path: '/guilde/demo',
    meta: {
      layout: 'blank',
    },
    name: 'guilde-demo',
    component: () => import('@/pages/guilde/demo.vue'),
  },
  {
    path: '/guilde/demo/:tabActive',
    name: 'guilde-demo-tab',
    component: () => import('@/pages/guilde/demo.vue'),
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
        requireAuth: {
          permissionKey: 'UserManaging',
        },
        component: () => import('@/pages/admin/organization/permission/Permission.vue'),
      },
      {
        path: 'users',
        meta: {
          requireAuth: {
            permissionKey: 'UserManaging',
            permissionValue: 1,
          },
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
            path: 'profile/:tab',
            name: 'admin-organization-users-profile-add',
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
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 2,
              },
            },
            component: () => import('@/pages/admin/organization/users/profile/Profile.vue'),
          },
          {
            path: 'profile/:tab/:id',
            name: 'admin-organization-users-profile-edit',
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
              requireAuth: {
                permissionKey: 'UserManaging',
                permissionValue: 4,
              },
            },
            component: () => import('@/pages/admin/organization/users/profile/Profile.vue'),
          },
        ],
      },
      {
        path: 'user-groups',
        name: 'admin-organization-user-groups',
        redirect: { name: 'admin-organization-user-groups-list' },
        meta: {
          requireAuth: {
            permissionKey: 'UserGroupManaging',
            permissionValue: 1,
          },
        },
        children: [
          {
            path: '',
            name: 'admin-organization-user-groups-list',
            component: () => import('@/pages/admin/organization/user-groups/UserGroups.vue'),
          },
          {
            path: ':tab/add',
            meta: {
              requireAuth: {
                permissionKey: 'UserGroupManaging',
                permissionValue: 2,
              },
              breadcrumb: [
                {
                  title: 'list-group-user',
                  to: { name: 'admin-organization-user-groups' },
                },
                {
                  title: 'common.add',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-groups-add',
            component: () => import('@/pages/admin/organization/user-groups/edit/EditUserGroup.vue'),
          },
          {
            path: ':tab/edit/:id',
            meta: {
              requireAuth: {
                permissionKey: 'UserGroupManaging',
                permissionValue: 4,
              },
              breadcrumb: [
                {
                  title: 'list-group-user',
                  to: { name: 'admin-organization-user-groups' },
                },
                {
                  title: 'common.add',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-groups-edit',
            component: () => import('@/pages/admin/organization/user-groups/edit/EditUserGroup.vue'),
          },
          {
            path: 'import-file',
            meta: {
              requireAuth: {
                permissionKey: 'UserGroupManaging',
                permissionValue: 2,
              },
              breadcrumb: [
                {
                  title: 'list-group-user',
                  to: { name: 'admin-organization-user-groups' },
                },
                {
                  title: 'common.title-import-file',
                  active: true,
                },
              ],
            },
            name: 'admin-organization-user-groups-edit',
            component: () => import('@/pages/admin/organization/user-groups/import-file/ImportFileAddGroup.vue'),
          },
        ],
        component: () => import('@/pages/admin/organization/user-groups/Index.vue'),
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
        redirect: { name: 'admin-organization-capacity-tab', params: { tab: 'group-capacity' } },
        children: [
          {
            path: ':tab',
            name: 'admin-organization-capacity-tab',
            component: () => import('@/pages/admin/organization/capacity/Capacity.vue'),
          },
        ],
      },

    ],
  },

]
