import user from '@/router/admin/user.router'

export default [
  // quản lý admin
  {
    path: '/admin',
    name: 'admin',
    redirect: { name: 'dashboard' },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/pages/admin/dashboard/index.vue'),
      },

      // user
      ...user,
    ],
  },
]
