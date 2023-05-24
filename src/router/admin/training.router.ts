export default [
  {
    path: '/training',
    name: 'admin-training',
    redirect: { name: 'topic-list' },
    children: [
      {
        path: 'topic',
        name: 'topic-list',

        // requireAuth: {
        //   permissionKey: 'UserTypeManaging',
        //   permissionValue: 1,
        // },
        component: () => import('@/pages/admin/training/topic/Index.vue'),
        redirect: { name: 'manager-topic', params: { tab: 'title' } },
        children: [
          {
            path: ':tab',
            name: 'manager-topic',
            component: () => import('@/pages/admin/training/topic/Topic.vue'),
          },

        ],
      },
    ],
  },
]
