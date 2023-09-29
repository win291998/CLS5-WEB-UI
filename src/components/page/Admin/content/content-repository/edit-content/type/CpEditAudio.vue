<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import toast from '@/plugins/toast'
import { audioExtention } from '@/constant/Globals'
import ServerFileService from '@/api/server-file/index'
import { load } from '@/stores/loadComponent.js'
import CmAudio from '@/components/common/CmAudio.vue'
import type { Any } from '@/typescript/interface'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'

interface Emit {
  (e: 'update:content', val: Any, unload: any): void
}
interface Props {
  content: Any
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const CpInputFile = defineAsyncComponent(() => import('@/components/page/gereral/CpInputFile.vue'))
const SkUser = defineAsyncComponent(() => import('@/components/page/gereral/skeleton/SkUser.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmRadio = defineAsyncComponent(() => import('@/components/common/CmRadio.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))
const CmPreviewFile = defineAsyncComponent(() => import('@/components/common/CmPreviewFile.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CpMdProcessing = defineAsyncComponent(() => import('@/components/page/gereral/modal/CpMdProcessing.vue'))

/** store */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const router = useRouter()
const contentData = ref<Any>({
  acceptDownload: false,
  archiveTypeId: null as number | null,
  authorModel: [],
  courseId: 0,
  description: '',
  isApprove: false,
  isPdf: true,
  isRewind: true,
  name: '',
  themeticId: 0,
  time: null as number | null,
  timeTypeId: 1 as number | null,
  topicCourseId: null as number | null,
  url: null,
  urlFileName: '',
  isCustomTime: false,
  timeVideoOrSound: null,
})
const timeComplete = ref(0)
const store = load()
const { unLoadComponent } = store
const schemaInit = reactive({
  name: schemaOption.defaultString,
  url: schemaOption.defaultString,
})
const schemaTime = reactive({
  selfMinute: schemaOption.defaultNumberTime,
  selfSecond: schemaOption.defaultNumberTime,
})
const schema = computed(() => ({
  ...schemaInit,
  ...(contentData.value.timeTypeId === 2 ? schemaTime : {}),
  topicId: schemaOption.defaultSelectSingle,
}))

/** state */
const LABEL = Object.freeze({
  TITLE1: `${t('KW_Lesson_Name')}*`,
  TITLE2: t('topic'),
  TITLE3: t('Teacher'),
  TITLE4: t('auto-approve'),
  TITLE5: t('get-study-time-by-duration'),
  TITLE6: t('setting-speed-video'),
  TITLE7: t('permistion-fringed'),
})
const myFormAddContent = ref()
const errorsInputFile = ref<any>([])
const timeType = ref([1, 2]) // thể loại thời lượng
const time = ref({ selfMinute: 5, selfSecond: 0, contentMinute: 0, contentSecond: 0 })
const timeDuration = ref<any>()
const acceptDownload = ref<any>(false)
const contentFile = ref<Any>({
  alterPath: '',
  name: '',
  size: 0,
  processing: 0,
  fileName: '',
  fileType: null,
  fileExtension: '',
  filePath: '',
  fileOrigin: '',
  fileFolder: '',
  haveDocument: false,
  file: [] as any[],
  localFileName: null as any,
  localUrl: '',
})

const fileUpload = ref([{ name: 'Real-Time', icon: 'tabler:file', size: 0, processing: 95 }])
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const isLoadingFile = ref(true)

async function downloadFile(idx: any) {
  MethodsUtil.dowloadSampleFile(`${SERVERFILE}${contentData.value.url}`,
    TYPE_REQUEST.GET, contentFile.value.localFileName || ' local').then((data: any) => {
    unLoadComponent(idx)
    if (data.status === 200)
      return true

    else
      toast('WARNING', t('download-file-failed'))
  })
    .catch(() => {
      unLoadComponent(idx)
    })
  unLoadComponent(idx)
}
function handleDeleteContent(type: any, idx: any) {
  switch (type) {
    case 'local':
      contentFile.value = {
        alterPath: '',
        name: '',
        size: 0,
        processing: 0,
        fileName: '',
        fileType: null,
        fileExtension: '',
        filePath: '',
        fileOrigin: '',
        fileFolder: '',
        haveDocument: false,
        file: [] as any[],
        localFileName: null,
        localUrl: '',
      }
      contentData.value.urlFileName = ''
      contentData.value.url = ''
      break

    default:
      break
  }
  unLoadComponent(idx)
}

function handleCancle() {
  router.push({ name: 'content-repository' })
}

// lưu
function saveAndUpdate(idx: any, unload: any) {
  contentData.value.timeVideoOrSound = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)
  contentData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)
  if (contentData.value.timeTypeId === 1)
    contentData.value.time = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)

  else
    contentData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)

  if (contentData.value.time === 0) {
    toast('WARNING', t('time-min-0'))
    unLoadComponent(idx)
    return
  }

  if (timeComplete.value && contentData.value.time < timeComplete.value) {
    toast('WARNING', t('content-time-less-than-success-time'))
    unLoadComponent(idx)
    return
  }
  myFormAddContent.value.validate().then(async (success: any) => {
    if (success.valid) {
      contentData.value.archiveTypeId = 5
      emit('update:content', contentData.value, unload)
    }
    else {
      if (!contentData.value.url) {
        errorsInputFile.value = [t('please-choose-files')]
        toast('ERROR', t('please-choose-files'))
        unLoadComponent(idx)
        return
      }
      unLoadComponent(idx)
    }
  })
}

/** ** upload file*********************** */
async function getDocLocalInfo(folder: any, getFileSize?: any) {
  await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET).then((data: any) => {
    contentFile.value.localFileName = data.fileName
    contentFile.value = {
      ...contentFile.value,
      ...data,
    }

    if (data.isProcessing)
      isLoadingFile.value = false
  })
}

async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}
function getDuration(file: any) {
  const video = document.createElement('video')
  contentFile.value.file = [file]
  video.preload = 'metadata'
  video.src = URL.createObjectURL(file)

  video.onloadedmetadata = function () {
    window.URL.revokeObjectURL(video.src)
    const { duration } = video
    if (duration) {
      time.value.contentMinute = Math.floor(duration / 60)
      time.value.contentSecond = Math.floor(duration % 60)
    }
  }
}
async function uploadFileLocal(data: any, file: any) {
  isLoadingFile.value = true
  fileUpload.value[0].size = data.size
  fileUpload.value[0].name = data.name
  contentFile.value.localFileName = data.name
  if (data.filePath)
    errorsInputFile.value = []

  if (acceptDownload.value) {
    contentData.value.url = data.filePath
    contentData.value.urlFileName = data.fileFolder
  }
  else if (data?.fileFolder) {
    await getInfor(data?.fileFolder).then((value: any) => {
      if (value?.filePath) {
        contentData.value.url = value.filePath
        contentData.value.urlFileName = data.fileFolder
      }
    })
  }

  contentFile.value.fileFolder = data.fileFolder

  if (contentData.value.name === null || contentData.value.name.length === 0)
    contentData.value.name = data.name
  contentData.value.acceptDownload = acceptDownload.value
  contentFile.value.haveDocument = true
  isLoadingFile.value = false
}
function changeTimeType() {
  if (timeDuration.value) {
    time.value.contentMinute = Math.floor(timeDuration.value / 60)
    time.value.contentSecond = Math.floor(timeDuration.value % 60)
  }
}
const route = useRoute()
onMounted(() => {
  if (route.params.id) {
    watch(() => props.content, val => {
      contentData.value = val
    }, { immediate: true })
  }
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddContent"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="contentData.name"
            name="name"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="LABEL.TITLE1"
              :placeholder="LABEL.TITLE1"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="contentData.topicCourseId"
            name="topicId"
          >
            <CpTopicSelect
              v-model="contentData.topicCourseId"
              :field="field"
              :errors="errors"
              :type="2"
              :text="`${LABEL.TITLE2}*`"
              :placeholder="LABEL.TITLE2"
            />
          </Field>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('duration-time') }}
          </div>
          <div class="d-flex align-center">
            <div>
              <div class="d-flex align-center mb-6">
                <div class="d-flex align-center mr-4">
                  <CmRadio
                    v-model="contentData.timeTypeId"
                    name="time"
                    :type="1"
                    :value="timeType[0]"
                    @update:model-value="changeTimeType"
                  />
                </div>
                <div class="d-flex align-center mr-4">
                  <div>{{ t('auto-setting-content') }}</div>
                </div>
                <div v-if="contentData.timeTypeId === 1">
                  <div class="d-flex">
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.contentMinute"
                      name="contentMinute"
                      type="number"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              type="number"
                              :model-value="time.contentMinute"
                              disabled
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.contentSecond"
                      name="contentSecond"
                      type="number"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              disabled
                              :model-value="time.contentSecond"
                              type="number"
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
              <div class="d-flex align-center">
                <div class="d-flex align-center mr-4">
                  <CmRadio
                    v-model="contentData.timeTypeId"
                    name="time"
                    :type="1"
                    :value="timeType[1]"
                  />
                </div>
                <div class="d-flex align-center mr-4">
                  <div>{{ t('auto-setting') }}</div>
                </div>
                <div v-if="contentData.timeTypeId === 2">
                  <div class="d-flex">
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.selfMinute"
                      name="selfMinute"
                      type="number"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              type="number"
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                    <Field
                      v-slot="{ field, errors }"
                      v-model="time.selfSecond"
                      name="selfSecond"
                    >
                      <div class="mr-3">
                        <div class="d-flex align-center">
                          <div class="mr-3 conditon-input">
                            <CmTextField
                              :field="field"
                              type="number"
                              :min="0"
                              :max="59"
                            />
                          </div>
                          <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                        </div>
                        <div
                          v-if="errors.length"
                          class="styleError text-errors"
                        >
                          {{ t(MethodsUtil.showErrorsYub(errors)) }}
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow class="mb-4">
        <VCol
          cols="12"
        >
          <CmCheckBox
            v-model:model-value="contentData.isCustomTime"
            :label="LABEL.TITLE5"
          />
        </VCol>
      </VRow>

      <div>
        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <div class="mb-1">
              {{ t('choose-file-audio') }}*
            </div>
            <div class="d-flex">
              <Field
                v-model="contentFile.localFileName"
                name="url"
                type="text"
              >
                <CpInputFile
                  v-model="contentFile.file"
                  v-model:accept-download="acceptDownload"
                  class="w-100"
                  :file-name="contentFile.localFileName"
                  :accept="audioExtention"
                  :is-btn-download="false"
                  is-request-file-install
                  :errors="errorsInputFile"
                  :is-secure="!acceptDownload"
                  @change="uploadFileLocal"
                  @onChangeFile="getDuration"
                />
              </Field>
            </div>
          </VCol>
        </VRow>
        <VRow v-if="contentFile.haveDocument">
          <VCol
            cols="12"
            class="d-flex"
          >
            <CmChip
              :color="acceptDownload ? 'primary' : 'error'"
            >
              <span class="text-medium-xs">{{ acceptDownload ? t("Cho phép tải") : t("Không cho phép tải") }}</span>
            </CmChip>
          </VCol>
        </VRow>
        <VRow v-if="contentFile.haveDocument">
          <VCol
            v-if="isLoadingFile"
            cols="12"
            sm="6"
          >
            <div>
              <CmItemFileUpload
                :icon-status="false"
                :files="fileUpload"
              />
            </div>
          </VCol>
        </VRow>
        <VRow v-if="contentFile.haveDocument">
          <VCol
            id="video-preview"
            cols="12"
            sm="6"
          >
            <CmAudio
              v-model:time="timeDuration"
              width="100"
              :src="contentData?.url"
            />
          </VCol>
        </VRow>
        <VRow v-if="!isLoadingFile && contentFile.haveDocument">
          <VCol
            cols="12"
            sm="6"
          >
            <div class=" d-flex justify-center">
              <CmButton
                v-if=" acceptDownload"
                class="mr-2"
                variant="outlined"
                is-load
                icon="tabler:download"
                :size-icon="18"
                @click="downloadFile"
              />
              <CmButton
                is-load
                icon="tabler:trash"
                variant="outlined"
                color="error"
                :size-icon="18"
                @click="((idx: any) => handleDeleteContent('local', idx))"
              />
            </div>
          </VCol>
        </VRow>
      </div>
      <div>
        <CpActionFooterEdit
          is-cancel
          is-save
          :title-cancel="t('come-back')"
          :title-save="t('save')"
          @on-save="(idx: any) => saveAndUpdate(idx, false)"
          @on-cancel="handleCancle"
        />
      </div>
    </Form>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.embed-responsive {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}
.embed-responsive embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.message-progess{
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
</style>
