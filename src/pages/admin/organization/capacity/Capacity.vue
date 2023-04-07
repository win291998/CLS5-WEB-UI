<script setup lang="ts">
import CmTab from '@/components/common/CmTab.vue'

const CpGroupCapacity = defineAsyncComponent(() => import('@/components/page/Admin/organization/capacity/group-capacity/CpGroupCapacity.vue'))
const CpCapacity = defineAsyncComponent(() => import('@/components/page/Admin/organization/capacity/capacity/CpCapacity.vue'))
const CpLevel = defineAsyncComponent(() => import('@/components/page/Admin/organization/capacity/level/CpLevel.vue'))
const router = useRouter()

const listTabs = [
  {
    key: 'group-capacity',
    title: 'users.capacity-management.group-capacity',
    component: CpGroupCapacity,
  },
  {
    key: 'capacity',
    title: 'common.proficiency',
    component: CpCapacity,
  },
  {
    key: 'level',
    title: 'users.capacity-management.level',
    component: CpLevel,
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTabs"
    route-name="admin-organization-capacity-tab"
    label="tab"
  />
</template>

