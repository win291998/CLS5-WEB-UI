<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { orgStructManagerStore } from '@/stores/admin/org-struct/orgStruct'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInfo = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInfo.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * store
 */

// const {  } = storeOrgStruct

const storeOrgStruct = orgStructManagerStore()
const { organization } = storeToRefs(storeOrgStruct)

/** data */
const queryParams = reactive({
  orStructureId: null,
  pageNumber: 1,
  pageSize: 10,
  search: '',
})
const dataComponent = reactive({
  totalRecord: 0,
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const disabledDelete = computed(() => !dataComponent.selectedRowsIds.length)
const isShowDialogAddUser = ref(false)
const isShowDialogNotiDelete = ref(false)

/**
 * data table
 */
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('surname-name'), value: 'fullName' },
  { text: t('title-position'), value: 'titleName' },
  { text: t('registerDate'), value: 'registerDate' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref ([])

/** method */
const handlerActionHeader = (type: any) => {
  console.log(type)
  switch (type) {
    case 'handlerCustomButton':
      console.log(type)

      break

    default:
      break
  }
}

// search ở fillter header
const handleSearch = async (value: any) => {
  queryParams.pageNumber = 1
  queryParams.search = value
  getPagingByUser()
}
const handleAddUserOrg = async (value: any) => {
  isShowDialogAddUser.value = true
}
const handleDeleteMultiple = async (value: any) => {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}
const handlePageClick = async (value: any) => {
  queryParams.pageNumber = value
  await getPagingByUser()
}
const selectedRows = (e: any) => {
  dataComponent.selectedRowsIds = e
}
async function getPagingByUser() {
  await MethodsUtil.requestApiCustom(ApiUser.getPagingUserOrgByList, TYPE_REQUEST.GET, queryParams).then((value: any) => {
    items.value = value.data.pageLists
    dataComponent.totalRecord = value.data.totalRecord
  })
}

watch(() => organization.value.id, val => {
  if (organization.value.id && organization.value.id !== null) {
    queryParams.orStructureId = organization.value.id
    getPagingByUser()
  }
}, { deep: true, immediate: true })
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title="t('user-list')"
        bg-custom="bg-primary"
        :title-custom="t('add-user')"
        is-custom-btn
        @click="handlerActionHeader"
      />
    </div>
    <div class="my-6">
      <CpHeaderAction
        :is-fillter="false"
        is-delete
        :disabled-delete="disabledDelete"
        @search="handleSearch"
        @add-handler="handleAddUserOrg"
        @deleteMultiple="handleDeleteMultiple"
      />
    </div>
    <div>
      <CmTable
        :headers="headers"
        :items="items"
        :total-record="dataComponent.totalRecord"
        :page-number="queryParams.pageNumber"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullName'">
            <CpCustomInfo
              :context="context"
            />
          </div>
        </template>
        <!--
          <template #rowItem="{ col, context }">
          <div v-if="col === 'actions'">
          <span class="px-2">
          <VIcon
          :icon="ActionType[1].icon"
          :size="18"
          class="align-middle"
          :class="ActionType[1].color"
          @click="handleDeleteItem(context)"
          />
          <VTooltip
          activator="parent"
          location="start"
          >
          {{ t(ActionType[1].name) }}
          </VTooltip>
          </span>
          <span class="px-2">
          <VIcon
          :icon="ActionType[0].icon"
          :size="18"
          class="align-middle"
          :class="ActionType[0].color"
          @click="handleEditTitle(context)"
          />
          <VTooltip
          activator="parent"
          location="start"
          >
          {{ t(ActionType[0].name) }}
          </VTooltip>
          </span>
          </div>
          </template>
        -->
      </CmTable>
    </div>
  </div>
</template>

