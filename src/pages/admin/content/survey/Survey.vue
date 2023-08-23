<script setup lang="ts">
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpSurveyList = defineAsyncComponent(() => import('@/components/page/Admin/content/survey/survey-list/CpSurveyList.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'list',
    title: 'survey-bank',
    component: CpSurveyList,
    isRendered: true,
    isDisabled: false,
  },

  // {
  //   key: 'title',
  //   title: 'title-position',
  //   component: CpTitleOrgStructTab,
  //   isRendered: false,
  //   isDisabled: !isEdit.value,
  // },
  // {
  //   key: 'user',
  //   title: 'user',
  //   component: CpUserOrgStructTab,
  //   isRendered: false,
  //   isDisabled: !isEdit.value,
  // },
]
</script>

<template>
  <div>
    <div
      class="d-flex justify-content-center mb-5"
      style="margin-top: 20px;"
    >
      <CmTab
        :is-render="true"
        :list-tab="listTab"
        label="tab"
        type="button"
      />
    </div>
  </div>
</template>
