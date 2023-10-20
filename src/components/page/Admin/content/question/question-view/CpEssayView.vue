<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpInputFileDrop from '@/components/page/gereral/CpInputFileDrop.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ServerFileService from '@/api/server-file/index'
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
  isReview?: boolean
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
const urlFile = ref()
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
interface Emit {
  (e: 'update:model-value', val: any): void
  (e: 'update:data', val: any): void
  (e: 'update:isAnswered', val: any): void

}
const { t } = window.i18n()
async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}
const questionValue = ref(window._.cloneDeep(props.data))

const typeFile = ref<any>()
const dataFile = ref<any>({
  filePath: null,
  fileFolder: null,
})
async function uploadFileLocal(data: any, file: any) {
  if (data?.fileFolder) {
    await getInfor(data?.fileFolder).then((value: any) => {
      if (value?.filePath) {
        typeFile.value = MethodsUtil.getMediaType(value.fileExtension)
        urlFile.value = value.filePath
        dataFile.value.filePath = value.filePath
        dataFile.value.fileFolder = data.fileFolder
        dataFile.value.serverCode = data?.serverCode
        questionValue.value.answers[0].urlFile = data.fileFolder
      }
    })
  }
}
const inputFile = ref<any>(null)
function hanleUploadFileContent(val: any) {
  inputFile.value?.openChooseFile()
}

function changeValue(value: any) {
  questionValue.value.answers[0][props.customKeyValue] = value
  questionValue.value.isAnswered = questionValue.value.answers.filter((item: any) => item[props.customKeyValue] !== null || item.urlFile).length
  emit('update:data', questionValue.value)
}
function deleteFile(value: any) {
  questionValue.value.answers[0].urlFile = null
  questionValue.value.isAnswered = !!questionValue.value.answers.filter((item: any) => item[props.customKeyValue] !== null || item.urlFile).length
  emit('update:isAnswered', questionValue.value.isAnswered)
  emit('update:data', questionValue.value)
}
function handlePinQs() {
  questionValue.value.isMark = !questionValue.value.isMark
}

watch(() => props.data, val => {
  questionValue.value = val
  questionValue.value.isAnswered = !!questionValue.value.answers.filter((item: any) => item[props.customKeyValue] !== null || item.urlFile).length
  emit('update:isAnswered', questionValue.value.isAnswered)
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
    <div
      v-if="!showAnswerTrue"
    >
      <CmInputEditor
        class="mb-4"
        :model-value="questionValue.answers[0][customKeyValue]"
        :text="t('answers')"
        :disabled="disabled"
        @update:model-value="changeValue"
      />
      <div
        v-if="!isReview"
        class="mt-6 mb-4"
      >
        <CpInputFileDrop
          ref="inputFile"
          v-model="questionValue.answers[0].urlFile"
          :disabled="disabled"
          class="w-100 "
          :is-btn-download="false"
          @change="uploadFileLocal"
          @deleteFile="deleteFile"
        />
      </div>
    </div>
    <div
      v-if="isReview"
      class="flex-center text-semibold-md"
    >
      {{ t('scores-essay', { point: 8 }) }}
    </div>
  </div>
</template>

<style lang="scss">
.content-view {
  .item-answer {
    display:flex;
    width: 100%;
    padding: 1rem;
    border: 1px solid rgb(var(--v-gray-300));
    border-radius: var(--v-border-radius-xs);
    margin-bottom: 12px;
    background: #FFF;
  }

  .item-answer:last-child {
    margin-bottom: unset;
  }

  .view-media {
    width: 60%;
  }
}
</style>
