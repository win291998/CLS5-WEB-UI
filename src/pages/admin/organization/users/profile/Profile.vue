<script setup lang="ts">
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmRadioGroup = defineAsyncComponent(() => import('@/components/common/CmRadioGroup.vue'))
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpFormModifyUserInfor = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpFormModifyUserInfor.vue'))
const CpResume = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpResume.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const src = ref('https://sfv4.cloudlms.top/DataFile/2023/4/3/kinhdoanh/6509/Image/fol-sfv4-kssjt7OiJC/origin.png')

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'users.add-user.account-information',
    component: CpFormModifyUserInfor,
    isRendered: false,
  },
  {
    key: 'resumer',
    title: 'users.add-user.profile',
    component: CpResume,
    isRendered: false,
  },
]

/**
 * Xử lý data form
 *
 */
const dataForm: any = ref({})

const changeDataFormInfor = (data: any) => {
  //
}
</script>

<template>
  <div
    class="d-flex justify-content-center"
    style="margin-top: 20px;"
  >
    <CmTab
      :list-tab="listTab"
      type="button"
    />
  </div>
</template>

