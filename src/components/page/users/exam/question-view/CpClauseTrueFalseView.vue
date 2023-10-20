<script setup lang="ts">
import CmRadio from '@/components/common/CmRadio.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import MethodsUtil from '@/utils/MethodsUtil'
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
  isGroup?: boolean // câu trong nhóm

}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
  disabled: false,
  isShuffle: true,
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
  (e: 'update:isAnswered', val: any): void
  (e: 'update:isDataChange', val?: any): void
}
const { t } = window.i18n()
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}
const questionValue = ref(window._.cloneDeep(props.data))
function changeValue(pos: any, value: boolean) {
  questionValue.value.answers[pos][props.customKeyValue] = value
  questionValue.value.isAnswered = true
  emit('update:isAnswered', true)
  emit('update:data', questionValue.value)
  nextTick(() => {
    emit('update:isDataChange', true)
  })
}
const idRandom = ref(MethodsUtil.createRandomId(5))
function handlePinQs() {
  questionValue.value.isMark = !questionValue.value.isMark
  emit('update:isDataChange', false)
}

watch(() => props.data, val => {
  questionValue.value = val
  questionValue.value.isAnswered = !!questionValue.value.answers.filter((item: any) => item[props.customKeyValue] !== null).length
  emit('update:isAnswered', questionValue.value.isAnswered)
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
        v-if="!isGroup"
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
    <div class="title-TF">
      <div class="text-medium-md title">
        <span>Đúng</span>
      </div>
      <div class="text-medium-md title">
        <span>Sai</span>
      </div>
    </div>
    <div
      v-for="(item, pos) in questionValue.answers"
      :key="item.id"
      class="item-answer-group w-100"
      :class="{
        ansTrue: isShowAnsTrue && item.isTrue && (!isHideNotChoose || isHideNotChoose && item[customKeyValue]),
        ansFalse: isShowAnsFalse && !item.isTrue && item[customKeyValue],
      }"
    >
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? item.isTrue : ((isShowAnsFalse && !isShowAnsTrue && item.isTrue) ? null : item[customKeyValue]) "
        :disabled="disabled"
        :name="`clauseTF${idRandom}${item.position}-${questionValue.id}`"
        :value="true"
        class="mr-7"
        @update:model-value="changeValue(pos, true)"
      />
      <CmRadio
        :type="1"
        :model-value="showAnswerTrue ? item.isTrue : ((isShowAnsFalse && !isShowAnsTrue && item.isTrue) ? null : item[customKeyValue]) "
        :disabled="disabled"
        :name="`clauseTF${idRandom}${item.position}-${questionValue.id}`"
        :value="false"
        class="mr-3"
        @update:model-value="changeValue(pos, false)"
      />
      <div class="item-answer d-flex justify-space-between">
        <div>
          <div class="item-content">
            <span class="mr-1">{{ getIndex(item.position) }} </span>
            <span
              class="item-content"
              v-html="item.content"
            />
          </div>
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
            :color="item?.isShuffle ? 'primary' : ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{
  .title-TF{
    .title{
      width: 50px;
    }
    display:flex;
    margin-bottom: 20px;
    color:rgb(var(--v-gray-900));
  }
.item-answer-group{
  display:flex;
  margin-bottom: 12px;
  .item-answer {
    width: 100%;
    border-radius: var(--v-border-sm);
    border: 1px solid rgb(var(--v-gray-300));
    background: #FFF;
    padding: 1rem;
  }
  .item-answer:last-child {
    margin-bottom: unset;
  }
}
.item-answer-group.ansTrue{
  .item-answer {
    display:flex;
    width: 100%;
    border-radius: var(--v-border-sm);
    border: 1px solid rgb(var(--v-success-600));
    background: #FFF;
    padding: 1rem;
    margin-bottom: 12px;
    .item-content > span{
      color: rgb(var(--v-success-600))!important;
    }
  }

}
.item-answer-group.ansFalse{
  .item-answer {
    display:flex;
    width: 100%;
    border-radius: var(--v-border-sm);
    border: 1px solid rgb(var(--v-error-600));
    background: #FFF;
    padding: 1rem;
    margin-bottom: 12px;
    .item-content > span{
      color: rgb(var(--v-error-600))  !important;
    }
  }
}
  .view-media{
    width: 60%;
  }
}
</style>
