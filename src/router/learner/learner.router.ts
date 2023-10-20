export default [
  {
    path: '/learner',
    name: 'learner',
    redirect: { name: 'dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard-students',
        component: () => import('@/pages/admin/dashboard/index.vue'),
      },
      {
        path: 'learning-content',
        name: 'learning-content',
      },
      {
        path: 'list-my-survey',
        name: 'list-my-survey',
      },
      {
        path: 'learning-path',
        name: 'learning-path',
      },
      {
        path: 'list-my-exam',
        name: 'list-my-exam',
        component: () => import('@/pages/users/exam/MyExam.vue'),
      },
      {
        path: 'exam/my-test/:id',
        name: 'my-test',
        component: () => import('@/pages/users/exam/test/MyTest.vue'),
        meta: {
          layout: 'blank',
        },
      },
      {
        path: 'list-course',
        name: 'list-course',
        component: () => import('@/pages/users/course/MyCourse.vue'),
      },
      {
        path: 'course-detail/:id',
        name: 'course-detail',
        component: () => import('@/pages/users/course/course-detail/MyCourseDetail.vue'),
        meta: {
          layout: 'blank',
          breadcrumb: [
            {
              title: 'my-course',
              to: { name: 'list-course' },
            },
            {
              title: 'course-detail',
              active: true,
            },
          ],
        },
      },

      {
        path: 'course-review/:id',
        name: 'course-review',
        meta: {
          layout: 'blank',
        },
        component: () => import('@/pages/users/course/course-learning/CourseLearning.vue'),
      },
      {
        path: 'calendar',
        name: 'calendar',
      },
      {
        path: 'forum-new-feed',
        name: 'forum-new-feed',
      },
      {
        path: 'list-library',
        name: 'list-library',
      },
    ],
  },
  {
    path: '/learner/course-learning/:id',
    meta: {
      layout: 'blank',
    },
    name: 'course-learning',
    component: () => import('@/pages/users/course/course-learning/CourseLearning.vue'),
  },
  {
    path: '/learner/exam/my-test',
    name: 'test',
    meta: {
      layout: 'blank',
    },
    redirect: { name: 'my-test' },
    children: [
      {
        path: ':id',
        component: () => import('@/pages/users/exam/test/MyTest.vue'),
        name: 'my-test',
      },
      {
        path: 'result/:id',
        name: 'my-test-result',
        component: () => import('@/pages/users/exam/test/MyTestResult.vue'),
      },
    ],
  },

]
