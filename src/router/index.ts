import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import * as token from './token.json'
import { getHomeRouteForLoggedInUser, parseJwt } from './utils'
import admin from '@/router/admin/admin.router'
import { load } from '@/stores/loadComponent'

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

const permission: object = parseJwt(token.token)

const isUserLoggedIn = () => {
  return !!permission
}

const checkPortal = async (next, to) => {
  const checkFlag = true
  if (checkFlag) {
    const isLoggedIn = isUserLoggedIn()
    if (!canNavigate(to)) {
      // Redirect to login if not logged in
      if (!isLoggedIn) {
        try {
          const { data } = await axios.get(`${process.env.VUE_APP_BASE_API}/widget/get-all`)
          if (data?.data?.length > 0) {
            return next({
              name: 'home-page',
            })
          }

          return next({
            name: 'auth-login',
            query: { redirect: to.fullPath },
          })
        }
        catch {
          window.location.replace('https://cls.vn/')
        }
      }

      // If logged in => not authorized
      return next({ name: 'misc-not-authorized' })
    }

    // Redirect if logged in
    if (to.meta.redirectIfLoggedIn && isLoggedIn) {
      const userData = getUserData()

      next(getHomeRouteForLoggedInUser(userData ? userData.roles : null))
    }

    return next()
  }

  return next({ name: 'misc-error' })
}

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
  const store = load()

  // eslint-disable-next-line no-unused-expressions
  store.$reset

  return next()
})

router.beforeEach((to: any, from: any, next: any) => {
  if (to?.meta?.requireAuth) {
    if (isLoggedIn)
      return next({ name: 'login' })

    if (to?.meta?.permission && permission[to.meta.permission] & 1)
      return next({ name: 'error-403' })
  }

  return next()
})

export default router
