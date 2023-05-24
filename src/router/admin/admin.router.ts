import user from '@/router/admin/user.router'
import training from '@/router/admin/training.router'

export default [
  // quản lý admin
  {
    path: '/admin',
    name: 'admin',
    redirect: { name: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/admin/dashboard/index.vue'),
      },

      // user
      ...user,
      ...training,
    ],
  },

  // quản lý admin khác layout
]
