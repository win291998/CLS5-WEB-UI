export default [
  // quản lý admin
  {
    path: '/error-403',
    name: 'error-403',
    meta: {
      layout: 'blank',
    },
    component: () => import('@/pages/errors/Error403.vue'),
  },
]
