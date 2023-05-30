<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'
import CpHeaderAction from '../Admin/organization/user-group/CpHeaderAction.vue'
import CpConfirmDialog from './CpConfirmDialog.vue'
import CmTable from '@/components/common/CmTable.vue'
import toast from '@/plugins/toast'
import type { Params } from '@/typescript/interface/params'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), {
  header: () => ([]),
  actions: () => ([]),
  typeRequest: '',
  actionAdd: null,
  actionsTable: () => ([]),
  componentEdit: null,
  apiDetail: null,
  titlePage: '',
  routeReport: '',
})
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const router = useRouter()
interface Api {
  api: string
  method: string
  payload: Any
  fileName: string
}
interface Props {
  header: Header[]
  actions: Item[]
  apiList: Api
  apiAdd: Api
  typeRequest: string
  actionAdd?: void | null
  actionsTable: Item[]
  componentEdit: null
  apiGetDetail: Api
  apiEdit: Api
  apiDelete: Api
  apiExportExcel: Api
  titlePage: string
  routeReport: string
  routerEdit?: string | null
}

const TITLE = Object.freeze({
  TITLE_PAGE: t('list-cost'),
})
interface QueryParams extends Params {
  keyword: string
}
const queryParams = reactive<QueryParams>({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
})

const isEdit = ref<boolean>(false)
const isShowModalEdit = ref<boolean>(false)
function showModalEdit() {
  if (!props.routerEdit) {
    isEdit.value = false
    isShowModalEdit.value = true
  }
  else {
    router.push({ name: `${props.routerEdit}-add` })
  }
}
const dataDetail = ref<any>({})
async function getDataDetail(id: number) {
  if (!props.routerEdit) {
    const { data } = await MethodsUtil.requestApiCustom(props.apiGetDetail.api, props.apiGetDetail.method, { id })
    dataDetail.value = data
  }
  else {
    router.push({ name: `${props.routerEdit}-edit`, params: { id } })
  }
}

// xóa item
const isShowModalDelete = ref<boolean>(false)
const listId = ref<number[] | undefined>([])
function showModalDelete(id?: number) {
  if (id)
    listId.value = [id]
  isShowModalDelete.value = true
}
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionDelete':
      showModalDelete(type[1].id)
      break
    case 'ActionEdit':
      await getDataDetail(type[1].id)
      isEdit.value = true
      isShowModalEdit.value = true
      break
    case 'ActionViewReport':
      router.push({ name: props?.routeReport })
      break
    default:
      break
  }
}

// lấy data table
const items = ref<Item[]>([])
const totalRecord = ref<number>(0)
async function getDataTable() {
  const { data } = await MethodsUtil.requestApiCustom(props.apiList.api, props.apiList.method, queryParams)
  if (data) {
    data.pageLists.forEach((element: Item) => {
      element.actions = props.actionsTable
      element.actions = element.actions.map((el: any) => {
        return MethodsUtil.checkActionType(el, actionItem)
      })
    })
    items.value = data.pageLists
    totalRecord.value = data.totalRecord
  }
}
getDataTable()

function handlerSearch(val: string) {
  queryParams.keyword = val
  queryParams.pageNumber = 1
  queryParams.pageSize = 10
  getDataTable()
}
function handlePageClick(pageNumber: number, pageSize: number) {
  queryParams.pageNumber = pageNumber
  queryParams.pageSize = pageSize
  getDataTable()
}

// Xác nhận thêm hoặc sửa
function handlerAdd(data: any) {
  console.log(props.apiAdd)

  MethodsUtil.requestApiCustom(props.apiAdd.api, props.apiAdd.method, data).then(() => {
    isShowModalEdit.value = false
    getDataTable()
    toast('SUCCESS', t('add-success'))
  }).catch((err: any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}
function handlerEdit(data: any) {
  MethodsUtil.requestApiCustom(props.apiEdit.api, props.apiEdit.method, data).then(() => {
    isShowModalEdit.value = false
    getDataTable()
    toast('SUCCESS', t('USR_UpdateSuccess'))
  }).catch((err: any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}

function confirmModal(val: any) {
  console.log(isEdit)

  if (isEdit.value)
    handlerEdit(val)
  else handlerAdd(val)
}

function confirmDelete() {
  MethodsUtil.requestApiCustom(props.apiDelete.api, props.apiDelete.method, { listId: listId.value }).then(() => {
    isShowModalDelete.value = false
    getDataTable()
    toast('SUCCESS', t('USR_DeleteSuccess'))
  }).catch((err: any) => {
    toast('ERROR', t(err.response.data.errors[0].message))
  })
}

function cancelModalDelete() {
  listId.value = []
}
function exportExcel() {
  MethodsUtil.dowloadSampleFile(props.apiExportExcel.api, props.apiExportExcel.method, props.apiExportExcel.fileName, props.apiExportExcel?.payload)
}
</script>

<template>
  <CpHeaderAction
    class="mt-6"
    :title-page="titlePage"
    :is-show-add-group="false"
    :is-disabled-delete="!listId?.length"
    @click-add="showModalEdit"
    @update:key-search="handlerSearch"
    @click-export="exportExcel"
  />
  <CmTable
    v-model:selected="listId"
    :headers="header"
    :items="items"
    :total-record="totalRecord"
    @handlePageClick="handlePageClick"
  >
    <template #rowItem="{ col, context, dataCol }">
      <div v-if="dataCol?.isDate">
        {{ DateUtil.formatDateToDDMM(context[col]) }}
      </div>
    </template>
  </CmTable>

  <Component
    :is="props.componentEdit"
    v-if="props.componentEdit"
    v-model:is-show="isShowModalEdit"
    :data-detail="dataDetail"
    @confirm="confirmModal"
  />

  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalDelete"
    :type="2"
    :confirmation-msg="t('delete')"
    @confirm="confirmDelete"
    @update:is-dialog-visible="cancelModalDelete"
  />
</template>
