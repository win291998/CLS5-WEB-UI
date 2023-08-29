<script setup lang="ts">
import CmCollapse from '@/components/common/CmCollapse.vue'
import ObjectUtil from '@/utils/ObjectUtil'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpQuestionFilter from '@/components/page/Admin/content/question/question-list/CpQuestionFilter.vue'
import CpQuestionName from '@/components/page/gereral/CpQuestionName.vue'
import CmTable from '@/components/common/CmTable.vue'
import CpContentView from '@/components/page/gereral/CpContentView.vue'
import CpMdQuestionView from '@/components/page/Admin/content/question/modal/CpMdQuestionView.vue'
import type { Any } from '@/typescript/interface'
import CmButton from '@/components/common/CmButton.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import { QuestionType } from '@/constant/data/questionType.json'
import { tableStore } from '@/stores/table'

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
const dataComponent = reactive({
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

const queryParams = ref<any>({
  topic: [],
  level: null,
  isGroup: null,
  createdBy: null,
  type: null,
  status: null,
  pageSize: 10,
  pageToken: null,
  searchTerm: null,
  sortBy: null,
  startDate: null,
  endDate: null,
})
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('question'), value: 'name', type: 'custom', width: 750 },
  { text: t('question-type'), value: 'type', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])

const isShowDetailAll = ref(false)
const questionCurrentView = ref()

/** computed */
const disabledBtnHeaderAction = computed(() => !dataComponent.selectedRowsIds.length)

/** method */
// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    case 'fillter':
      isShowFilter.value = true
      break

      // case 'delete':
      //   deleteItems()
      //   break

    default:
      break
  }
}
const actionAdd = [
  {
    title: t('create-question'),
    icon: 'circum:pen',
    action: () => {
      router.push({ name: 'question-add' })
    },
  },
  {
    title: t('add-from-file'),
    icon: 'tabler:file-plus',
    action: () => {
      router.push({ name: 'question-add-from-file' })
    },
  },

]

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value
}
function handlerActionHeader(type: any) {
  switch (type) {
    case 'handlerAddButton':
      router.push({ name: 'question-add' })
      break

    default:
      break
  }
}
const storeTable = tableStore()
const { callBackAction } = storeToRefs(storeTable)
callBackAction.value = actionItem
async function getListQuestion() {
  await MethodsUtil.requestApiCustomV5(QuestionService.GetListQuestionV5, TYPE_REQUEST.GET, queryParams.value).then(({ data }: any) => {
    data?.listData.forEach((element: any) => {
      element.actions = [
        MethodsUtil.checkActionType({ id: 1 }),
        MethodsUtil.checkActionType({ id: 2 }),
        MethodsUtil.checkActionType({ id: 4 }),
      ]
    })
    items.value = data?.listData
    totalRecord.value = data?.totalRecords
  })
}
const isShowModalView = ref(false)

// hàm trả về các loại action khi click
async function actionItem(type: any) {
  console.log(type)
  switch (type[0]?.name) {
    case 'ActionEdit':
      router.push({ name: 'question-edit', params: { id: type[1].id } })
      break
    case 'ActionViewDetail':

      console.log(window._.isEmpty(type[1]?.questionData))

      if (window._.isEmpty(type[1]?.questionData)) {
        const result = ref()
        await getInforQuestion(result, type[1].id).then(() => {
          console.log(result.value)
          items.value[type[1].originIndex].questionData = result.value
          questionCurrentView.value = items.value[type[1].originIndex]
          setTimeout(() => {
            isShowModalView.value = true
          }, 500)
        })
      }
      else {
        questionCurrentView.value = items.value[type[1].originIndex]
        isShowModalView.value = true
      }
      break

    default:
      break
  }
}
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position)}.`
}

/* xem chi tiết */
function standardizedDataInitSingle(valueQs: any) {
  if (valueQs.typeId === 6) {
    const answers: any[] = []
    const answerBlank: any[] = []
    valueQs.answersClone = window._.cloneDeep(valueQs.answers)

    valueQs.answers.forEach((element: any) => {
      if (element.isTrue)
        answerBlank[answerBlank.length] = element

      else
        answers[answers.length] = element
    })
    valueQs.answers = answers.map((item: any, index: number) => {
      item.position = index + 1
      return item
    })

    valueQs.answerBlank = answerBlank.map((item: any, index: number) => {
      item.position = index + 1
      return item
    })
    console.log(valueQs)
    const tempElement = document.createElement('div')
    tempElement.innerHTML = valueQs.content

    // Lấy tất cả các phần tử <span> có class="answer-fill-blank"
    const spanElements = tempElement.querySelectorAll('span.answer-fill-blank')

    // Lặp qua từng phần tử và xóa nội dung bên trong
    spanElements.forEach((spanElement: any, index: number) => {
      spanElement.innerHTML = `<span >${valueQs.answerBlank[index]?.content}</span>`
    })
    valueQs.content = tempElement.innerHTML
  }
  if (valueQs.typeId === 7) {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = valueQs.content
    const spanElements = tempElement.querySelectorAll('.answer-select')
    const listAnserView = ref<any[]>([])
    valueQs.answers.forEach((item: any, index: number) => {
      if (!listAnserView.value[item.position])
        listAnserView.value[item.position] = [toRaw(item)]
      else
        listAnserView.value[item.position].push(item)
    })

    // Lặp qua từng phần tử và xóa nội dung bên trong
    spanElements.forEach((spanElement, idx) => {
      const isTrue = listAnserView.value[idx + 1].findIndex((item: any) => item.isTrue)
      spanElement.innerHTML = `<span>Đáp án ${getIndex(isTrue)} <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9l6 6l6-6"></path></svg>
</span>`
    })

    valueQs.content = tempElement.innerHTML
    console.log(valueQs)
  }

  if (valueQs.typeId === 8) {
    const answers: any[] = []
    valueQs.answers.forEach((element: any) => {
      const position = element.position - 1
      if (position > -1) {
        if (answers[position] === undefined) {
          answers[position] = {
            left: null,
            right: null,
          }
        }
        if (element.isTrue === false)
          answers[position].left = element
        else answers[position].right = element
      }
    })
    valueQs.answers = answers
  }

  valueQs.isAutoApprove = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true
  return valueQs
}
function standardizedDataInitCluse(valueQsList: any) {
  valueQsList?.questions.forEach((valueQs: any) => {
    if (valueQs.typeId === 6) {
      valueQs.answersClone = window._.cloneDeep(valueQs.answers)
      const answers: any[] = []
      const answerBlank: any[] = []
      valueQs.answers.forEach((element: any) => {
        if (element.isTrue)
          answerBlank[answerBlank.length] = element

        else
          answers[answers.length] = element
      })
      valueQs.answers = answers.map((item: any, index: number) => {
        item.position = index + 1
        return item
      })
      valueQs.answerBlank = answerBlank.map((item: any, index: number) => {
        item.position = index + 1
        return item
      })
    }
    if (valueQs.typeId === 8) {
      const answers: any[] = []
      valueQs.answers.forEach((element: any) => {
        const position = element.position - 1
        if (position > -1) {
          if (answers[position] === undefined) {
            answers[position] = {
              left: null,
              right: null,
            }
          }
          if (element.isTrue === false)
            answers[position].left = element
          else answers[position].right = element
        }
      })
      valueQs.answers = answers
    }

    valueQs.isAutoApprove = MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true
  })
  return valueQsList
}
const loadingShow = ref(false)
async function getInforQuestion(result: any, id: number) {
  loadingShow.value = true
  await MethodsUtil.requestApiCustomV5(QuestionService.GetDetailQuestion(Number(id)), TYPE_REQUEST.GET).then(({ data }: any) => {
    if (data.isGroup)
      result.value = standardizedDataInitCluse(data)
    else
      result.value = standardizedDataInitSingle(data)
  })
}
async function openDetail(dataQs: any, el: any) {
  const result = ref()
  if (window._.isEmpty(dataQs?.questionData)) {
    items.value[dataQs.originIndex].loadingShow = true

    await getInforQuestion(result, dataQs.id).then(() => {
      console.log(result.value)
      items.value[dataQs.originIndex].questionData = result.value
      setTimeout(() => {
        items.value[dataQs.originIndex].loadingShow = false
      }, 500)
    })
  }
  items.value[dataQs.originIndex].isExpand = true
  nextTick(() => {
    attachClickEvent(el, dataQs)
  })
}
async function closeDetail(dataQs: any) {
  console.log(dataQs)
  items.value[dataQs.originIndex].isExpand = false
}
const contentRef = ref()
function handleSpanClick(event: any, pos: number, dataQs: any) {
  // Xử lý sự kiện khi thẻ span được click
  console.log('Span clicked:', event.target.innerHTML, pos)
  items.value[dataQs.originIndex].listCurrentId = pos
}
function attachClickEvent(el: any, dataQs: any) {
  console.log(el)

  nextTick(() => {
    const answerSpans = el.value?.querySelectorAll('.answer-select')
    console.log(answerSpans)

    answerSpans?.forEach((span: any, pos: any) => {
      span.addEventListener('click', ($event: any) => handleSpanClick($event, pos + 1, dataQs))
    })
  })
}
onMounted(async () => {
  callBackAction.value = actionItem
  if (Object.keys(route.query).length > 1) {
    queryParams.value.keyword = route.query.keyword ? route.query.keyword as string : queryParams.value.keyword
    queryParams.value.sort = route.query.sort ? route.query.sort as string[] : []
    queryParams.value.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.value.pageNumber
    queryParams.value.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.value.pageSize
    queryParams.value.statusId = route.query.statusId ? Number(route.query.statusId) : queryParams.value.statusId
    queryParams.value.typeId = route.query.typeId ? Number(route.query.typeId) : queryParams.value.typeId
    queryParams.value.userId = route.query.userId ? Number(route.query.userId) : queryParams.value.userId
    queryParams.value.levelId = route.query.levelId ? Number(route.query.levelId) : queryParams.value.levelId
    queryParams.value.groupId = route.query.groupId ? Number(route.query.groupId) : queryParams.value.groupId
    queryParams.value.topicId = (route.query.topicId && route.query.topicId.length) ? (route.query.topicId as any)?.map((item: any) => Number(item)) : []
    queryParams.value.dateFrom = route.query.dateFrom ? route.query.dateFrom as string : ''
    queryParams.value.dateTo = route.query.dateTo ? route.query.dateTo as string : queryParams.value.dateTo
    queryParams.value.role = route.query.role ? Number(route.query.role) : 1
  }

  else { await getListQuestion() }
})

watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(JSON.parse(JSON.stringify(val)))
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
    Sort: queryParams.value.sort,
    role: 1,
  }
  MethodsUtil.dowloadSampleFile(QuestionService.GetExportExcelQuestion, TYPE_REQUEST.GET, 'DanhSachCauHoi.xlxs', payload)
}
</script>

<template>
  <div>
    <div class="mt-6">
      <CpActionHeaderPage
        :title="t('questions')"
        :title-custom-add="t('create-question')"
        :title-custom="t('AddFromFiles')"
        is-export-btn
        is-custom-group-btn
        :action-add="actionAdd"
        @click="handlerActionHeader"
        @exportExcel="exportExcel"
      />
    </div>
    <CmCollapse :is-show="isShowFilter">
      <CpQuestionFilter
        v-model:topicId="queryParams.topic"
        v-model:formOfStudy="queryParams.formOfStudy"
        v-model:sort="queryParams.sort"
        v-model:isDisplayHome="queryParams.isDisplayHome"
        v-model:statusId="queryParams.statusId"
        v-model:ownerId="queryParams.ownerId"
        v-model:dateFrom="queryParams.dateFrom"
        v-model:dateTo="queryParams.dateTo"
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
      >
        <template #actionRight>
          <CmButton
            class="ml-3"
            bg-color="bg-white"
            color="white"
            text-color="color-dark"
            :size-icon="20"
            :icon="isShowDetailAll ? 'tabler:eye' : 'tabler:eye-off'"
            :title="isShowDetailAll ? t('collapse-all') : t('show-all')"
            @click="() => isShowDetailAll = !isShowDetailAll"
          />
        </template>
      </CpHeaderAction>
    </div>
    <div>
      <CmTable
        ref="contentRef"
        v-model:pageNumber="queryParams.pageNumber"
        v-model:pageSize="queryParams.pageSize"
        v-model:selected="dataComponent.selectedRowsIds"
        is-update-row-force
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
      >
        <template
          #rowItem="{ col, context }"
        >
          <div v-if="col === 'name'">
            <CpQuestionName
              :status="context.statusId"
              :content-basic="context.isExpand && [3, 6, 7].includes(context.typeId) ? context.questionData.content : context.basic"
              :is-expand="isShowDetailAll || context.isExpand"
              @update:open="($event: any) => openDetail(context, $event)"
              @update:close="closeDetail(context)"
            >
              <div v-show="context.loadingShow">
                <VProgressLinear
                  indeterminate
                  color="primary"
                />
              </div>
              <div v-if="context.typeId !== 10 && !context.loadingShow && context.isExpand">
                <CpContentView
                  :type="context.typeId"
                  :data="context.questionData"
                  :show-content="false"
                  :list-current-id="context.listCurrentId"
                  :show-media="false"
                />
              </div>
              <div v-if="context.typeId === 10 && context.questionData && !context.loadingShow && context.isExpand">
                <div
                  v-for="qsItem in context.questionData?.questions"
                  :key="qsItem.id"
                  class="mb-5"
                >
                  <CpContentView
                    :type="qsItem.typeId"
                    :data="qsItem"
                    :show-media="false"
                  />
                </div>
              </div>
            </CpQuestionName>
          </div>
          <div v-if="col === 'type'">
            <div>{{ t((QuestionType as any)[context?.typeId.toString()]) }}</div>
          </div>
        </template>
      </CmTable>
    </div>
    <div>
      <CpMdQuestionView
        v-model:isShowModal="isShowModalView"
        :data="questionCurrentView"
      />
    </div>
  </div>
</template>
