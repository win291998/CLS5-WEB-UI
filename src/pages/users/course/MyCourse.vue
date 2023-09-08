<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'
import CpMyCourseHappening from '@/components/page/users/course/course-list/CpMyCourseHappening.vue'
import CpMyCourseCompleted from '@/components/page/users/course/course-list/CpMyCourseCompleted.vue'

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'going-on',
    title: 'course-happening',
    component: CpMyCourseHappening,
    isRendered: true,
  },

  {
    key: 'completed',
    title: 'course-complete',
    component: CpMyCourseCompleted,
    isRendered: false,
  },

  // {
  //   key: 'condition-complete',
  //   title: 'condition-completed-content',
  //   component: CpConditionCompletedVideo,
  //   isRendered: false,
  //   isDisabled: computed(() => !route.params.contentId).value,
  // },
]
</script>

<template>
  <div
    class="d-flex justify-content-center mb-5 mt-4"
  >
    <CmTab
      :is-render="false"
      :list-tab="listTab"
      label="type"
    />
  </div>
</template>
