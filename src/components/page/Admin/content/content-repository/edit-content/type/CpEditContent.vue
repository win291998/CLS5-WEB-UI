<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import MethodsUtil from '@/utils/MethodsUtil'
import toast from '@/plugins/toast'
import { load } from '@/stores/loadComponent.js'
import { ContentType } from '@/constant/data/contentCourseType.json'
import CpTopicSelect from '@/components/page/gereral/CpTopicSelect.vue'

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const CmInputEditor = defineAsyncComponent(() => import('@/components/common/inputEditor/CmInputEditor.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))

/** ********************************************Thông tin chung******************************************************************** */
/** store */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const route = useRoute()
const router = useRouter()
const store = load()
const { unLoadComponent } = store
interface Props {
  content: any
}
const contentData = ref({
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
})
const timeComplete = ref(0)

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
})
const schemaTime = reactive({
  selfMinute: schemaOption.defaultNumberTime,
  selfSecond: schemaOption.defaultNumberTime,
})
const schema = computed(() => ({
  ...schemaInit,
  ...(contentData.value.timeTypeId === 2 ? schemaTime : {}),
  description: schemaOption.defaultStringArea,
  topicId: schemaOption.defaultSelectSingle,
}))

/** ****upload file */
const myFormAddContent = ref()
const isLoadingFile = ref(true)
const time = ref({ selfMinute: 5, selfSecond: 0, contentMinute: 0, contentSecond: 0 })
interface Emit {
  (e: 'update:content', val: any, unload: any): void
}

watch(() => props.content, val => {
  contentData.value = val
  if (val.id)
    getDetailDocContent()
}, { immediate: true })

/** method */

function saveAndUpdate(unload: any) {
  contentData.value.time = Number(time.value.selfMinute) * 60 + Number(time.value.selfSecond)
  if (contentData.value.time === 0) {
    toast('WARNING', t('time-min-0'))
    unload()
    return
  }

  if (timeComplete.value && contentData.value.time < timeComplete.value) {
    toast('WARNING', t('content-time-less-than-success-time'))
    unload()
    return
  }
  myFormAddContent.value.validate().then(async (success: any) => {
    if (success.valid) {
      contentData.value.archiveTypeId = MethodsUtil.checkType(`${route.params.type}`, ContentType, 'name')?.value
      contentData.value.timeTypeId = 2
      emit('update:content', contentData.value, unload)
    }
    else { unload() }
  })
}

// cập nhật dữ liệu chỉnh sửa
async function getDetailDocContent() {
  if (contentData.value.time) {
    time.value.selfMinute = Math.floor(contentData.value.time / 60)
    time.value.selfSecond = Math.floor(contentData.value.time % 60)
  }
  else { time.value.selfMinute = 5 }
}

function handleCancle() {
  router.push({ name: 'content-repository' })
}
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
      <VRow>
        <VCol
          cols="12"
        >
          <CmCheckBox
            v-model:model-value="contentData.isCustomTime"
            :label="LABEL.TITLE5"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div>
            <Field
              v-slot="{ field, errors }"
              :model-value="contentData.description"
              name="description"
              type="string"
            >
              <CmInputEditor
                v-model:model-value="contentData.description"
                :field="field"
                :errors="errors"
                :text="`${t('content')}*`"
              />
            </field>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <CpActionFooterEdit
            is-cancel
            is-save
            :title-cancel="t('come-back')"
            :title-save="t('save')"
            :title-save-and-update="t('save-and-update')"
            @on-save="(idx: any, unload: any) => saveAndUpdate(unload)"
            @on-cancel="handleCancle"
          />
        </VCol>
      </VRow>
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
