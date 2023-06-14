<script lang="ts" setup>
import { courseListManagerStore } from '@/stores/admin/course/courseList'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
import StringUtil from '@/utils/StringUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import { StatusTypeFormStudy } from '@/constant/data/status.json'
import StringJwt from '@/utils/Jwt'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmCollapse from '@/components/common/CmCollapse.vue'

window.showAllPageLoading('COMPONENT')

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpCourseFilter = defineAsyncComponent(() => import('@/components/page/Admin/course/CpCourseFilter.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpCustomInforCourse = defineAsyncComponent(() => import('@/components/page/gereral/CpCustomInforCourse.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpMdApproveCourse = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdApproveCourse.vue'))
const CpMdRatioPointContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdRatioPointContent.vue'))
const CpMdFeedBack = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdFeedBack.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()

/** Store */
const storeCourseListManager = courseListManagerStore()
const {
  isShowFilter, queryParams, items, totalRecord,
  settingDefaults, constant, compoboxSortCourse,
  users, topicCombobox, disabledDelete,
  disabledApprove, isShowDialogNotiDelete,
} = storeToRefs(storeCourseListManager)
const {
  handlerActionHeader, handleFilterCombobox,
  handlePageClick, selectedRows, pushQuery, handleSearch,
  deleteItem, deleteItems, confirmDialogDelete,
  updateDialogVisible, approveCourses, approve,
} = storeCourseListManager

const storeCourseApproveManager = courseApproveManagerStore()
const { idModalSendApproveCourse, idModalSendRatioPoint } = storeToRefs(storeCourseApproveManager)
const { sendApproveCourse } = storeCourseApproveManager

const queryParamsInit = {
  dateFrom: null,
  dateTo: null,
  userId: null,
  search: null,
  sort: '-modifiedDate',
  pageNumber: 1,
  pageSize: 10,
  topicIds: [],
  formOfStudy: null,
  isDisplayHome: null,
  statusId: null,
  ownerId: null,
}
watch(() => route.query, (val: any) => {
  if (Object.keys(val).length > 0) {
    queryParams.value.pageNumber = val.pageNumber ? Number(val.pageNumber) : 1
    queryParams.value.pageSize = val.pageSize ? Number(val.pageSize) : 10
    queryParams.value.search = val.search ? val.search : null
    queryParams.value.topicIds = (val.topicIds && val.topicIds.length) ? val.topicIds.map((item: any) => Number(item)) : []
    queryParams.value.formOfStudy = val.formOfStudy ? Number(val.formOfStudy) : null
    queryParams.value.sort = val.sort ? val.sort : '-modifiedDate'

    queryParams.value.isDisplayHome = val.isDisplayHome === 'true' ? true : val.isDisplayHome === 'false' ? false : null
    queryParams.value.statusId = val.statusId ? Number(val.statusId) : null
    queryParams.value.dateFrom = val.dateFrom ? val.dateFrom : null
    queryParams.value.userId = val.userId ? val.userId : null
    queryParams.value.ownerId = val.ownerId ? Number(val.ownerId) : null
  }
}, { deep: true, immediate: true })
watch(() => queryParams.value, (val: any) => {
  if (val.dateFrom && val.dateTo) {
    const start: any = new Date(val.dateFrom)
    const end: any = new Date(val.dateTo)
    if ((start - end) > 0)
      return
  }
  queryParams.value = val
  if (Object.keys(val).length <= 0) {
    queryParams.value = {
      pageNumber: 1,
      pageSize: 10,
      search: null,
      topicIds: [],
      formOfStudy: null,
      sort: '-modifiedDate',
      isDisplayHome: null,
      statusId: null,
      dateFrom: null,
      dateTo: null,
      ownerId: null,
      userId: null,
    }
  }

  fetchListCourse()
}, { deep: true, immediate: true })

const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-course'), value: 'name', type: 'custom' },
  { text: t('topic'), value: 'topicCourseName' },
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('form-study'), value: 'formStudy', type: 'custom' },
  { text: t('duration-time'), value: 'time', type: 'custom' },
  { text: t('date-update'), value: 'modifiedDateString' },
  { text: '', value: 'actions', width: 150 },
])
const isShowModalFeedBack = ref(false)
const dataFeedBack = ref<any>()

// hàm trả về các loại action khi click
function actionItem(type: any) {
  console.log(type)

  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    case 'ActionSendAgree':
      sendApproveCourse(type[1].id, type[1].courseApprovers || [])
      break
    case 'approve':
      approve(type[1].id)
      break
    case 'ActionViewFeedBack':
      handleViewFeedBack(type[1].id)
      break
    case 'ActionEdit':
      router.push({ name: 'course-edit', params: { tab: 'infor', id: type[1].id } })
      break
    default:
      break
  }
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'delete':
      deleteItems()
      break

    case 'approve':
      approveCourses()
      break

    default:
      break
  }
}
async function handleViewFeedBack(id: number) {
  isShowModalFeedBack.value = true

  const params = {
    id,
  }
  await MethodsUtil.requestApiCustom(CourseService.GetFeedBackCourse, TYPE_REQUEST.GET, params).then((value: any) => {
    console.log(value)
    dataFeedBack.value = value.data?.feedback
  })
}
async function handleApproveCourse() {
  queryParams.value = queryParamsInit
  await pushQuery()
}

// Fetch data danh sách khóa học
async function fetchListCourse() {
  if (!route?.query?.sort) {
    const sortSetting = settingDefaults?.value.find(item => item.typeId === 8) // type 8 cài đặt mặc định sắp xếp khóa học
    if (sortSetting && sortSetting?.value) {
      const sortDefault = constant.value.sortCourseDefault?.find(item => item.value === sortSetting.value)
      if (sortDefault && compoboxSortCourse.value?.find(item => item.key === sortDefault.key))
        queryParams.value.sort = sortDefault?.key
    }
  }
  const params = {
    ...queryParams.value,
    role: StringJwt.getRole(),
  }
  await MethodsUtil.requestApiCustom(CourseService.GetCourseList, TYPE_REQUEST.GET, params).then(async (value: any) => {
    if (value?.data) {
      const userIds = MethodsUtil.getPropertyByArray(value?.data?.pageLists, 'createdBy')
      users.value = await MethodsUtil.getUserInfoByIds(userIds)
      if (value.data.pageLists !== null) {
        value.data.pageLists.forEach((element: any) => {
          const topic = topicCombobox.value?.find((x: any) => x.id === element.topicCourseId)

          const user = users.value.pageLists.find((x: any) => x.id === element.createdBy)
          if (!window._.isEmpty(topic))
            element.topicCourseName = topic.name

          if (user) {
            element.firstName = user.firstName
            element.lastName = user.lastName
          }
          element.actions = element.actions.map((el: any) => {
            return MethodsUtil.checkActionType(el, actionItem)
          })
        })
      }
      if (value.data) {
        value.data.pageLists.forEach((item: any) => {
          item.isDisabled = !item.actions.find((x: any) => x.id === 2)
        })
      }

      items.value = value.data.pageLists
      totalRecord.value = value.data.totalRecord
    }
  })
}

// chạy
window.hideAllPageLoading()
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title-custom="t('course-approve')"
        :title-custom-add="t('add-course')"
        :title="t('list-course')"
        is-custom-btn
        is-custom-add-btn
        @click="handlerActionHeader"
      />
    </div>

    <CmCollapse :is-show="isShowFilter">
      <CpCourseFilter
        :data-filter="queryParams"
        @update="($event: any) => handleFilterCombobox($event)"
      />
    </CmCollapse>

    <div>
      <CpHeaderAction
        is-delete
        is-fillter
        is-approve
        :disabled-delete="disabledDelete"
        :disabled-approve="disabledApprove"
        @click="handleClickBtn"
        @search="handleSearch"
      />
    </div>
    <div id="cap-report-overview">
      <!-- ref="refTableCourseList" -->
      <CmTable
        v-model:pageSize="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        custom-id="courseContentId"
        :page-number="queryParams.pageNumber"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <CpCustomInforCourse
              label-title="name"
              label-sub-title="statusId"
              :context="context"
            />
          </div>
          <div v-if="col === 'fullname'">
            {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'formStudy'">
            <CmChip
              class="ma-2"
              :color="MethodsUtil.checkType(context.formOfStudyName, StatusTypeFormStudy, 'name')?.color"
            >
              <VIcon
                start
                icon="carbon:dot-mark"
                size="12"
              />
              <span>{{ t(MethodsUtil.checkType(context.formOfStudyName, StatusTypeFormStudy, 'name')?.name) }}</span>
            </CmChip>
          </div>
          <div v-if="col === 'time'">
            {{ DateUtil.formatSecond(context.time) }}
          </div>
        </template>
      </CmTable>
    </div>
    <CpMdApproveCourse
      v-model:is-dialog-visible="idModalSendApproveCourse"
      @confirm="handleApproveCourse"
    />
    <CpMdRatioPointContent
      v-model:is-dialog-visible="idModalSendRatioPoint"
    />
    <CpConfirmDialog
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="t('warning-delete-course')"
      :confirmation-msg="t('Delete-course')"
      :is-dialog-visible="isShowDialogNotiDelete"
      @update:isDialogVisible="($event) => updateDialogVisible($event)"
      @confirm="confirmDialogDelete"
    />
    <CpMdFeedBack
      v-model:is-show-modal-feed-back="isShowModalFeedBack"
      :data-feed-back="dataFeedBack"
    />
  </div>
</template>
