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
        component: () => import('@/pages/admin/course/approve/Approve.vue'),
      },
    ],
  },
]
