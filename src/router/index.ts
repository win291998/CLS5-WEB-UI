import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import admin from '@/router/admin/admin.router'
import { loadButton } from '@/store/button'

const generalRoutes = [
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
  ...admin,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(generalRoutes),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const store = loadButton()

  // eslint-disable-next-line no-unused-expressions
  store.$reset

  return next()
})

export default router
