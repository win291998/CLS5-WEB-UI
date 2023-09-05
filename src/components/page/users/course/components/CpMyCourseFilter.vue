<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import QuestionService from '@/api/question'
import type { Any } from '@/typescript/interface'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'

const props = withDefaults(defineProps<Props>(), ({
  topicId: () => ([]),
  formOfStudy: null,
  sort: null,
  statusId: null,
  ownerId: null,
  isDisplayHome: null,
  dateFrom: null,
  dateTo: null,
}))
const emit = defineEmits<Emit>()
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
  (e: 'update:topicId', value: any): void
  (e: 'update:formOfStudy', value: any): void
  (e: 'update:sort', value: any): void
  (e: 'update:pageSize', value: any): void
  (e: 'update:pageNumber', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { topicCombobox, formOfStudyCombobox, compoboxSortCourse } = storeToRefs(storeCombobox)
const { getComboboxTopic, getComboboxFormStudy } = storeCombobox

interface Props {
  topicId: any[]
  formOfStudy?: any
  sort?: any
  isDisplayHome?: any
  statusId?: any
  ownerId?: any
  dateFrom?: any
  dateTo?: any
}
watch(() => props.topicId, val => {
  console.log(val)
})

const LABEL = Object.freeze({
  FILLTER1: t('form-study'),
  FILLTER2: t('filter-course'),
})

// method

function change(key: any, value: any) {
  switch (key) {
    case 'topicId':
      emit('update:topicId', value)
      break
    case 'formOfStudy':
      emit('update:formOfStudy', value)
      break
    case 'sort':
      emit('update:sort', value)
      break
    case 'isDisplayHome':
      emit('update:isDisplayHome', value)
      break
    case 'statusId':
      emit('update:statusId', value)
      break
    case 'ownerId':
      emit('update:ownerId', value)
      break
    case 'dateFrom':
      emit('update:dateFrom', value)
      break
    case 'dateTo':
      emit('update:dateTo', value)
      break
    default:
      break
  }

  emit('update:pageSize', value)
  emit('update:pageNumber', value)
}

const questionLevel = ref()
function getComboboxQuestionLevel() {
  MethodsUtil.requestApiCustom(QuestionService.GetComboboxQuestionLevel, TYPE_REQUEST.GET).then(({ data }: { data: Any[] }) => {
    questionLevel.value = data
  })
}

if (formOfStudyCombobox.value)
  getComboboxFormStudy()

// created
onUnmounted(() => {
  topicCombobox.value = []
  formOfStudyCombobox.value = []
})
const topics = ref([])
if (topicCombobox.value)
  getComboboxTopic(2)
</script>

<template>
  <div>
    <VRow class="mb-3">
      <VCol
        cols="12"
        md="4"
        sm="4"
      >
        <CpTopicSelect
          v-model:model-value="topics"
          multiple
          :type="4"
          :text="`${t('topic')}`"
          :is-show-add="false"
          :placeholder="t('topic')"
          @update:model-value="($event) => change('topicId', $event)"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        sm="4"
      >
        <CmSelect
          :model-value="formOfStudy"
          :items="formOfStudyCombobox"
          item-value="key"
          custom-key="value"
          :text="LABEL.FILLTER1"
          :placeholder="LABEL.FILLTER1"
          @update:model-value="($event) => change('formOfStudy', $event)"
          @open="getComboboxQuestionLevel"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        sm="4"
      >
        <CmSelect
          :model-value="sort"
          :items="compoboxSortCourse"
          item-value="key"
          custom-key="value"
          :text="LABEL.FILLTER2"
          :placeholder="LABEL.FILLTER2"
          @update:model-value="($event) => change('sort', $event)"
        />
      </VCol>
    </VRow>
  </div>
</template>
