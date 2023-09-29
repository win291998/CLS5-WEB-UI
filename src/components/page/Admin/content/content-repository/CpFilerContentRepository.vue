<script setup lang="ts">
import { comboboxStore } from '@/stores/combobox'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), ({
  topicId: () => ([]),
  authorId: null,
  isDisplayHome: null,
  dateFrom: null,
  dateTo: null,
  typeId: null,
}))
const emit = defineEmits<Emit>()
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

/** ** Interface */
interface Emit {
  (e: 'update:topicId', value: any): void
  (e: 'update:ownerId', value: any): void
  (e: 'update:dateFrom', value: any): void
  (e: 'update:dateTo', value: any): void
  (e: 'update:pageSize', value: any): void
  (e: 'update:pageNumber', value: any): void
  (e: string, value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Khởi tạo store */
const storeCombobox = comboboxStore()
const { getComboboxTypeContent } = storeCombobox

interface Props {
  topicId: any[]
  formOfStudy?: any
  statusId?: any
  ownerId?: any
  dateFrom?: any
  dateTo?: any
  questionType?: any
  comboboxAuthorContent: any[]
  [e: string]: any
}

const LABEL = Object.freeze({
  FILLTER1: t('choose-topic'),
  FILLTER2: t('user-create'),
  FILLTER3: t('question-type'),
  FILLTER4: t('content-type'),
  FILLTER5: t('course-status'),
  FILLTER6: t('own-course'),
  FILLTER7: t('start-day'),
  FILLTER8: t('to-day'),
})

// method

function change(key: any, value: any) {
  emit(`update:${key}`, value)
  emit('update:pageNumber', 1)
}

const comboboxTypeContent = ref<any[]>([])
async function getComboboxType() {
  const { data } = await getComboboxTypeContent()
  data.forEach((element: Any) => {
    element.text = t(element.value)
  })
  comboboxTypeContent.value = data
}
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CpTopicSelect
        :model-value="topicId"
        multiple
        :type="2"
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
        :model-value="authorId"
        :items="comboboxAuthorContent"
        item-value="key"
        custom-key="name"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:model-value="($event) => change('authorId', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        :model-value="typeId"
        :items="comboboxTypeContent"
        item-value="key"
        custom-key="text"
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
        @update:model-value="($event) => change('typeId', $event)"
        @open="getComboboxType"
      />
    </VCol>

    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        :model-value="dateFrom"
        :text="LABEL.FILLTER7"
        placeholder="dd/mm/yyyy"
        @update:model-value="($event) => change('dateFrom', $event)"
      />
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="4"
    >
      <CmDateTimePicker
        :model-value="dateTo"
        :text="LABEL.FILLTER8"
        placeholder="dd/mm/yyyy"
        @update:model-value="($event) => change('dateTo', $event)"
      />
    </VCol>
  </VRow>

  <div />
</template>
