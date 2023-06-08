export default [
  {
    path: 'exam',
    name: 'list-exam',
    redirect: { name: 'exam-list' },
    component: () => import('@/pages/admin/exam/Index.vue'),
    children: [
      {
        path: '',
        name: 'exam-list',
        component: () => import('@/pages/admin/exam/Exam.vue'),
      },
    ],
  },
]
