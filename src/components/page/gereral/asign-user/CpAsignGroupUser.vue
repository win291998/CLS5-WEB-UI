<script setup lang="ts">
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import CpActionHeaderPage from '@/components/page/gereral/CpActionHeaderPage.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpMdAddTypeUser from '@/components/page/gereral/asign-user/modal/CpMdAddTypeUser.vue'
import toast from '@/plugins/toast'
import ExamService from '@/api/exam'
import { tableStore } from '@/stores/table'

const props = withDefaults(defineProps<Props>(), ({
  title: 'list-group-user',
  titleCustomBtn: 'group-add"',
  typeTitleName: 'user-group-name',
  api: ExamService.PostGroupShift,
  typeRequest: TYPE_REQUEST.POST,
}))
interface Props {
  typeId?: number
  title?: string
  typeTitleName?: string
  titleCustomBtn?: string
  api?: any
  typeRequest?: any
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

const queryParams = ref<any>({
  examId: null,
  pageNumber: 1,
  pageSize: 10,
  keyword: null,
  testId: null,
  isAdd: false,
})

const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t(props.typeTitleName), value: 'name', type: 'custom' },
  { text: t('description'), value: 'description' },
  { text: '', value: 'actions', width: 150 },
])
const items = ref<any[]>([])
const totalRecord = ref<number>(0)
const dataComponent = reactive({
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

const disabledBtnHeaderAction = computed(() => !dataComponent.selectedRowsIds.length)

// hàm trả về các loại action từ header filter
// bật tắt filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}
const isShowDialogNotiDelete = ref(false)
const isShowDialogAddTeacher = ref(false)

// Function to handle when click button Delete
function deleteItem(id: number) {
  dataComponent.deleteIds = [id as never]
  isShowDialogNotiDelete.value = true
}
function deleteItems() {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}
function confirmDialogDelete(event: any) {
  if (event)
    deleteAction()
}

// delete action
// Hành động xóa năng lực
async function deleteAction() {
  const params = {
    examId: Number(route.params.id),
    testId: Number(route.params.thematicId),
    typeId: props.typeId,
    userModel: dataComponent.deleteIds,
  }
  await MethodsUtil.requestApiCustom(ExamService.PostDeletePeople, TYPE_REQUEST.POST, params).then((value: any) => {
    getListTeacher()
    dataComponent.selectedRowsIds = []
    dataComponent.deleteIds = []
    toast('SUCCESS', t(value.message))
  })
}
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value
}
function getListTeacher() {
  queryParams.value.examId = Number(route.params.id)
  queryParams.value.testId = Number(route.params.thematicId)
  MethodsUtil.requestApiCustom(props.api, props.typeRequest, queryParams.value).then((result: any) => {
    result.data.pageLists.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 2 }),
      ]
    })
    queryParams.UserIds = result.data.pageLists.map((i: any) => i.id)
    items.value = result.data.pageLists
    totalRecord.value = result.data.totalRecord
  })
}
getListTeacher()

const storeTable = tableStore()

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    default:
      break
  }
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      isShowDialogAddTeacher.value = true
      break

    default:
      break
  }
}
async function handleAddTeacher(data: any) {
  const params = {
    examId: Number(route.params.id),
    testId: Number(route.params.thematicId),
    typeId: props.typeId,
    userModel: data,
  }
  await MethodsUtil.requestApiCustom(ExamService.PostCreatePeople, TYPE_REQUEST.POST, params).then((result: any) => {
    getListTeacher()
    toast('SUCCESS', t(result.message))
    isShowDialogAddTeacher.value = false
  })
    .catch((err: any) => {
      toast('ERROR', window.getErrorsMessage(err.response.data.error, t))
    })
}
onMounted(() => {
  const { callBackAction } = storeToRefs(storeTable)
  callBackAction.value = actionItem
})
watch(queryParams.value, (val: any) => {
  getListTeacher()
})
</script>

<template>
  <div>
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t(title)"
        :title-custom-add="t(titleCustomBtn)"
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>
    <div class="my-3">
      <CpHeaderAction
        is-delete
        :disabled-delete="disabledBtnHeaderAction"
        :is-fillter="false"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
    </div>
    <div>
      <CmTable
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="dataComponent.selectedRowsIds"
        is-border-row
        is-update-row-force
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <CpCustomInfo
              :is-show-email="false"
              :context="context"
            />
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :confirmation-msg-sub-title="t('confirm-delete-teacher')"
      :confirmation-msg="t('delete-teacher')"
      @confirm="confirmDialogDelete"
    />
    <CpMdAddTypeUser
      v-if="isShowDialogAddTeacher"
      v-model:is-dialog-visible="isShowDialogAddTeacher"
      :type-id="typeId"
      @confirm="handleAddTeacher"
    />
  </div>
</template>
