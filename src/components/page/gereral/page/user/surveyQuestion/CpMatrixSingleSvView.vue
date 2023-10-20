<script setup lang="ts">
import CmRadio from '@/components/common/CmRadio.vue'
import ArraysUtil from '@/utils/ArrayUtil'
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
const listAnswerMatrixValue = ref<any[]>([])
const getRatingLevels = computed(() => {
  if (props.data && props.data.surveyLevelRatings) {
    const ratingLevels = props.data.surveyLevelRatings
    ratingLevels.sort((a: any, b: any) => a.position - b.position)
    return ratingLevels
  }
  return []
})
const getGroupRating = computed(() => {
  if (props.data.isGroup) {
    const groups = ArraysUtil.fromListToTree(props.data.surveyCategoryRatings, 'randomId', 'groupId', undefined, undefined, null)
    groups.sort((a, b) => a.position - b.position)
    groups.forEach(item => {
      if (item.children && item.children.length > 0)
        item.children.sort((a: any, b: any) => a.position - b.position)
    })
    let result: any[] = []
    groups.forEach(element => {
      element.isGroup = true
      result.push(element)
      if (element.children)
        result = result.concat(element.children)
    })
    return result
  }
  return props.data.surveyCategoryRatings
})
function getCheckedValue(categoryId: number, levelId: number) {
  if (!listAnswerMatrixValue.value || listAnswerMatrixValue.value.length === 0)
    return false

  const checkedValue = listAnswerMatrixValue.value.find((item: any) => item.categoryId === categoryId && item.levelId === levelId)
  return !!checkedValue
}
function onChangeAnswer(categoryId: number, levelId: number) {
  const index = listAnswerMatrixValue.value?.findIndex(item => item.categoryId === categoryId)

  if (index >= 0) {
    listAnswerMatrixValue.value.splice(index, 1, { categoryId, levelId })
  }
  else {
    listAnswerMatrixValue.value.push({
      categoryId,
      levelId,
    })
  }
  questionValue.value.isAnswered = true
  emit('update:data', questionValue.value)
  emit('update:isAnswered', true)
  emit('update:isDataChange', true)
}
const mapPoint = computed(() => {
  return props.data.surveyLevelRatings.reduce((a: any, b: any) => ({ ...a, [b.id]: b.point }), {})
})
const getTotalPoint = computed(() => {
  if (props.data.isPoint && listAnswerMatrixValue.value) {
    const userPoint = listAnswerMatrixValue.value?.reduce((a, b) => a + mapPoint.value[b.levelId], 0)
    return Math.round(userPoint * 100) / 100
  }
  return 0
})
function handlePinQs() {
  questionValue.value.isMark = !questionValue.value.isMark
  emit('update:isDataChange', false)
}
watch(() => props.data.listAnswerMatrix, (val: any) => {
  listAnswerMatrixValue.value = val ?? []
}, { immediate: true, deep: true })
watch(() => props.data, val => {
  questionValue.value = val
}, { immediate: true })
</script>

<template>
  <div class="view-Matrix-sg">
    <div class="tb-matrix">
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
      <div class="tb-row tb-row-catg">
        <div
          class="tb-label"
          v-html="data.titleRating || 'TIÊU ĐỀ'"
        />
        <div class="tb-content">
          <div
            v-for="level in getRatingLevels"
            :key="level.id"
            class="tb-label-content"
            v-html="level.name"
          />
        </div>
      </div>
      <div
        v-if="data.isPoint"
        class="tb-row tb-row-th"
      >
        <div class="tb-label">
          {{ t('point') }}
        </div>
        <div class="tb-content">
          <div
            v-for="level in getRatingLevels"
            :key="level.id"
            class="tb-label-content"
          >
            {{ level.point }}
          </div>
        </div>
      </div>
      <template
        v-for="catg in getGroupRating"
        :key="catg.id"
      >
        <div
          v-if="catg.isGroup"
          class="tb-row tb-row-group"
        >
          <div
            class="tb-label"
            v-html="catg.name"
          />
        </div>
        <div
          v-else
          class="tb-row tb-row-item"
        >
          <div
            class="tb-label"
            v-html="catg.name"
          />
          <div class="tb-content">
            <div
              v-for="level in getRatingLevels"
              :key="level.id"
              class="tb-label-content"
            >
              <CmRadio
                :type="1"
                :model-value="showAnswerTrue ? getCheckedValue(catg.id, level.id) : false"
                :disabled="false"
                :name="`mx-single-${catg.id}`"
                :value="true"
                @update:model-value="onChangeAnswer(catg.id, level.id)"
              />
            </div>
          </div>
        </div>
      </template>
      <div
        v-if="data.isPoint"
        class="tb-row tb-row-th mt-6"
      >
        <div class="tb-label">
          {{ t("total-points") }}
        </div>
        <div class="tb-content d-flex justify-center">
          {{ getTotalPoint }} {{ t('scores') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.view-Matrix-sg {
  .tb-row {
    display: flex;
    padding:8px 16px;

    .tb-label {
      width: 25%;
      color: rgb(var(--v-gray-900));

      /* Text md/Medium */

      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 150% */
    }

    .tb-content {
      display: flex;
      width: 75%;

      .tb-label-content {
        display: flex;
        width: 100%;
        justify-content: center;
        color: rgb(var(--v-gray-900));

        /* Text md/Medium */

        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px; /* 150% */
        text-align: center;
      }
    }

    &.tb-row-th {
      background-color:  rgb(var(--v-primary-25));
    }

    &.tb-row-catg {
      padding:16px;

      .tb-label {
        color: rgb(var(--v-gray-900));

        /* Text md/Medium */

        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
        text-transform: uppercase;
      }

      .tb-label-content {
        color: rgb(var(--v-gray-900));

        /* Text md/Medium */

        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }
    }

    &.tb-row-group {
      padding-top: 16px;
      padding-bottom: 0;

      .tb-label {
        width: 100%;
        color: rgb(var(--v-primary-600));
      }
    }

    &.tb-row-item {
      padding:16px;
      border: 1px solid rgb(var(--v-gray-300));
      border-radius: var(--v-border-radius-xs);
      margin-block: 8px;
    }
  }
}
</style>
