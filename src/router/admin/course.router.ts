export default [
  {
    path: 'course',
    name: 'admin-course',
    redirect: { name: 'course-list' },
    component: () => import('@/pages/admin/course/Index.vue'),

    // requireAuth: {
    //   permissionKey: 'UserTypeManaging',
    //   permissionValue: 1,
    // },
    children: [
      {
        path: 'course-list',
        name: 'course-list',
        component: () => import('@/pages/admin/course/Course.vue'),
      },
      {
        path: 'course-approve',
        name: 'course-approve',
        meta: {
          breadcrumb: [
            {
              title: 'list-course',
              to: { name: 'course-list' },
            },
            {
              title: 'apply',
              active: true,
            },
          ],
        },

        component: () => import('@/pages/admin/course/approve/Approve.vue'),
      },
      {
        path: 'add/:tab',
        name: 'course-add',
        meta: {
          breadcrumb: [
            {
              title: 'list-course',
              to: { name: 'course-list' },
            },
            {
              title: 'add-course',
              active: true,
            },
          ],
        },

        component: () => import('@/pages/admin/course/modify/ModifyCourse.vue'),
      },
      {
        path: 'edit/:tab/:id',
        name: 'course-edit',
        meta: {
          breadcrumb: [
            {
              title: 'list-course',
              to: { name: 'course-list' },
            },
            {
              title: 'course-edit',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/course/modify/ModifyCourse.vue'),
      },
    ],
  },
]
