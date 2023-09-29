<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import toast from '@/plugins/toast'
import { scormExtention } from '@/constant/Globals'
import ServerFileService from '@/api/server-file/index'
import { load } from '@/stores/loadComponent.js'
import { ContentType } from '@/constant/data/contentCourseType.json'
import type { Any } from '@/typescript/interface'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const CpInputFile = defineAsyncComponent(() => import('@/components/page/gereral/CpInputFile.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/** ********************************************Thông tin chung******************************************************************** */
/** store */
interface Emit {
  (e: 'update:content', val: Any, unload: any): void
}
interface Props {
  content: Any
}
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
  timeTypeId: 2 as number | null,
  topicCourseId: null as number | null,
  url: null,
  urlFileName: '',
  isCustomTime: false,
  timeVideoOrSound: null,
})
const timeComplete = ref(0)
onMounted(() => {
  watch(() => props.content, val => {
    contentData.value = val
    if (val.id)
      getDetailDocContent()
  }, { immediate: true })
})

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const route = useRoute()
const router = useRouter()
const store = load()
const { unLoadComponent } = store

// end store
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

/** ****upload file */
const myFormAddContent = ref()
const errorsInputFile = ref<any>([])
const contentFile = ref({
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
  haveContent: false,
  file: [] as any[],
  localFileName: null as any, // dùng trong hiện thị tên trong input file và tên file tải xuống
  dataPreview: '',
})

const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const serverCode = ref()
const isLoadingFile = ref(true)
const fileUpload = ref([{ name: 'Real-Time', icon: MethodsUtil.checkType(`${route.params.type}`, ContentType, 'name')?.icon, size: 0, processing: 95 }])
const time = ref({ selfMinute: 5, selfSecond: 0, contentMinute: 0, contentSecond: 0 })

/** method */

// lưu
function saveAndUpdate(idx: any, unload: any) {
  contentData.value.timeVideoOrSound = Number(time.value.contentMinute) * 60 + Number(time.value.contentSecond)
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
      contentData.value.archiveTypeId = 7
      contentData.value.timeTypeId = 2
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

// cập nhật dữ liệu chỉnh sửa
async function getDetailDocContent() {
  if (contentData.value.url && contentData.value.url !== null) {
    contentFile.value.dataPreview = contentData.value.url.replace('loadScorm', 'previewScorm')
    contentFile.value.haveContent = true
    if (contentData.value.time) {
      time.value.selfMinute = Math.floor(contentData.value.time / 60)
      time.value.selfSecond = Math.floor(contentData.value.time % 60)
    }
    await getInfor(contentData.value.url.replace('/loadScorm?fileFolder=', '')).then((value: any) => {
      contentFile.value.localFileName = value.fileName
      if (value?.filePath) {
        serverCode.value = value.serverCode
        contentFile.value.dataPreview = serverCode.value ? `/${serverCode.value}${contentFile.value.dataPreview}` : `/sfv4${contentFile.value.dataPreview}`
        contentFile.value.haveContent = true
      }
      if (value.isProcessing)
        isLoadingFile.value = false
    })
  }
  else { time.value.selfMinute = 5 }
}

/** ** Xử lý file sau khi upload từ input file*********************** */
/// lấy thông tin file
async function getInfor(folder: any) {
  return await MethodsUtil.requestApiCustom(`${SERVERFILE}${ServerFileService.GetInforFile}${folder}`, TYPE_REQUEST.GET)
}

// khi lấy file local lên
async function uploadFileLocal(data: any, file: any) {
  isLoadingFile.value = true

  // gắn thông tin vào progess đang xử lý
  fileUpload.value[0].size = data.size
  fileUpload.value[0].name = data.name

  // gắn name file
  contentFile.value.localFileName = data.name

  // clear log error input file
  if (data.filePath)
    errorsInputFile.value = []

  if (data?.fileFolder) {
    // kiểm tra đối với file không cho phép dowload
    await getInfor(data?.fileFolder).then((value: any) => {
      contentFile.value.localFileName = value.fileName
      if (value?.filePath) {
        serverCode.value = value.serverCode
        contentData.value.url = `/loadScorm?fileFolder=${data.filePath}`
        contentFile.value.dataPreview = serverCode.value ? `/${serverCode.value}/previewScorm?fileFolder=${data.filePath}` : `/sfv4/previewScorm?fileFolder=${data.filePath}`
      }
    })
  }

  // lưu trữ fileFolder sau khi lấy thông tin infor
  contentFile.value.fileFolder = data.fileFolder
  contentFile.value.haveContent = true

  // kiểm tra nếu name trống sẽ lấy tên file làm tên nội dung
  if (contentData.value.name === null || contentData.value.name.length === 0)
    contentData.value.name = data.name

  isLoadingFile.value = false
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
        haveContent: false,
        file: [] as any[],
        localFileName: null,
        dataPreview: '',
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

/** ******************Thực thi created************** */
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
              v-model:model-value="contentData.topicCourseId"
              :field="field"
              :errors="errors"
              :text="`${LABEL.TITLE2}*`"
              :placeholder="LABEL.TITLE2"
              :type="2"
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
              <div class="d-flex align-center">
                <div class="d-flex align-center mr-4">
                  <div>{{ t('duration-time') }}</div>
                </div>
                <div>
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
              {{ t('choose-file-scorm') }}*
            </div>
            <div class="d-flex">
              <Field
                v-model="contentFile.localFileName"
                name="url"
                type="text"
              >
                <CpInputFile
                  v-model="contentFile.file"
                  class="w-100"
                  file-type="Scorm"
                  :file-name="contentFile.localFileName"
                  :accept="scormExtention"
                  :is-btn-download="false"
                  :errors="errorsInputFile"
                  :icon="MethodsUtil.checkType(`${route.params.type}`, ContentType, 'name')?.icon"
                  @change="uploadFileLocal"
                />
              </Field>
            </div>
          </VCol>
        </VRow>
        <VRow v-if="contentFile.haveContent">
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
        <VRow v-if="contentFile.haveContent">
          <VCol
            id="video-preview"
            cols="12"
          >
            <div
              class="embed-responsive"
            >
              <embed
                :src="`${SERVERFILE}${contentFile.dataPreview}`"
              >
            </div>
          </VCol>
        </VRow>
        <VRow v-if="!isLoadingFile && contentFile.haveContent">
          <VCol
            cols="12"
          >
            <div class=" d-flex justify-center">
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
          @on-save="(idx: any, unload: any) => saveAndUpdate(idx, unload)"
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
