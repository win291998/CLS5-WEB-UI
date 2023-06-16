<script lang="ts" setup>
import CpHeaderActionExam from '@/components/page/Admin/exam/CpHeaderActionExam.vue'
import CmTable from '@/components/common/CmTable.vue'
import type { Any } from '@/typescript/interface'
import type { Params } from '@/typescript/interface/params'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringUtil from '@/utils/StringUtil'
import DateUtil from '@/utils/DateUtil'
import CpCustomInforCourse from '@/components/page/gereral/CpCustomInforCourse.vue'

const { t } = window.i18n()

const headers = [
  { text: '', value: 'checkbox', width: 50 },
  { text: t('name-exam'), value: 'name', type: 'custom' },
  { text: t('user-create'), value: 'fullName' },
  { text: t('start-time'), value: 'startDateTime', type: 'custom', isDate: true },
  { text: t('end-time'), value: 'endDateTime', type: 'custom', isDate: true },
  { text: '', value: 'actions', width: 150 },
]
const items = ref<Any[]>([])
const totalRecord = ref<number>(0)
interface QueryParams extends Params {
  pageNumber: number
  pageSize: number
  fromDate: string
  toDate: string
  sort: string[]
  searchData: string
  role: number
  authorId: number | null
}
const queryParams = ref<QueryParams>({
  pageNumber: 1,
  pageSize: 10,
  fromDate: '',
  authorId: null,
  toDate: '',
  sort: ['-startDate'],
  searchData: '',
  role: 1,

})
const authorIds = ref<number[]>([])
async function getListExam() {
  const { data } = await MethodsUtil.requestApiCustom(QuestionService.GetListExam, TYPE_REQUEST.GET, queryParams.value)
  data.pageLists.forEach((element: Any) => {
    authorIds.value.push(element.authorId)
    element.actions = element.actions.map((el: any) => {
      return MethodsUtil.checkActionType(el, actionItem)
    })
  })
  items.value = data.pageLists
  totalRecord.value = data.totalRecord
}
getListExam()

function actionItem(type: any) {
  switch (type[0]?.name) {
    case 'ActionEdit':
      // console.log('ActionEdit')

      break
    default:
      break
  }
}
</script>

<template>
  <CpHeaderActionExam
    v-model:toDate="queryParams.toDate"
    v-model:fromDate="queryParams.fromDate"
    v-model:authorId="queryParams.authorId"
    v-model:searchData="queryParams.searchData"
    v-model:pageNumber="queryParams.pageNumber"
    v-model:pageSize="queryParams.pageSize"
    :author-ids="authorIds"
  />
  <CmTable
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
  >
    <template #rowItem="{ col, context, dataCol }">
      <div v-if="col === 'name'">
        <CpCustomInforCourse
          label-title="name"
          label-sub-title="statusId"
          :context="context"
        />
      </div>
      <div v-if="col === 'fullName'">
        {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
      </div>
      <div v-if="dataCol?.isDate">
        {{ DateUtil.formatDateToDDMM(context[col]) }}
      </div>
    </template>
  </CmTable>
</template>
