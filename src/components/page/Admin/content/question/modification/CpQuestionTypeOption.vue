<script setup lang="ts">
import CmSelect from '@/components/common/CmSelect.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), ({
  questionTypeId: null,
  questionLevelId: null,
}))
const emit = defineEmits<Emit>()
interface Props {
  questionTypeId?: any
  questionLevelId?: any
}
interface Emit {
  (e: 'update:questionTypeId', value: any): void
  (e: 'update:questionLevelId', value: any): void
  (e: 'update:data', value: any): void

}
const { t } = window.i18n()
const questionTypes = [
  {
    value: t('QuestionService.QuestionSingleChoice'),
    key: 1,
  },
  {
    value: t('QuestionService.QuestionMultipleChoice'),
    key: 2,
  },
  {
    value: t('QuestionService.QuestionUnderlined'),
    key: 3,
  },
  {
    value: t('QuestionService.QuestionChooseTrueFalse'),
    key: 4,
  },
  {
    value: t('QuestionService.QuestionClauseTrueFalse'),
    key: 5,
  },
  {
    value: t('QuestionService.QuestionFillInTheGap'),
    key: 6,
  },
  {
    value: t('QuestionService.QuestionFillInTheGap2'),
    key: 7,
  },
  {
    value: t('QuestionService.QuestionPairing'),
    key: 8,
  },
  {
    value: t('QuestionService.QuestionEssay'),
    key: 9,
  },
]
const dataInput = ref<any>({
  questionLevelId: null,
  questionTypeId: null,
})

const questionlevel = ref<Any>([])

// cấp độ câu hỏi
function getComboboxQuestionLevel() {
  if (window._.isEmpty(questionlevel.value)) {
    MethodsUtil.requestApiCustom(QuestionService.GetComboboxQuestionLevel, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
      questionlevel.value = data
    })
  }
}
function changeValue(key: string, value: any) {
  dataInput.value[key] = value
  emit('update:data', dataInput.value)

  switch (key) {
    case 'questionTypeId':
      emit('update:questionTypeId', value)
      break

    case 'questionLevelId':
      emit('update:questionLevelId', value)
      break

    default:
      break
  }
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="questionTypeId"
        :items="questionTypes"
        item-value="key"
        custom-key="value"
        :text="`${t('question-type')}*`"
        :placeholder="t('question-type')"
        @update:model-value="($value) => changeValue('questionTypeId', $value)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="questionLevelId"
        :items="questionlevel"
        item-value="key"
        custom-key="value"
        :text="`${t('levels')}*`"
        :placeholder="t('levels')"
        @update:model-value="($value) => changeValue('questionLevelId', $value)"
        @open="getComboboxQuestionLevel"
      />
    </VCol>
  </VRow>
</template>
