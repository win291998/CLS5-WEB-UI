<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'

const CpGroupCapacity = defineAsyncComponent(() => import('@/components/page/Admin/organization/capacity/group-capacity/CpGroupCapacity.vue'))
const CpCapacity = defineAsyncComponent(() => import('@/components/page/Admin/organization/capacity/capacity/CpCapacity.vue'))
const CpLevel = defineAsyncComponent(() => import('@/components/page/Admin/organization/capacity/level/CpLevel.vue'))

const listTabs = [
  {
    key: 'group-capacity',
    title: 'users.capacity-management.group-capacity',
    component: CpGroupCapacity,
    isRendered: true,
  },
  {
    key: 'capacity',
    title: 'common.proficiency',
    component: CpCapacity,
    isRendered: false,
  },
  {
    key: 'level',
    title: 'users.capacity-management.level',
    component: CpLevel,
    isRendered: false,
  },
]
</script>

<template>
  <CmTab :list-tab="listTabs" />
</template>

