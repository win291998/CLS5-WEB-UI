<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmRadio from '@/components/common/CmRadio.vue'
import CmButton from '@/components/common/CmButton.vue'
import MethodsUtil from '@/utils/MethodsUtil'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  answers: Array<any>
  answersClone: Array<any>
  [name: string]: any
}
interface Props {
  data: question
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
  listCurrentId: number
  disabled?: boolean // trạng thái chọn
  isShuffle?: boolean
  isShowAnsTrue: boolean // hiện thị câu đúng
  isShowAnsFalse: boolean // hiện thị câu sai
  isSentence?: boolean // trạng thái câu
  isHideNotChoose?: boolean // ẩn hiện thị đáp án các câu không chọn
  typeShow?: number // trạng thái hiện thị
  numberQuestion?: number | null
  totalPoint?: number | null
  point?: number | null
  customKeyValue?: string
  isReview?: boolean
  isGroup?: boolean // câu trong nhóm

}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
    answers: [],
    answersClone: [],
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: false,
  listCurrentId: 1,
  disabled: false,
  isShuffle: true,
  isSentence: false,
  isShowAnsTrue: false,
  isShowAnsFalse: false,
  isHideNotChoose: false,
  isReview: false,
  numberQuestion: 0,
  totalPoint: 0,
  point: 0,
  customKeyValue: 'answeredValue',
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:model-value', val: any): void
  (e: 'update:data', val: any): void
  (e: 'saveLocalData', val: any): void
  (e: 'update:isAnswered', val: any): void

}
const { t } = window.i18n()
const listCurrent = ref(1)
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position)}.`
}

const contentBlank = ref()

const contentBlankRef = ref()
const listAnserView = ref<any[]>([])

function handleSpanClick(event: any, pos: number) {
  // Xử lý sự kiện khi thẻ span được click
  listCurrent.value = pos
}
function attachClickEvent() {
  nextTick(() => {
    const answerSpans = contentBlankRef.value?.querySelectorAll('.answer-select')
    answerSpans?.forEach((span: any, pos: number) => {
      span.addEventListener('click', ($event: any) => handleSpanClick($event, pos + 1))
    })
  })
}
const questionValue = ref(window._.cloneDeep(props.data))
function changeValue(value: any) {
  const contentSelect = ref()
  questionValue.value.answers?.forEach((item: any) => {
    if (item.position === listCurrent.value)
      item[props.customKeyValue] = item.id === value.id ? listCurrent.value : null
    if (item.id === value.id)
      contentSelect.value = item
  })
  updateContent(contentSelect.value)
  questionValue.value.isAnswered = true
  emit('update:isAnswered', true)
  emit('update:data', questionValue.value)
}
function updateContent(val: any) {
  const ans = listAnserView.value[listCurrent.value].findIndex((item: any) => item.id === val.id)
  const answerSelect = contentBlankRef.value?.querySelectorAll('.answer-select')[listCurrent.value - 1]
  const answerSpans = answerSelect.getElementsByClassName('select-content')[0]
  answerSpans.classList.remove('chooseAnsPld')
  answerSpans.innerHTML = `Đáp án ${getIndex(ans)}`
}
watch(() => props.data, val => {
  questionValue.value = val
  questionValue.value.isAnswered = !!questionValue.value.answers.filter((item: any) => item[props.customKeyValue] !== null).length
  emit('update:isAnswered', questionValue.value.isAnswered)
}, { immediate: true })

questionValue.value.answers?.forEach((item: any, index: number) => {
  if (!listAnserView.value[item.position])
    listAnserView.value[item.position] = [toRaw(item)]
  else
    listAnserView.value[item.position].push(item)
})
function checkAnsTrueClass(detalAns: any) {
  if (!detalAns)
    return false

  return (props.isShowAnsTrue && detalAns.isTrue && (!props.isHideNotChoose || (props.isHideNotChoose && detalAns[props.customKeyValue])))
}
function checkAnsFalseClass(detalAns: any) {
  if (!detalAns)
    return false
  return (props.isShowAnsFalse && !detalAns.isTrue && detalAns[props.customKeyValue])
}

onMounted(() => {
  const result = ref(questionValue.value.content)

  const tempElement = document.createElement('div')
  tempElement.innerHTML = questionValue.value.content
  const spanElements = tempElement.querySelectorAll('.answer-select')

  // Lặp qua từng phần tử và xóa nội dung bên trong
  spanElements.forEach((spanElement, idx) => {
    const isTrue = listAnserView.value[idx + 1].findIndex((item: any) => item.isTrue)
    spanElement.innerHTML = ''
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" style="margin-top: 5px;" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9l6 6l6-6"></path></svg>'
    if (props.isReview) {
      const ans = listAnserView.value[idx + 1].findIndex((item: any) => item.answeredValue === idx + 1)
      spanElement.setAttribute('id', questionValue.value.id)
      const detalAns = listAnserView.value[idx + 1][ans]
      if (checkAnsTrueClass(detalAns))
        spanElement.classList.add('ansTrue')
      if (checkAnsFalseClass(detalAns))
        spanElement.classList.add('ansFalse')
      spanElement.innerHTML = `<span style="display: inline-flex;" ><span class="select-content ${ans < 0 ? 'chooseAnsPld' : ''}">${ans < 0 ? `Lựa chọn ${idx + 1}` : `Đáp án ${getIndex(ans)}`}</span>${svg}</span>`
    }
    else {
      spanElement.innerHTML = `<span style="display: inline-flex;" ><span class="select-content ${!props.showAnswerTrue ? 'chooseAnsPld' : ''}">${!props.showAnswerTrue ? `Lựa chọn ${idx + 1}` : `Đáp án ${getIndex(isTrue)}`}</span>${svg}</span>`
    }
  })

  contentBlank.value = tempElement.innerHTML
  attachClickEvent()
})
const idRandom = ref(MethodsUtil.createRandomId(5))
function handlePinQs() {
  questionValue.value.isMark = !questionValue.value.isMark
}

watch(() => props.listCurrentId, (val: number) => {
  listCurrent.value = val
})
</script>

<template>
  <div class="content-view">
    <div
      v-if="isSentence"
      class="mb-4"
    >
      <span class="text-bold-md color-primary">{{ t('sentence') }} {{ numberQuestion }} - {{ point }}/{{ totalPoint }} {{ t('scores') }}</span>
      <CmButton
        v-if="!isGroup"
        :disabled="disabled"
        class="ml-3"
        icon="ic:round-bookmark-border"
        :color="questionValue.isMark ? 'warning' : 'secondary'"
        color-icon="white"
        is-rounded
        :size="36"
        :size-icon="20"
        @click="handlePinQs"
      />
    </div>
    <div
      v-if="showContent"
      ref="contentBlankRef"
      class="text-medium-md mb-5 color-text-900"
      v-html="contentBlank"
    />
    <div
      v-if="showMedia && questionValue.urlFile"
      class="flex-center"
    >
      <div
        class="view-media mb-5 "
      >
        <CpMediaContent
          :disabled="true"
          :src="questionValue.urlFile"
        />
      </div>
    </div>
    <div
      v-for="(item, idx) in listAnserView[listCurrent]"
      :key="item.id"
      class="item-answer w-100"
      :class="{
        ansTrue: checkAnsTrueClass(item),
        ansFalse: checkAnsFalseClass(item),
      }"
    >
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? item?.isTrue : ((isShowAnsFalse && !isShowAnsTrue && item?.isTrue) ? null : !!item[customKeyValue]) "
        :disabled="disabled"
        :name="`bl2-${idRandom}-${questionValue.id}`"
        :value="true"
        class="mr-3"
        @update:model-value="changeValue(item)"
      />
      <div class="w-100">
        <span class="mr-1">{{ getIndex(idx) }} </span>
        <span v-html="item.content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{
  .item-answer {
    display:flex;
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-gray-300));
    background: #FFF;
    padding: 1rem;
    margin-bottom: 12px;
  }
  .item-answer:last-child {
    margin-bottom: unset;
  }
  .item-answer.ansTrue {
    border: 1px solid rgb(var(--v-success-600));
    color:rgb(var(--v-success-600));
  }
  .item-answer.ansFalse {
    border: 1px solid rgb(var(--v-error-600));
    color:rgb(var(--v-error-600));
  }
  .answer-select.ansTrue {
    border: 1px solid rgb(var(--v-success-600));
    color:rgb(var(--v-success-600));
  }
  .answer-select.ansFalse {
    border: 1px solid rgb(var(--v-error-600));
    color:rgb(var(--v-error-600));
  }
  .view-media{
    width: 60%;
  }
}
</style>
