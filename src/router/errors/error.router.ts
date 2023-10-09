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
  {
    path: '/error-404',
    name: 'error-404',
    meta: {
      layout: 'blank',
    },
    component: () => import('@/pages/errors/Error404.vue'),
  },
]
