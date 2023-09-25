<script lang="ts" setup>
import CpGeneralInfo from '@/components/page/Admin/system/setting/tab/CpGeneralInfo.vue'
import CpExpPoint from '@/components/page/Admin/system/setting/tab/CpExpPoint.vue'
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpRatingScale from '@/components/page/Admin/system/setting/tab/CpRatingScale.vue'
import CpCertification from '@/components/page/Admin/system/setting/tab/CpCertification.vue'
import CpNotification from '@/components/page/Admin/system/setting/tab/CpNotification.vue'
import CpEmailConfig from '@/components/page/Admin/system/setting/tab/CpEmailConfig.vue'
import CpLoginRegis from '@/components/page/Admin/system/setting/tab/CpLoginRegis.vue'

const listTab: Tab[] = [
  {
    key: 'setting-info',
    title: 'general-info',
    component: CpGeneralInfo,
  },
  {
    key: 'rating-scale',
    title: 'rating-scale',
    component: CpRatingScale,
  },
  {
    key: 'experience-point',
    title: 'experience-point-setting',
    component: CpExpPoint,
  },
  {
    key: 'email-config',
    title: 'email-config',
    component: CpEmailConfig,
  },
  {
    key: 'setting-login',
    title: 'setting-login',
    component: CpLoginRegis,
  },
  {
    key: 'certification',
    title: 'certification',
    component: CpCertification,
  },
  {
    key: 'notification',
    title: 'notification',
    component: CpNotification,
  },
]
</script>

<template>
  <CmTab
    :list-tab="listTab"
  />
</template>
