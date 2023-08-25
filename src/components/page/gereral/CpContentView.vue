<script setup lang="ts">
import CpSingleChoiceView from '@/components/page/Admin/content/question/question-view/CpSingleChoiceView.vue'
import CpMultiChoiseView from '@/components/page/Admin/content/question/question-view/CpMultiChoiseView.vue'
import CpUnderlinedView from '@/components/page/Admin/content/question/question-view/CpUnderlinedView.vue'
import CpTrueFalseView from '@/components/page/Admin/content/question/question-view/CpTrueFalseView.vue'
import CpClauseTrueFalseView from '@/components/page/Admin/content/question/question-view/CpClauseTrueFalseView.vue'
import CpEssayView from '@/components/page/Admin/content/question/question-view/CpEssayView.vue'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  [name: string]: any
}
interface Props {
  type: number
  data: question
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  type: 1,
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
}))

function checkTypeQuestion() {
  switch (props.type) {
    case 1:

      return CpSingleChoiceView
    case 2:

      return CpMultiChoiseView
    case 3:

      return CpUnderlinedView
    case 4:

      return CpTrueFalseView
    case 5:

      return CpClauseTrueFalseView
    case 9:

      return CpEssayView
    default:
      return CpSingleChoiceView
  }
}
</script>

<template>
  <div class="w-100">
    <Component
      :is="checkTypeQuestion()"
      :data="data"
      :show-content="showContent"
      :show-media="showMedia"
      :show-answer-true="showAnswerTrue"
    />
  </div>
</template>
