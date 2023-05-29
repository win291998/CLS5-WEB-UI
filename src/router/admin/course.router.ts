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
        path: '',
        name: 'course-list',
        component: () => import('@/pages/admin/course/Course.vue'),
      },
    ],
  },
]
