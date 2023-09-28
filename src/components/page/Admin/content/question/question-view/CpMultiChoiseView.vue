<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
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
const questionValue = ref(window._.cloneDeep(props.data))
function changeValue(pos: any) {
  questionValue.value.answers[pos][props.customKeyValue] = true
  emit('update:data', questionValue.value)
}
watch(() => props.data, val => {
  questionValue.value = val
}, { immediate: true, deep: true })
</script>

<template>
  <div class="content-view">
    <div
      v-if="isSentence"
      class="mb-4 mt-8"
    >
      <span class="text-bold-md color-primary">{{ t('sentence') }} {{ numberQuestion }} - {{ point }}/{{ totalPoint }} {{ t('scores') }}</span>
      <CmButton
        class="ml-3"
        icon="ic:round-bookmark-border"
        :color="questionValue.isMark ? 'warning' : 'secondary'"
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
      v-for="(item, pos) in questionValue.answers"
      :key="item.id"
      class="item-answer w-100"
      :class="{
        ansTrue: isShowAnsTrue && item.isTrue && (!isHideNotChoose || isHideNotChoose && item[customKeyValue]),
        ansFalse: isShowAnsFalse && !item.isTrue && item[customKeyValue],
      }"
    >
      <div class="mr-1">
        <CmCheckBox
          :disabled="disabled"
          :model-value="showAnswerTrue ? item.isTrue : ((isShowAnsFalse && !isShowAnsTrue && item.isTrue) ? null : item[customKeyValue]) "
          @update:model-value="changeValue(pos)"
        />
      </div>

      <div class="w-100 item-content">
        <span class="mr-1">{{ getIndex(item.position) }} </span>
        <span v-html="item.content" />
        <div
          v-if="showMedia && item.urlFile"
          class="view-media mt-2"
        >
          <CpMediaContent
            :disabled="true"
            :src="item.urlFile"
          />
        </div>
      </div>
      <div
        v-if="isShuffle"
        :title="item?.isShuffle ? t('allowed-shuffle') : t('not-allowed-shuffle')"
      >
        <VIcon
          icon="iconamoon:playlist-shuffle-light"
          :size="20"
          :color="item.isShuffle ? 'primary' : ''"
        />
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
  .item-answer.ansTrue {
    display:flex;
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-success-600));
    background: #FFF;
    padding: 1rem;
    margin-bottom: 12px;
    .item-content{
      color:rgb(var(--v-success-600));
    }
  }
  .item-answer.ansFalse {
    display:flex;
    width: 100%;
    border-radius: 8px;
    border: 1px solid rgb(var(--v-error-600));
    background: #FFF;
    padding: 1rem;
    margin-bottom: 12px;
    .item-content{
      color:rgb(var(--v-error-600));
    }
  }
  .item-answer:last-child {
    margin-bottom: unset;
  }
  .view-media{
    width: 60%;
  }
}
</style>
