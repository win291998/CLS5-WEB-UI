<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'
import CpMyCourseHappenning from '@/components/page/users/course/CpMyCourseHappenning.vue'

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'going-on',
    title: 'course-happenning',
    component: CpMyCourseHappenning,
    isRendered: true,
  },

  // {
  //   key: 'condition',
  //   title: 'condition-content',
  //   component: CpConditionVideo,
  //   isRendered: false,
  //   isDisabled: computed(() => !route.params.contentId).value,
  // },
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
      :is-render="true"
      :list-tab="listTab"
      label="type"
    />
  </div>
</template>
