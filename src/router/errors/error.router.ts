import user from '@/router/admin/user.router'

export default [
  // quản lý admin
  {
    path: '/error-403',
    name: 'error-403',
    component: () => import('@/pages/errors/Error403.vue'),
  },
]
