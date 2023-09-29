<script setup lang="ts">
import CpFilterContentRepository from '@/components/page/Admin/content/content-repository/CpFilerContentRepository.vue'
import CmCollapse from '@/components/common/CmCollapse.vue'
import ObjectUtil from '@/utils/ObjectUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmTable from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import { tableStore } from '@/stores/table'
import type { Params } from '@/typescript/interface/params'
import CpConfirmDialogVue from '@/components/page/gereral/CpConfirmDialog.vue'
import toast from '@/plugins/toast'
import { ContentType } from '@/constant/data/contentCourseType.json'
import CmDropDown from '@/components/common/CmDropDown.vue'
import CourseService from '@/api/course'
import DateUtil from '@/utils/DateUtil'
import ComboboxService from '@/api/combobox'
import StringUtil from '@/utils/StringUtil'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** data */
// bật tắt filter
const isShowFilter = ref(true)
const items = ref<Any[]>([])
const totalRecord = ref<number>(0)
const selected = ref<any[]>([])
interface QueryParam extends Params {
  archiveTypeId: any
  authorId: any
  fromDate: any
  listTopic: any[]
  pageNumber: number
  pageSize: number
  role: number
  searchData: string
  toDate: any
  topicId: any
}

const queryParams = ref<QueryParam>({
  pageSize: 10,
  pageNumber: 1,
  archiveTypeId: null,
  authorId: null,
  fromDate: '',
  listTopic: [],
  role: 1,
  searchData: '',
  toDate: '',
  topicId: null,
})
const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('content'), value: 'name' },
  { text: t('author'), value: 'authorName' },
  { text: t('topic'), value: 'topicName' },
  { text: t('type-content'), value: 'archiveTypeName' },
  { text: t('create-day'), value: 'createDate', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]
const isShowDetailAll = ref(false)
const questionCurrentView = ref()
const isShowModalView = ref(false)

/** computed */
const disabledBtnHeaderAction = computed(() => !selected.value.length)
const isShowModalConfirmSendApprove = ref(false)

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'send-approve':
      isShowModalConfirmSendApprove.value = true
      break

      // case 'delete':
      //   deleteItems()
      //   break

    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.searchData = value
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      router.push({ name: 'survey-add' })
      break

    default:
      break
  }
}
const comboboxAuthorContent = ref<Any[]>([])
async function getAuthorContent() {
  await MethodsUtil.requestApiCustom(ComboboxService.GetComboboxAuthorContent, TYPE_REQUEST.GET).then(async (result: any) => {
    const data = await MethodsUtil.getListInforUser(result.data)
    data.forEach((item: Any) => {
      item.name = StringUtil.formatFullName(item.firstName, item.lastName)
    })
    comboboxAuthorContent.value = data
  })
}
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
callBackAction.value = actionItem
async function getListQuestion() {
  await MethodsUtil.requestApiCustom(CourseService.PostListStockContent, TYPE_REQUEST.POST, queryParams.value).then(({ data }: any) => {
    data?.pageLists.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
      ]
      const item = comboboxAuthorContent.value.find(i => i.id === element.authorId)

      if (item)
        element.authorName = item.name
    })
    items.value = data?.pageLists
    totalRecord.value = data?.totalRecord
  })
}
const isShowModalConfirmDelete = ref(false)

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionEdit':
      // eslint-disable-next-line no-case-declarations
      const item = ContentType.find(i => i.id === type[1].archiveTypeId) as Any
      router.push({ name: 'content-repository-edit', params: { id: type[1].id, type: item.name } })
      break
    case 'ActionDelete':
      selected.value = [type[1]]
      isShowModalConfirmDelete.value = true
      break

    default:
      break
  }
}
onMounted(async () => {
  getAuthorContent().then(() => {
    getListQuestion()
  })
})

watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(val)
  router.push({
    query: {
      tab: route.query.tab,
      ...params,
    },
  })
  getListQuestion()
}, { deep: true })
function exportExcel() {
  const payload = {
    fromDate: queryParams.value.fromDate,
    toDate: queryParams.value.toDate,
    searchData: queryParams.value.searchData,
    role: queryParams.value.role,
  }
  MethodsUtil.dowloadSampleFile(CourseService.GetExportExcelArchiveContent, TYPE_REQUEST.GET, 'DanhSachNganHangNoiDung.xlxs', payload)
}

function confirmDelete() {
  MethodsUtil.requestApiCustom(CourseService.PostDeleteContentArchive, TYPE_REQUEST.POST, { model: selected.value.map(i => i.id) }).then((result: Any) => {
    toast('SUCCESS', t('success-delete-gift-group'))
    getListQuestion()
    selected.value = []
  }).catch((err: Any) => {
    toast('SUCCESS', t(err.response.data.message))
  })
}

const loadingShow = ref(false)
async function getInforContent(result: any, id: number) {
  loadingShow.value = true
  const params = {
    listId: [Number(id)],
  }
  await MethodsUtil.requestApiCustom(QuestionService.PostSurveyDetail, TYPE_REQUEST.POST, params).then(({ data }: any) => {
    result.value = data
  })
}

const actionAdd = [
  {
    title: t('text-content'),
    icon: MethodsUtil.checkType('text-content', ContentType, 'name')?.icon,
    underline: true,
    action: () => {
      router.push({
        name: 'content-repository-add',
        params: {
          tab: route.params.tab,
          type: 'text-content',
        },
      })
    },
  },

  {
    title: t('video-content'),
    icon: MethodsUtil.checkType('video-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-repository-add',
        params: {
          tab: route.params.tab,
          type: 'video-content',
        },
      })
    },
  },
  {
    title: t('document-course'),
    icon: MethodsUtil.checkType('document-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-repository-add',
        params: {
          tab: route.params.tab,
          type: 'document-content',
        },
      })
    },
  },
  {
    title: t('audio'),
    icon: MethodsUtil.checkType('audio-content', ContentType, 'name')?.icon,
    underline: true,
    action: () => {
      router.push({
        name: 'content-repository-add',
        params: {
          tab: route.params.tab,
          type: 'audio-content',
        },
      })
    },
  },
  {
    title: t('scorm'),
    icon: MethodsUtil.checkType('scorm-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-repository-add',
        params: {
          tab: route.params.tab,
          type: 'scorm-content',
        },
      })
    },
  },
  {
    title: t('Iframe'),
    icon: MethodsUtil.checkType('iframe-content', ContentType, 'name')?.icon,
    action: () => {
      router.push({
        name: 'content-repository-add',
        params: {
          tab: route.params.tab,
          type: 'iframe-content',
        },
      })
    },
  },
]
</script>

<template>
  <div>
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t('content-warehouse-management')"
        :title-custom-add="t('add-content')"
        is-export-btn
        :action-add="actionAdd"
        @click="handlerActionHeader"
        @exportExcel="exportExcel"
      >
        <template
          #actions
        >
          <div
            cols="12"
            md="3"
            class="d-flex justify-end  mr-2"
          >
            <CmDropDown
              :title="t('add-content')"
              variant="elevated"
              color="primary"
              :list-item="actionAdd"
              :type="2"
              icon="tabler:chevron-down"
              @click.stop
            />
          </div>
        </template>
      </CpActionHeaderPage>
    </div>
    <CmCollapse :is-show="isShowFilter">
      <CpFilterContentRepository
        v-model:topicId="queryParams.topicId"
        v-model:authorId="queryParams.authorId"
        v-model:typeId="queryParams.archiveTypeId"
        v-model:date-from="queryParams.fromDate"
        v-model:date-to="queryParams.toDate"
        v-model:page-number="queryParams.pageNumber"
        :combobox-author-content="comboboxAuthorContent"
      />
    </CmCollapse>
    <div class="my-3">
      <CpHeaderAction
        is-delete
        is-send-approve
        :disabled-delete="disabledBtnHeaderAction"
        :disabled-send-approve="disabledBtnHeaderAction"
        is-fillter
        @click="handleClickBtn"
        @update:keyword="handleSearch"
        @delete-multiple="() => { isShowModalConfirmDelete = true }"
      />
    </div>
    <div>
      <CmTable
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="selected"
        is-update-row-force
        :headers="headers"
        :items="items"
        return-object
        :total-record="totalRecord"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'createDate'">
            <div>{{ DateUtil.formatDateToDDMM(context[col]) }}</div>
          </div>
        </template>
      </CmTable>
    </div>
    <CpConfirmDialogVue
      v-model:is-dialog-visible="isShowModalConfirmDelete"
      :confirmation-msg="t('delete-survey-test')"
      :type="2"
      @confirm="confirmDelete"
    />
  </div>
</template>
