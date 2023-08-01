<script setup lang="ts">
import CmAudio from '@/components/common/CmAudio.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import ServerFileService from '@/api/server-file/index'
import CmDialogs from '@/components/common/CmDialogs.vue'

import {
  MediaType,
} from '@/constant/Globals'

const props = withDefaults(defineProps<Props>(), ({
  src: '',
}))

const emit = defineEmits<Emit>()

const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const CmImgUpload = defineAsyncComponent(() => import('@/components/common/CmImgUpload.vue'))
const CpInputFile = defineAsyncComponent(() => import('@/components/page/gereral/CpInputFile.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

interface Props {
  src?: any
  disabled?: boolean
  typeFile?: number
}
interface Emit {
  (e: 'update:fileFolder', value: any): void
  (e: 'deleteFile', value?: any): void
}
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

const isViewDetail = ref(false)
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const urlMedia = ref('')
const urlYoutube = ref('')
const youtubeId = ref('')
const refUploadImg = ref<any>(null)
const refUploadVideo = ref<any>(null)
const inputFile = ref<any>(null)
const dataFile = ref<any>({
  filePath: null,
  fileFolder: null,
})
const isShowModalYoutube = ref(false)

const typeMedia = ref<any>(null)
function onCancel() {
  isShowModalYoutube.value = false
}

function onConfirmYoutube() {
  isShowModalYoutube.value = false
  typeMedia.value = 4
  youtubeId.value = MethodsUtil.getYoutubeId(urlYoutube.value)
  urlMedia.value = `https://www.youtube.com/embed/${youtubeId.value}`
  emit('update:fileFolder', youtubeId)
}

function previewYoutube() {
  youtubeId.value = MethodsUtil.getYoutubeId(urlYoutube.value)
}
function onOpenYoutubeUrl() {
  isShowModalYoutube.value = true
}
function changeMedia(type: any, value: any) {
  switch (type) {
    case 'img':
      typeMedia.value = MethodsUtil.getMediaType(value.fileExtension)
      emit('update:fileFolder', value?.fileFolder)
      break

    default:
      break
  }
}
async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}

async function uploadFileLocal(data: any, file: any) {
  if (data?.fileFolder) {
    await getInfor(data?.fileFolder).then((value: any) => {
      if (value?.filePath) {
        typeMedia.value = MethodsUtil.getMediaType(value.fileExtension)
        urlMedia.value = value.filePath
        dataFile.value.filePath = value.filePath
        dataFile.value.fileFolder = data.fileFolder
        dataFile.value.serverCode = data?.serverCode
        emit('update:fileFolder', data?.fileFolder)
      }
    })
  }
}
function handleDelteFile() {
  emit('deleteFile')
}
watch(() => props.src, async (val: any) => {
  if (window._.isEmpty(val)) {
    urlMedia.value = val
    youtubeId.value = val
    urlYoutube.value = val
    return
  }
  switch (props.typeFile) {
    case 4:
      urlMedia.value = `https://www.youtube.com/embed/${youtubeId.value}`
      return

    default:
      await getInfor(val).then(value => {
        if (value?.filePath) {
          typeMedia.value = MethodsUtil.getMediaType(value.fileExtension)
          urlMedia.value = value.filePath
          dataFile.value.filePath = value.filePath
          dataFile.value.fileFolder = val
        }
      })
      break
  }
}, { deep: true })
defineExpose({
  inputFile,
  refUploadVideo,
  refUploadImg,
  openImage: () => refUploadImg.value?.hanleClickImage(),
  openVideo: () => inputFile.value?.openChooseFile(),
  openAudio: () => inputFile.value?.openChooseFile(),
  openYoutube: () => onOpenYoutubeUrl(),
})
</script>

<template>
  <div class="media-content">
    <div :class="{ inputMediaImg: typeMedia === MediaType.IMAGE }">
      <CmImgUpload
        ref="refUploadImg"
        v-model:src="urlMedia"
        :disabled="disabled"
        :hide="typeMedia !== MediaType.IMAGE"
        color="infor"
        is-size-full
        :is-classic-border="false"
        :is-rounded="true"
        :is-icon-text="false"
        icon="tabler:square-rounded-plus-filled"
        :tooltip="t('system-management.100x100')"
        @update:file="($event: any) => changeMedia('img', $event)"
      />
    </div>
    <div class="d-none">
      <CpInputFile
        ref="inputFile"
        v-model:src="urlMedia"
        class="w-100 "
        :accept="MethodsUtil.getMediaTypeExtention(typeFile)"
        :disabled="isViewDetail"
        :is-btn-download="false"
        is-request-file-install
        @change="uploadFileLocal"
      />
    </div>
    <CmAudio
      v-if="typeMedia === MediaType.AUDIO && urlMedia"
      v-model:src="urlMedia"
      width="100"
    />

    <div class="d-flex justify-center">
      <embed
        v-if="typeMedia === MediaType.VIDEO && urlMedia"
        :src="`${SERVERFILE}${urlMedia}`"
        class="imageFull"
      >
    </div>
    {{ youtubeId }}

    <div
      v-if="typeMedia === MediaType.YOUTUBE && urlMedia"
      class="d-flex justify-center"
    >
      <embed
        :src="urlMedia"
        class="imageFull"
      >
    </div>
    <div
      v-if="urlMedia"
      class="d-flex justify-center mt-2"
    >
      <CmButton
        icon="fe:trash"
        :size-icon="20"
        variant="tonal"
        class="mr-3"
        bg-color="bg-white"
        color="white"
        text-color="color-dark"
        @click="handleDelteFile"
      />
    </div>
  </div>
  <div>
    <CmDialogs
      :title="t('Đường dẫn youtube')"
      :is-dialog-visible="isShowModalYoutube"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      size="sm"
      @cancel="onCancel"
      @confirm="onConfirmYoutube"
    >
      <div class="d-flex align-center mb-2">
        <CmTextField
          v-model="urlYoutube"
          :placeholder="t('enter-link')"
          class="w-100 mr-2"
        />
        <CmButton
          :disabled="!urlYoutube || urlYoutube?.length === 0"
          @click="previewYoutube"
        >
          {{ t("search") }}
        </CmButton>
      </div>

      <embed
        v-if="youtubeId"
        class="w-100 imageFull"
        :src="`https://www.youtube.com/embed/${youtubeId}`"
      >
    </CmDialogs>
  </div>
</template>

<style scoped>
.media-content{
  .inputMediaImg{
    width: auto;
    height: 12.5rem;
  }
}
.imageFull{
  width: auto;
  height: 12.5rem;
}
</style>
