<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpTabInforVideo = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpTabInforVideo.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'content',
    component: CpTabInforVideo,
    isRendered: true,
  },
]
</script>

<template>
  <div
    class="d-flex justify-content-center mb-5 mt-4"
  >
    <CmTab
      :is-render="true"
      :list-tab="listTab"
      label="contentTab"
    />
  </div>
</template>
