<script setup lang="ts">
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const CmTab = defineAsyncComponent(() => import('@/components/common/CmTab.vue'))
const CpInforOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/infor/CpInforOrgStructTab.vue'))
const CpTitleOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/title/CpTitleOrgStructTab.vue'))
const CpUserOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/user/CpUserOrgStructTab.vue'))
const CpCourseOrgStructTab = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/edit/course/CpCourseOrgStructTab.vue'))

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

getComboboxOwnerInf()

if (route.params.id) {
  idOrg.value = Number(route.params.id)
  isEdit.value = true
  getInforOrgById()
}

if (route.params.parentId)
  organization.value.parentId = Number(route.params.parentId)

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
  {
    key: 'user',
    title: 'user',
    component: CpUserOrgStructTab,
    isRendered: false,
  },
  {
    key: 'course',
    title: 'course',
    component: CpCourseOrgStructTab,
    isRendered: false,
  },
]
if (route.params.tab)
  listTab[listTab.findIndex(item => item.key === route.params.tab)].isRendered = true
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
        @update="updateOrganizational"
        @saveAndUpdate="addOrganizational(true)"
      />
    </div>
  </div>
</template>

