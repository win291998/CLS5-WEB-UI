<script setup lang="ts">
import CpAnswerContent from '@/components/page/Admin/content/question/modification/CpAnswerContent.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'

const props = withDefaults(defineProps<Props>(), ({
  question: () => ({
    content: '',
    questionTypeId: 1,
    questionId: 0,
    isDisplay: false,
    isSelected: false,
    contentBasic: '\n',
    urlFile: null,
    answers: [],
  }),
  isEdit: false,
  isView: false,
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update', value: any): void
}
const { t } = window.i18n()
interface Props {
  isEdit: boolean
  question: AnswerItem
  isView: boolean
}
interface AnswerItem {
  content: string
  questionTypeId: null | number
  questionId: null | number
  isSelected: boolean
  isTrue?: boolean
  position?: null | number
  isShuffle?: boolean
  isDisplay: boolean
  urlFile: null | string
  contentBasic: null | string
  answers: any
}
const anserList = ref<AnswerItem>(props.question)
const trueValue = ref(0)
const typeFile = ref()
function createInitData() {
  for (let i = 0; i < 4; i++) {
    anserList.value?.answers.push({
      content: '',
      isTrue: i === 0,
      position: i,
      isShuffle: false,
      urlFile: null,
    })
  }
}
function changeValueIsTrue(val: any) {
  trueValue.value = val
  anserList.value?.answers?.forEach((item: any) => {
    item.isTrue = item.position === val
  })
}
function deleteAns(dataDelete: any) {
  anserList.value.answers.splice(dataDelete.position, 1)
  anserList.value.answers?.forEach((element: any, i: number) => {
    element.position = i
  })
}
function deleteFile(dataDelete: any) {
  anserList.value.urlFile = ''
}

const inputMedia = ref()
function hanleUploadFileContent(val: any) {
  switch (val[0]?.type) {
    case 'image':
      typeFile.value = 1
      nextTick(() => inputMedia.value?.openImage())
      break
    case 'audio':
      typeFile.value = 2
      nextTick(() => inputMedia.value?.openAudio())
      break
    case 'video-local':
      typeFile.value = 3

      nextTick(() => inputMedia.value?.openVideo())
      break
    case 'video-youtube':
      typeFile.value = 4
      nextTick(() => inputMedia.value?.openYoutube())
      break

    default:
      break
  }
}

function handleUpadateUrlFile(val: any) {
  anserList.value.urlFile = val
}
watch(() => anserList, (val: any) => {
  emit('update', anserList.value)
}, { deep: true, immediate: true })
onMounted(() => {
  if (!props.isEdit)
    createInitData()
})
</script>

<template>
  <div>
    <div class="mb-4 text-medium-lg ">
      {{ t('create-question') }}
    </div>
    <div class="mb-2 text-medium-sm">
      {{ t('question-content') }}
    </div>
    <VRow>
      <VCol
        cols="12"
        sm="6"
      >
        <CmInputEditor
          v-model="anserList.content"
          :disabled="isView"
        />
        <CpListTypeFileUpload
          :type="1"
          :disabled="isView"
          class="mb-4"
          @upload="hanleUploadFileContent"
        />
        <CpMediaContent
          ref="inputMedia"
          :disabled="isView"
          class="w-100"
          :src="anserList.urlFile"
          :type-file="typeFile"
          @update:fileFolder="handleUpadateUrlFile"
          @deleteFile="deleteFile"
        />
      </VCol>
      <VCol
        cols="12"
        sm="6"
      >
        <div class="answer-list">
          <div
            v-for="(ans, idAns) in anserList.answers"
            :key="idAns"
            class="answer-item mb-6"
          >
            <CpAnswerContent
              v-model:content="ans.content"
              v-model:url="ans.urlFile"
              v-model:isShuffle="ans.isShuffle"
              :is-view="isView"
              :data="ans"
              :ans-id="idAns"
              :is-true="trueValue"
              @delete="deleteAns"
              @update:isTrue="changeValueIsTrue"
            />
          </div>
        </div>
      </VCol>
    </VRow>
  </div>
</template>
