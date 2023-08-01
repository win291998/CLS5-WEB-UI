<script setup lang="ts">
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'
import CmRadioGroup from '@/components/common/CmRadioGroup.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import QuestionService from '@/api/question'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), ({
  topicId: null,
  questionTypeId: null,
  singleQuestion: null,
  isSent: null,
  questionLevelId: null,
}))
const emit = defineEmits<Emit>()
interface Props {
  topicId?: any
  questionTypeId?: any
  singleQuestion?: any
  isSent?: any
  questionLevelId?: any
}
interface Emit {
  (e: 'update:topicId', value: any): void
  (e: 'update:questionTypeId', value: any): void
  (e: 'update:singleQuestion', value: any): void
  (e: 'update:isSent', value: any): void
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
  topicId: null,
  questionTypeId: null,
  singleQuestion: true,
})
const optionTypeQuestion = ref([
  {
    label: t('single-question'),
    value: true,
  },
  {
    label: t('cluster-question'),
    value: false,
  },
])
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
    case 'topicId':
      emit('update:topicId', value)
      break
    case 'questionTypeId':
      emit('update:questionTypeId', value)
      break
    case 'singleQuestion':
      emit('update:singleQuestion', value)
      break
    case 'isSent':
      emit('update:isSent', value)
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
      <CpTopicSelect
        :model-value="topicId"
        :type="6"
        :text="`${t('topic')}*`"
        :placeholder="t('topic')"
        @update:model-value="($value) => changeValue('topicId', $value)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmRadioGroup
        :model-value="singleQuestion"
        :label="t('gender')"
        :option="optionTypeQuestion"
        @update:model-value="($value) => changeValue('singleQuestion', $value)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
      class="d-flex align-end"
    >
      <div style="height:48px">
        <CmCheckBox
          :label="t('auto-send-approve')"
          :model-value="isSent"
          @update:model-value="($value) => changeValue('isSent', $value)"
        />
      </div>
    </VCol>
    <!--
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
    -->
  </VRow>
</template>
