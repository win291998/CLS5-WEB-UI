<script setup lang="ts">
import { orgStructManagerStore } from '@/stores/admin/org-struct/OrgStruct'

const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpInforOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/CpInforOrgStructTab.vue'))
const CpTitleOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/CpTitleOrgStructTab.vue'))

/**
 * lib
 */
const route = useRoute()
const router = useRouter()

/**
 * store
 */
const storeOrgStruct = orgStructManagerStore()
const { idOrg, isEdit, organization } = storeToRefs(storeOrgStruct)
const { getInforOrgById, addOrganizational, updateOrganizational, getComboboxOwnerInf } = storeOrgStruct

/**
 *
 * tab
 */
const listTab = [
  {
    key: 'infor',
    title: 'info',
    component: CpInforOrgStructTab,
    isRendered: true,
  },
  {
    key: 'title',
    title: 'title-position',
    component: CpTitleOrgStructTab,
    isRendered: false,
  },
]
getComboboxOwnerInf()

if (route.params.id) {
  idOrg.value = Number(route.params.id)
  isEdit.value = true
  getInforOrgById()
}

else if (route.params.parentId) {
  organization.value.parentId = Number(route.params.parentId)
}
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
        @save="addOrganizational(false)"
        @update="updateOrganizational"
        @saveAndUpdate="addOrganizational(true)"
      />
    </div>
  </div>
</template>

