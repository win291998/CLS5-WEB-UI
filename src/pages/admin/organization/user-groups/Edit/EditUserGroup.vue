<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'

const CpAdd = defineAsyncComponent(() => import('@/components/page/Admin/organization/user-group/CpAdd.vue'))
const CpUserTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/user-group/CpUserTab.vue'))
const CpCourseTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/user-group/CpCourseTab.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const route = useRoute()

const isDisabledTab = computed(() => {
  return !route.params.id
})

const listtab = ref([
  {
    key: 'info',
    title: 'common.info',
    component: CpAdd,
    dataTab: {
      TITLE: {
        titlePageAdd: t('add-user-group'),
        titlePageEdit: t('edit-user-group'),
        titleButton: t('common.save'),
        titleCancel: t('common.cancel'),
        titleButtonAndUpdate: t('common.save-and-update'),
      },
    },
    isDisabled: false,
  },
  {
    key: 'user',
    title: 'common.tabs.user',
    isDisabled: isDisabledTab.value,
    component: CpUserTab,
  },
  {
    key: 'course',
    title: 'common.tabs.course',
    isDisabled: isDisabledTab.value,
    component: CpCourseTab,
  },
])
</script>

<template>
  <CmTab
    type="button"
    :list-tab="listtab"
    label="tab"
  />
</template>

