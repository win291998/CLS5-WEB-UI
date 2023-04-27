<script setup lang="ts">
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

window.showAllPageLoading('COMPONENT')

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
 * component
 */
const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpFormModifyUserInfor = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpFormModifyUserInfor.vue'))
const CpResume = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpResume.vue'))
const CpOrganization = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpOrganization.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'account-information',
    component: CpFormModifyUserInfor,
    dataTab: { profile: values },
    isRendered: false,
  },
  {
    key: 'resumer',
    title: 'profile',
    dataTab: { profile: values },
    component: CpResume,
    isRendered: false,
  },
  {
    key: 'organization',
    title: 'organization',
    dataTab: { profile: values },
    component: CpOrganization,
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
window.hideAllPageLoading()
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

    <div
      width="100%"
      class="user-infor no-background py-5"
    >
      <CpActionFooterEdit
        :is-save="isShowButton"
        @onCancel="backUser"
        @onSave="handleUser($event, 'save')"
      />
    </div>
  </div>
</template>

