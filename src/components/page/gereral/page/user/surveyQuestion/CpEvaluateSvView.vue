<script setup lang="ts">
import CmRating from '@/components/common/CmRating.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { reaction } from '@/constant/data/iconList.json'
import CmButton from '@/components/common/CmButton.vue'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  [name: string]: any
}
interface Props {
  data: question
  showContent?: boolean
  showMedia?: boolean
  disabled?: boolean // trạng thái chọn
  isShuffle?: boolean
  maxWidth?: number
  isSentence?: boolean // trạng thái câu
  isHideNotChoose?: boolean // ẩn hiện thị đáp án các câu không chọn
  typeShow?: number // trạng thái hiện thị
  numberQuestion?: number | null | string
  totalPoint?: number | null
  point?: number | null
  customKeyValue?: string
  isGroup?: boolean // câu trong nhóm
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
  }),
  showContent: true,
  showMedia: true,
  disabled: false,
  isShuffle: true,
  isSentence: false,
  isHideNotChoose: false,
  numberQuestion: 0,
  totalPoint: 0,
  point: 0,
  customKeyValue: 'answeredValue',
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:model-value', val: any): void
  (e: 'update:isDataChange', val?: any): void
  (e: 'update:data', val: any): void
  (e: 'update:isAnswered', val: any): void
}
const { t } = window.i18n()

const questionValue = ref(window._.cloneDeep(props.data))

const indexFrom = computed(() => {
  if (props.data?.answers?.length)
    return props.data.answers[0]?.position === 0 ? props.data.answers[1]?.position + 1 : props.data.answers[1]?.position

  return 0
})
const rating = ref(0)
const labels = computed(() => props.data.answers.map((item: any) => item.content))
function handlePinQs() {
  questionValue.value.isMark = !questionValue.value.isMark
  emit('update:isDataChange', false)
}
function changeValue(value: any) {
  console.log(value)

  rating.value = value

  questionValue.value.answers.forEach((item: any, index: number) => {
    item[props.customKeyValue] = value === index + 1
  })

  questionValue.value.isAnswered = true
  emit('update:data', questionValue.value)
  emit('update:isAnswered', true)
  emit('update:isDataChange', true)
}
watch(() => props.data, val => {
  questionValue.value = val
}, { immediate: true })
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
        is-rounded
        color-icon="white"
        :size="36"
        :size-icon="20"
        @click="handlePinQs"
      />
    </div>
    <div
      v-if="showContent"
      class="text-medium-md mb-5"
      v-html="data.content"
    />
    <div
      v-if="showMedia && data.urlMedia"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="data.urlMedia"
      />
    </div>
    <div class="d-flex align-center">
      <CmRating
        :model-value="rating"
        :disabled="disabled"
        :length="data?.answers?.length"
        :full-color="data?.color"
        :labels="labels"
        :max-width="maxWidth"
        :full-icon=" MethodsUtil.checkType(data.reactionId, reaction, 'value')?.fullIcon"
        :empty-icon=" MethodsUtil.checkType(data.reactionId, reaction, 'value')?.emptyIcon"
        @update:model-value="changeValue"
      />
    </div>
  </div>
</template>

<style lang="scss">
.content-view{

  .item-answer-range {
    display:flex;
    width:auto;
    border-radius: var(--v-border-sm);
    border: 1px solid rgb(var(--v-gray-300));
    background: #FFF;
    padding: 1rem;
  }
  .item-range-number{
    display: flex;
    margin-inline: auto;
    .range-item {
      padding: 0.5rem;
    }
  }

  .view-media{
    width: 60%;
  }
}
</style>
