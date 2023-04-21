<script setup lang="ts">
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

/**
 * component
 */
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmRadioGroup = defineAsyncComponent(() => import('@/components/common/CmRadioGroup.vue'))
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpFormModifyUserInfor = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpFormModifyUserInfor.vue'))
const CpResume = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpResume.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const storeProfileUserManager = profileUserManagerStore()
const { values } = storeToRefs(storeProfileUserManager)
const { fectchLecturers, handleUser, resetFormInfor } = storeProfileUserManager

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'users.add-user.account-information',
    component: CpFormModifyUserInfor,
    dataTab: { profile: values },
    isRendered: false,
  },
  {
    key: 'resumer',
    title: 'users.add-user.profile',
    dataTab: { profile: values },
    component: CpResume,
    isRendered: false,
  },
]

const isShowButton = ref(true)

const backUser = () => {
  router.push({ name: 'admin-organization-users-manager' })
  resetFormInfor()
}

/**
 * Lấy data người dùng
 */
resetFormInfor()
if (route.params.id)
  fectchLecturers(route.params.id)
</script>

<template>
  <div
    class="d-flex justify-content-center"
    style="margin-top: 20px;"
  >
    <CmTab
      :list-tab="listTab"
      label="tab"
      type="button"
    />
  </div>

  <VSheet
    width="100%"
    class="user-infor mx-auto no-background my-5"
  >
    <CpActionFooterEdit
      :is-save="isShowButton"
      @onCancel="backUser"
      @onSave="handleUser($event, 'save')"
    />
  </VSheet>
</template>

