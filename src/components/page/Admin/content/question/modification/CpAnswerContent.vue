<script setup lang="ts">
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmRadio from '@/components/common/CmRadio.vue'
import CmInputEditor from '@/components/common/inputEditor/CmInputEditor.vue'
import CpListTypeFileUpload from '@/components/page/gereral/CpListTypeFileUpload.vue'
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'

interface Props {
  data: any
  ansId: any
  isTrue: any
  content: any
  isView: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  isTrue: null,
  isShuffle: false,
  isView: false,
  data: () => ({
    content: '',
    isTrue: false,
    position: null,
    isShuffle: true,
    urlMedia: null,
  }),

}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:isTrue', value: any): void
  (e: 'update:content', value: any): void
  (e: 'update:url', value: any): void
  (e: 'update:isShuffle', value: any): void
  (e: 'delete', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const answerData = ref(props.data)
const inputMedia = ref()
const listMenu = ref([
  {
    title: 'shuffled-question',
    icon: 'tabler:arrows-cross',
    actived: false,
  },
])
function changeValue(val: any) {
  answerData.value.isTrue = val === answerData.value.position

  emit('update:isTrue', val)
}
function eventToolShuffle(val: any) {
  listMenu.value[0].actived = !listMenu.value[0].actived
  emit('update:isShuffle', listMenu.value[0].actived)
}
function handleChangeContent(val: any) {
  emit('update:content', val)
}
const typeFile = ref()
const isShowFile = ref(false)
const getIndex = computed(() => `${String.fromCharCode(65 + props.data.position)}.`)
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
    case 'delete':
      typeFile.value = null

      emit('delete', props.data)
      break

    default:
      break
  }
}
function handleUpadateUrlFile(val: any) {
  emit('update:url', val)
}
</script>

<template>
  <VRow>
    <VCol
      cols="2"
      class="d-flex align-center"
    >
      <CmRadio
        :model-value="isTrue"
        :disabled="isView"
        name="result"
        :value="ansId"
        @update:model-value="changeValue"
      />

      <CmCheckBox
        :model-value="isTrue"
        :disabled="isView"
        @update:model-value="changeValue"
      />
      <div class="px-3">
        {{ getIndex }}
      </div>
    </VCol>
    <VCol
      cols="9"
      class="pxn"
    >
      <CmInputEditor
        :disabled="isView"
        :list-menu="listMenu"
        rlt="end"
        is-menu-simple
        min-height="50px"
        width="100%"
        :model-value="content"
        @update:event="eventToolShuffle"
        @update:modelValue="handleChangeContent"
      />
    </VCol>
    <VCol
      cols="1"
      class="d-flex align-center"
    >
      <CpListTypeFileUpload
        :type="2"
        :disabled="isView"
        @upload="hanleUploadFileContent"
      />
    </VCol>
  </VRow>
  <!-- <VRow :style="{ display: data.urlMedia ? 'block' : 'none' }"> -->
  <VRow v-show="data.urlMedia">
    <VCol
      cols="9"
      offset="2"
    >
      <CpMediaContent
        ref="inputMedia"
        :disabled="isView"
        class="w-100"
        :src="data.urlMedia"
        :type-file="typeFile"
        @update:fileFolder="handleUpadateUrlFile"
      />
    </VCol>
  </VRow>
</template>
