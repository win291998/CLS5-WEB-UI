export default [
  {
    path: 'manage-training-plan',
    name: 'manage-training-plan',
  },
  {
    path: 'list-roadmap',
    name: 'list-roadmap',
  },

  {
    path: 'course',
    name: 'course-list',
    redirect: { name: 'course' },
    component: () => import('@/pages/admin/course/Index.vue'),

    // requireAuth: {
    //   permissionKey: 'UserTypeManaging',
    //   permissionValue: 1,
    // },
    children: [
      {
        path: '',
        name: 'course',
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
        path: 'add',
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
        path: ':id/edit',
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
      {
        path: ':id/view',
        name: 'course-view',
        meta: {
          breadcrumb: [
            {
              title: 'list-course',
              to: { name: 'course-list' },
            },
            {
              title: 'view-detail',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/course/modify/ModifyCourse.vue'),
      },
      {
        path: ':id/edit/add-content/:type',
        name: 'content-add',
        meta: {
          breadcrumb: [
            {
              title: 'course-edit',
              to: { name: 'course-edit' },
            },
            {
              title: 'add-content',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/course/modify/content/Content.vue'),
      },
      {
        path: ':id/edit/edit-content/:contentId/:type',
        name: 'content-edit',
        meta: {
          breadcrumb: [
            {
              title: 'course-edit',
              to: { name: 'course-edit' },
            },
            {
              title: 'add-content',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/course/modify/content/Content.vue'),
      },
      {
        path: ':id/edit/view-content/:contentId/:type',
        name: 'content-view',
        meta: {
          breadcrumb: [
            {
              title: 'course-edit',
              to: { name: 'course-view' },
            },
            {
              title: 'add-content',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/course/modify/content/Content.vue'),
      },

      // điểm danh
      {
        path: ':id/attendance',
        name: 'course-attendance',
        meta: {
          breadcrumb: [
            {
              title: 'list-course',
              to: { name: 'course-list' },
            },
            {
              title: 'attendance',
              active: true,
            },
          ],
        },
        component: () => import('@/pages/admin/course/attendance/Attendance.vue'),
      },
    ],
  },
]
