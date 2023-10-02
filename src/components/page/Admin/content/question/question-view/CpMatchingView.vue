<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  answers: Array<any>
  [name: string]: any
}
interface Props {
  data: question
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
  isShuffle: boolean
  disabled?: boolean // trạng thái chọn
  isShowAnsTrue: boolean // hiện thị câu đúng
  isShowAnsFalse: boolean // hiện thị câu sai
  isSentence?: boolean // trạng thái câu
  isHideNotChoose?: boolean // ẩn hiện thị đáp án các câu không chọn
  typeShow?: number // trạng thái hiện thị
  numberQuestion?: number | null
  totalPoint?: number | null
  point?: number | null
  customKeyValue?: string
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
    answers: [],
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
  isShuffle: true,
  disabled: false,
  isSentence: false,
  isShowAnsTrue: false,
  isShowAnsFalse: false,
  isHideNotChoose: false,
  numberQuestion: 0,
  totalPoint: 0,
  point: 0,
  customKeyValue: 'answeredValue',
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:model-value', val: any): void
  (e: 'update:data', val: any): void
}
const { t } = window.i18n()
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}

const questionValue = ref<question>({
  content: '',
  answers: [],
})
function checkAnsTrueClass(detalAns: any) {
  return (props.isShowAnsTrue && (detalAns.correctAnswer === detalAns[props.customKeyValue]) && (!props.isHideNotChoose || (props.isHideNotChoose && detalAns[props.customKeyValue])))
}
function checkAnsFalseClass(detalAns: any) {
  return (props.isShowAnsFalse && !detalAns.isTrue && detalAns[props.customKeyValue])
}
watch(() => props.data, val => {
  const answers: any[] = []
  const temp = window._.cloneDeep(val)

  temp?.answers.forEach((element: any) => {
    const position = element.position - 1
    if (position > -1) {
      if (answers[position] === undefined) {
        answers[position] = {
          left: null as any,
          right: null as any,
        }
      }
      if (element.isTrue === false) {
        answers[position].left = element
      }
      else {
        answers[position].right = element

        setTimeout(() => {
          if (!window._.isEmpty(answers[position].right))
            answers[position].right.matched = !!answers[position].right.answeredValue
          if (!window._.isEmpty(answers[position].left))
            answers[position].left.matched = !!answers[position].right.answeredValue
        }, 0)
      }
    }
  })

  temp.answers = answers
  questionValue.value = temp
}, { immediate: true, deep: true })
</script>

<template>
  <div class="content-view">
    <div
      v-if="isSentence"
      class="mb-4"
    >
      <span class="text-bold-md color-primary">{{ t('sentence') }} {{ numberQuestion }} - {{ point }}/{{ totalPoint }} {{ t('scores') }}</span>
      <CmButton
        class="ml-3"
        icon="ic:round-bookmark-border"
        :color="questionValue.isMark ? 'warning' : 'secondary'"
        color-icon="white"
        is-rounded
        :size="36"
        :size-icon="20"
      />
    </div>
    <div
      v-if="showContent"
      class="text-medium-md mb-5 color-text-900"
      v-html="questionValue.content"
    />
    <div
      v-if="showMedia && questionValue.urlFile"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="questionValue.urlFile"
      />
    </div>
    <div
      v-for="item in questionValue.answers"
      :key="item.id"
      class="w-100"
    >
      <div
        class="box-answer"
        :class="
          {
            ansTrue: checkAnsTrueClass(item),
            ansFalse: checkAnsFalseClass(item),
          }
        "
      >
        <div
          v-if="item.left"
          class="box-left d-flex justify-space-between"
          :class="{
            matched: false,
          }"
        >
          <div
            v-html="item.left.content"
          />
          <div
            v-if="isShuffle"
            :title="item?.left?.isShuffle ? t('allowed-shuffle') : t('not-allowed-shuffle')"
          >
            <VIcon
              icon="iconamoon:playlist-shuffle-light"
              :size="20"
              :color="item?.left?.isShuffle ? 'primary' : ''"
            />
          </div>
        </div>

        <div
          v-else
          class="box-left-empty"
        />
        <div
          v-if="item.right"
          class="box-right d-flex justify-space-between"
          :class="[item.left ? 'box-right' : 'box-right-empty']"
        >
          <div
            v-html="item.right.content"
          />
          <div
            v-if="isShuffle"
            :title="item?.right?.isShuffle ? t('allowed-shuffle') : t('not-allowed-shuffle')"
          >
            <VIcon
              icon="iconamoon:playlist-shuffle-light"
              :size="20"
              :color="item?.right?.isShuffle ? 'primary' : ''"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{
  .view-media{
    width: 60%;
  }

  .box-answer{
    display: flex;
    width: 100%;
    margin-bottom: 12px;
    .box-left{
      padding: 16px;
      border: 2px solid rgb(var(--v-primary-600));
      border-radius: 8px 0px 0px 8px;
      border-right-width: 1px;
      width: 50%;
    }
    .box-left-empty{
      padding: 16px;
      border: unset;
      border-radius: 8px 0px 0px 8px;
      border-right-width: 1px;
      width: 50%;
    }
    .box-right{
      padding: 16px;
      border-radius: 0px 8px 8px 0px;
      border: 2px solid rgb(var(--v-primary-600));
      border-left-width: 1px;
      width: 50%;
    }
    .box-right-empty{
      padding: 16px;
      border-radius: 0px 8px 8px 0px;
      border: 2px solid rgb(var(--v-primary-600));
      width: 50%;
    }
  }
  .box-answer.matched{
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 12px;
    .box-left{
      padding: 16px;
      border: 2px solid rgb(var(--v-primary-600));
      border-radius: 8px 0px 0px 8px;
      width: 48%;
    }
    .box-right{
      padding: 16px;
      border-radius: 0px 8px 8px 0px;
      border: 2px solid rgb(var(--v-primary-600));
      width: 48%;
    }
  }
}
</style>
