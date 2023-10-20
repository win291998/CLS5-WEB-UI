<script setup lang="ts">
import CmRadio from '@/components/common/CmRadio.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
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
const valueRange = ref(null)
const questionValue = ref(window._.cloneDeep(props.data))
const { t } = window.i18n()

const indexFrom = computed(() => {
  if (props.data?.answers?.length)
    return props.data.answers[0]?.position === 0 ? props.data.answers[1]?.position + 1 : props.data.answers[1]?.position

  return 0
})
const isFromZero = computed(() => props.data.answers[0]?.position === 0)
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}
function handlePinQs() {
  questionValue.value.isMark = !questionValue.value.isMark
  emit('update:isDataChange', false)
}
function changeValue(value: any) {
  console.log(value)
  valueRange.value = value

  questionValue.value.answers.forEach((item: any) => {
    item[props.customKeyValue] = value
  })
  questionValue.value.isAnswered = true
  emit('update:data', questionValue.value)
  emit('update:isAnswered', true)
  emit('update:isDataChange', true)
}
watch(() => props.data.answeredValue, val => {
  valueRange.value = val
})
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
      v-html="questionValue.content"
    />
    <div
      v-if="showMedia && questionValue.urlMedia"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="questionValue.urlMedia"
      />
    </div>
    <div class="d-flex align-center">
      <div class="item-answer-range">
        <span v-html="questionValue.answers[0].content" />
      </div>
      <div class="item-range-number">
        <div
          v-for="(item, idx) in indexFrom"
          :key="idx"
          class="range-item"
        >
          <div class="d-flex align-center justify-center">
            {{ isFromZero ? idx : item }}
          </div>
          <div class="d-flex align-center justify-center">
            <CmRadio
              :type="1"
              :model-value="valueRange"
              :disabled="disabled"
              :name="`single-${data.id}`"
              :value="isFromZero ? idx : item"
              @update:model-value="changeValue(item)"
            />
          </div>
        </div>
      </div>
      <div class="item-answer-range">
        <span v-html="questionValue.answers[1].content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{

  .item-answer-range {
    display:flex;
    width:auto;
    border-radius: 8px;
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
