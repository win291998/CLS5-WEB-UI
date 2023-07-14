<script setup lang="ts">
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CmTable from '@/components/common/CmTable.vue'
import CourseService from '@/api/course/index'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()

const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const queryParams = ref<any>({
  search: null,
  sort: '-modifiedDate',
  pageNumber: 1,
  pageSize: 10,
})
const disabledDelete = computed(() => !data.selectedRowsIds.length)
const isShowDialogNotiDelete = ref(false)

// data table
const items = ref([])
const totalRecord = ref(0)
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name', type: 'custom' },
  { text: t('topic'), value: 'topicCourseName' },
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('form-study'), value: 'formStudy', type: 'custom' },
  { text: t('duration-time'), value: 'time', type: 'custom' },
  { text: t('date-update'), value: 'modifiedDateString' },
  { text: '', value: 'actions', width: 150, type: 'custom' },
])

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.search = value

  await getListAttendance()
}
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page
  await getListAttendance()
}

// click  multi delete btn to show modal confirm
function deleteItems() {
  data.deleteIds = data.selectedRowsIds
  isShowDialogNotiDelete.value = true
}

// hành động của dialog
function confirmDialogDelete(event: any) {
  if (event)
    deleteAction()
}

// delete action
async function deleteAction() {
  const params = {
    ids: data.deleteIds,
  }

  // await MethodsUtil.requestApiCustom(CourseService.PostDeleteCourse, TYPE_REQUEST.POST, params)
  //   .then(async (value: any) => {
  //     toast('SUCCESS', t(value?.message))
  //     queryParams.value = {
  //       pageNumber: 1,
  //       pageSize: queryParams.value.pageSize,
  //     }
  //     await pushQuery()
  //     data.deleteIds = []
  //     data.selectedRowsIds = []
  //   })
  //   .catch(() => {
  //     toast('ERROR', t('USR_DeleteFail'))
  //   })
}
function selectedRows(e: any) {
  data.selectedRowsIds = e
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}

/* ==> thực hiện các action được chọn ở header page CP */
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      router.push({ name: 'course-add', params: { tab: 'infor' } })
      break
    case 'handlerCustomButton':

      router.push({ name: 'course-approve' })
      break

    default:
      break
  }
}
async function getListAttendance() {
  const params = {
    id: Number(route.params.id),
  }
  await window.requestApiCustom(CourseService.GetListCheckinCourse(params.id), window.TYPE_REQUEST.GET, params).then(async (value: any) => {
    if (value?.data) {
      items.value = value.data.pageLists
      totalRecord.value = value.data.totalRecord
    }
  })
}
</script>

<template>
  <div>
    <div class="text-medium-lg mb-6">
      {{ t('attendance-list') }}
    </div>
    <div>
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        is-approve
        :disabled-delete="disabledDelete"
        @click="handleClickBtn"
        @update:keyword="handleSearch"
      />
    </div>
    <div>
      <!-- ref="refTableCourseList" -->
      <CmTable
        v-model:pageSize="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        :page-number="queryParams.pageNumber"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      />
    </div>
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="t('warning-delete-course')"
      :confirmation-msg="t('Delete-course')"
      @confirm="confirmDialogDelete"
    />
  </div>
</template>
