<script lang="ts" setup>
import CpTestConfig from './CpTestConfig.vue'
import CpQuestionListV5 from '@/components/page/gereral/CpQuestionListV5.vue'
import type { Any } from '@/typescript/interface'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CpModificationQuestion from '@/components/page/gereral/page/CpModificationQuestion.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmTab from '@/components/common/CmTab.vue'

const emit = defineEmits<Emit>()
const listQuestion = ref<Any[]>([])
interface TestConfig {
  pointRatio: number
  courseContentId: number | null
  isShuffleQuestion: boolean
  requiredPointRatio: number
  totalQuestionDisplayInPage: number
  randomQuestion: number
  minuteOfWork: number
  writeLogMinute: number
  numberOfRetake: number
  retakeResultType: number
  reviewId: any
  isRequiredRetest: boolean
  isDisplayPoint: boolean
  isDisplayResult: boolean
  isCorrectAnswer: boolean
  timeFinish: number
  isPreserveTime: boolean
  isReviewTheTest: boolean
  isMaintainStatus: boolean
  isCompleteEnoughPoints: boolean
  isDisplayFalseAnswer: boolean
  [e: string]: any
}

const testConfigModel = ref<TestConfig>({
  courseContentId: null,
  isCompleteEnoughPoints: false,
  isCorrectAnswer: false,
  isDisplayFalseAnswer: false,
  isDisplayPoint: false,
  isDisplayResult: false,
  isMaintainStatus: false,
  isPreserveTime: false,
  isRequiredRetest: false,
  isReviewTheTest: false,
  isShuffleQuestion: false,
  minuteOfWork: 0,
  numberOfRetake: 0,
  pointRatio: 0,
  randomQuestion: 0,
  requiredPointRatio: 80,
  retakeResultType: 0,
  reviewId: undefined,
  timeFinish: 0,
  totalQuestionDisplayInPage: 0,
  writeLogMinute: 0,
  minuteWork: 0,
})
const { t } = window.i18n()
const isShowAddQuestion = ref(false)
interface Emit {
  (e: 'update:isShowAdd', val: boolean): void
}
function showAdd() {
  isShowAddQuestion.value = true
}
const dataQuestion = ref<Any | null>({
  id: null,
  content: '',
  isGroup: false,
  urlFile: null,
  isAutoApprove: true,
  levelId: null,
  typeId: 1,
  topicId: null,
  answers: [],
  questions: [],
})
const isEdit = ref(false)
const idxEdit = ref(-1)
function updateQuestion(val: Any) {
  val.unitPoint = 1
  if (!isEdit.value)
    listQuestion.value.push(val)
  else
    listQuestion.value[idxEdit.value] = val

  cancel()
}
function handleEditQuestion(val: Any) {
  isEdit.value = true
  idxEdit.value = val.originIndex
  dataQuestion.value = val
  isShowAddQuestion.value = true
}
function cancel() {
  isEdit.value = false
  dataQuestion.value = {
    id: null,
    content: '',
    isGroup: false,
    urlFile: null,
    isAutoApprove: MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true,
    levelId: null,
    typeId: 1,
    topicId: null,
    answers: [],
    questions: [],
  }
  isShowAddQuestion.value = false
}
const route = useRoute()
const infoQuestion = ref<Any>({
  name: '',
  thematicId: Number(route.params.thematicId),
  isApprove: MethodsUtil.checkPermission(null, 'QuestionManaging', 128) || true,
})
const listTab = [
  {
    key: 'question',
    title: 'questions',
    isRendered: true,
  },

  {
    key: 'configuration',
    title: 'custom',
    isRendered: true,
  },
]

async function saveExam(unload: any) {
  const payload = {
    questions: listQuestion.value,
    ...infoQuestion,
  }
  await MethodsUtil.requestApiCustomV5(QuestionService.AddTest, TYPE_REQUEST.POST, payload)
  unload()
}
</script>

<template>
  <VRow>
    <VCol
      cols="4"
    >
      <CmTextField
        v-model:model-value="infoQuestion.name"
        :text="`${t('test-survey-title')}*`"
      />
    </VCol>
    <VCol
      class="d-flex align-end"
    >
      <CmCheckBox
        v-model:model-value="infoQuestion.isApprove"
      >
        {{ t('auto-approve') }}
      </CmCheckBox>
    </VCol>
  </VRow>
  <CmTab
    :list-tab="listTab"
    type="underline"
    label="test"
  />
  <div
    v-if="route.query.test === 'question'"
  >
    <div v-if="!isShowAddQuestion">
      <CpQuestionListV5
        v-model:items="listQuestion"
        :is-v5="true"
        @click-add-question="showAdd"
        @edit-item="handleEditQuestion"
      />
      <div class="mt-8">
        <CpActionFooterEdit
          is-save
          @on-save="(idx:number, unload: void) => { saveExam(unload) }"
          @on-cancel="emit('update:isShowAdd', false)"
        />
      </div>
    </div>
    <div v-else>
      <CpModificationQuestion
        :is-edit="isEdit"
        :data="dataQuestion"
        @update:data="updateQuestion"
        @cancel="cancel"
      />
    </div>
  </div>
  <div v-if="route.query.test === 'configuration'">
    <CpTestConfig
      :total-question="listQuestion.length"
      :is-view-detail-model="false"
    />
  </div>
</template>
