<script setup lang="ts">
import CpQuestionItemFilter from '@/components/page/Admin/content/question/modification/CpQuestionItemFilter.vue'
import CpQuestionTypeOption from '@/components/page/Admin/content/question/modification/CpQuestionTypeOption.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'

const SingleChoiceQuestion = defineAsyncComponent(() => import('@/components/page/Admin/content/question/question-type/SingleChoiceQuestion.vue'))
const EssayQuestion = defineAsyncComponent(() => import('@/components/page/Admin/content/question/question-type/EssayQuestion.vue'))

const component = ref(SingleChoiceQuestion)
const route = useRoute()
const isEdit = ref(false)
const isView = ref(false)

const questionData = ref({
  listQuestions: [
    {
      content: '',
      questionTypeId: 1,
      questionId: 0,
      isDisplay: false,
      isSelected: false,
      contentBasic: '',
      urlMedia: null,
      answers: [],
    },
  ],
  questionGroupContent: null,
  topicId: null,
  questionLevelId: null,
  isShuffleGroup: false,
  isSent: false,
  singleQuestion: true,
  questionTypeId: 1,
  isDisplay: false,
  courseContentId: 0,
  isArchive: true,
})
function handleFilter(filter: any) {
  questionData.value = {
    ...questionData.value,
    ...filter,
  }
}
function checkTypeQuestionItem(typeId: number | null) {
  switch (typeId) {
    case 1:

      return SingleChoiceQuestion
    case 9:

      return EssayQuestion

    default:
      return SingleChoiceQuestion
  }
}

function handleUpdateQuestion(dataQs: any, id: number) {
  if (questionData.value)
    questionData.value.listQuestions[id] = dataQs
}
function changeQuestion(dataQs: any, id: number, value: number) {
  dataQs.questionTypeId = value
}
async function getInforQuestion() {
  await MethodsUtil.requestApiCustomV5(QuestionService.GetDetailQuestion(Number(route.params.id)), TYPE_REQUEST.GET).then((value: any) => {
    questionData.value = value
  })
}
if (route.name === 'question-edit' && Number(route.params.id))
  getInforQuestion()

onMounted(() => {
  isEdit.value = !!route?.params.id
})
</script>

<template>
  <div class="mt-3">
    <VRow>
      <VCol>
        <CpQuestionItemFilter
          v-model:topicId="questionData.topicId"
          v-model:singleQuestion="questionData.singleQuestion"
          v-model:isSent="questionData.isSent"
          v-model:questionLevelId="questionData.questionLevelId"
        />
      </VCol>
    </VRow>
    <VRow
      v-for="(question, index) in questionData.listQuestions"
      :key="index"
    >
      <VCol cols="12">
        <CpQuestionTypeOption
          v-model:questionLevelId="questionData.questionLevelId"
          :question-type-id="question.questionTypeId"
          @update:question-type-id="($value:any) => changeQuestion(question, index, $value)"
        />
      </VCol>
      <VCol>
        <Component
          :is="checkTypeQuestionItem(question.questionTypeId)"
          v-if="component"
          :question="question"
          :is-edit="isEdit"
          :is-view="isView"
          @update="($question: any) => handleUpdateQuestion($question, index)"
        />
      </VCol>
    </VRow>
  </div>
</template>
