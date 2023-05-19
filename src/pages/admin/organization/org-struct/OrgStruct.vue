<script setup lang="ts">
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const CpHeaderPageOrgStruct = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/CpHeaderPageOrgStruct.vue'))
const CpOrganizationListView = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/CpOrganizationListView.vue'))
const CpDeleteNodeOrg = defineAsyncComponent(() => import('@/components/page/Admin/organization/org-struct/modal/CpDeleteNodeOrg.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * store
 */
const storeOrgStruct = orgStructManagerStore()
const { render } = storeToRefs(storeOrgStruct)
const { getListOrgStruct } = storeOrgStruct

/**
 *
 * params
 */
const data = reactive({
  isShowDialogDeleteNode: false,
})
const deleteOrgStructData = ref()
const deleteNode = (dataDel: any) => {
  deleteOrgStructData.value = dataDel
  data.isShowDialogDeleteNode = true
}
const reloadOrgStruct = async () => {
  await getListOrgStruct()
  render.value++
}
</script>

<template>
  <div>
    <CpHeaderPageOrgStruct
      :title-aprove="t('browse-user')"
      :title="t('user-list')"
      is-update-btn
      is-export-btn
      is-approve-btn
    />
  </div>
  <div>
    <CpOrganizationListView
      @delete-node="deleteNode"
    />
  </div>
  <div>
    <CpDeleteNodeOrg
      v-model:is-dialog-visible="data.isShowDialogDeleteNode"
      :delete-org-struct-data="deleteOrgStructData"
      @deleteSuccess="reloadOrgStruct"
    />
  </div>
</template>

