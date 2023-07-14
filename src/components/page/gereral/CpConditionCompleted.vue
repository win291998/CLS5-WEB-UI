<!-- eslint-disable indent -->
<script setup lang="ts">
import CpQuestionCondition from '../Admin/course/modify/content/type/video/CpQuestionCondition.vue'
import { validatorStore } from '@/stores/validatator'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import { load } from '@/stores/loadComponent.js'
import { configStore } from '@/stores/index'
import toast from '@/plugins/toast'

import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), {
  conditionCompleteData: () => ({
    archiveId: null,
    courseContentId: null,
    courseId: null,
    isAfterTime: false,
    isAnswerTheQuestion: false,
    isComplete: false,
    noticeTimeAttendance: 0,
    numberOfAttendance: 0,
    pointRatio: 0,
    time: 0,
    timeFinish: 0,
    timeTypeId: 0,
  }),
  testConfig: () => ({
    courseContentId: null,
    isCompleteEnoughPoints: false,
    isCorrectAnswer: false,
    isDisplayFalseAnswer: false,
    isDisplayPoint: false,
    isDisplayResult: false,
    isMaintainStatus: false,
    isPreserveTime: false,
    isRequiredRetest: false,
    isReviewTheTest: false,
    isShuffleQuestion: false,
    minuteOfWork: 0,
    numberOfRetake: 0,
    pointRatio: 0,
    randomQuestion: 0,
    requiredPointRatio: 80,
    retakeResultType: 0,
    reviewId: undefined,
    timeFinish: 0,
    totalQuestionDisplayInPage: 0,
    writeLogMinute: 0,
  }),
  timeComplete: 0,
  secondWork: 0,
  timeData: () => ({
    minuteTime: 0,
    secondTime: 0,
    noActiveMinute: 0,
    noActiveSecond: 0,
    noticeMinute: 0 as any,
    noticeSecond: 0 as any,
  }),
})

// Khởi tạo biến đa ngôn ngữ
const emit = defineEmits<Emit>()
const { t } = window.i18n()
const router = useRouter()
const route = useRoute()

/** store */
const store = load()
const { unLoadComponent } = store
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm } = storeValidate
const { submitForm } = useForm()

const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)

/** state */

/** state */
const LABEL = Object.freeze({
  TITLE1: t('setting-time'),
  LABEL1: t('click-complete'),
  LABEL2: t('befor-time'),
  LABEL3: t('attendance-time'),
  LABEL4: t('anwser-question'),
})

const myFormAddConditionComplete = ref()
const conditionComplete = ref<ConditionComplete>({
  archiveId: null,
  courseContentId: null,
  courseId: null,
  isAfterTime: false,
  isAnswerTheQuestion: false,
  isComplete: false,
  noticeTimeAttendance: 0,
  numberOfAttendance: 0,
  pointRatio: 0,
  time: 0,
  timeFinish: 0,
  timeTypeId: 0,
})
const schema = computed(() => ({
  ...(conditionComplete.value.isAfterTime
    ? {
        minuteTime: schemaOption.defaultNumberNoReqPosNoNull,
        secondTime: schemaOption.defaultNumberTime,
        noActiveMinute: schemaOption.defaultNumberNoReqPosNoNull,
        noActiveSecond: schemaOption.defaultNumberTime,
      }
    : {}),
}))

interface Time {
  minuteTime: number
  secondTime: number
  noActiveMinute: number
  noActiveSecond: number
  noticeMinute: any
  noticeSecond: any
}
interface ConditionComplete {
  archiveId: any
  courseContentId: any
  courseId: any
  isAfterTime: boolean
  isAnswerTheQuestion: boolean
  isComplete: boolean
  noticeTimeAttendance: number
  numberOfAttendance: number
  pointRatio: number
  time: number
  timeFinish: number
  timeTypeId: number
  [e: string]: any
}
interface Props {
  timeComplete: any
  conditionCompleteData: ConditionComplete
  timeData: Time
  isAllowRetake: boolean
  isAutoLog: boolean
  isHaveConfig: boolean
  isNumberPerPage: boolean
  isShowRandom: boolean
  isTimeOfWork: boolean
  isViewDetail: boolean
  minuteWork: number
  testConfig: TestConfig
  secondWork: any
  listQuestions: Any[]
}

interface TestConfig {
  courseContentId: any
  isCompleteEnoughPoints: boolean
  isCorrectAnswer: boolean
  isDisplayFalseAnswer: boolean
  isDisplayPoint: boolean
  isDisplayResult: boolean
  isMaintainStatus: boolean
  isPreserveTime: boolean
  isRequiredRetest: boolean
  isReviewTheTest: boolean
  isShuffleQuestion: boolean
  minuteOfWork: number
  numberOfRetake: number
  pointRatio: number
  randomQuestion: number
  requiredPointRatio: number
  retakeResultType: number
  reviewId: undefined
  timeFinish: number
  totalQuestionDisplayInPage: number
  writeLogMinute: number
}
interface Emit {
  (e: 'update:conditionCompleteData', data: any): void
  (e: 'update:timeData', data: any): void
  (e: 'update:isAllowRetake', data: any): void
  (e: 'update:isAutoLog', data: any): void
  (e: 'update:isHaveConfig', data: any): void
  (e: 'update:isNumberPerPage', data: any): void
  (e: 'update:isShowRandom', data: any): void
  (e: 'update:isTimeOfWork', data: any): void
  (e: 'update:isViewDetail', data: any): void
  (e: 'update:minuteWork', data: any): void
  (e: 'update:testConfig', data: any): void
  (e: 'update:timeComplete', data: any): void
}
const time = ref<Time>({
  minuteTime: 0,
  secondTime: 0,
  noActiveMinute: 0,
  noActiveSecond: 0,
  noticeMinute: 0 as any,
  noticeSecond: 0 as any,
})

async function getDefaultSetting() {
  const defaultRatioPoints = settingDefaults.value.find(item => item.typeId === 4)
  emit('update:testConfig', {
    ...props.testConfig,
    isCompleteEnoughPoints: !!defaultRatioPoints?.value,
  })
}
function loadDataEdit() {
  time.value = {
    minuteTime: Math.floor(conditionComplete.value.timeFinish / 60),
    secondTime: (conditionComplete.value.timeFinish % 60),
    noActiveMinute: Math.floor(conditionComplete.value.noticeTimeAttendance / 60),
    noActiveSecond: (conditionComplete.value.noticeTimeAttendance % 60),
    noticeMinute: Math.floor(conditionComplete.value.numberOfAttendance / 60),
    noticeSecond: (conditionComplete.value.numberOfAttendance % 60),
  }
  emit('update:timeData', time.value)
  changeTimeComplete()
}
function changeTimeComplete() {
  emit('update:timeComplete', conditionComplete.value.isAfterTime ? Number(time.value.minuteTime) * 60 + Number(time.value.secondTime) : 0)
}

// get config
async function fetchConfig() {
  const params = { id: Number(route.params.contentId) }
  await MethodsUtil.requestApiCustom(CourseService.GetConfiguration, TYPE_REQUEST.GET, params).then((value: any) => {
    if (value.data !== null) {
      // isHaveConfig.value = true
      emit('update:isHaveConfig', true)
      emit('update:testConfig', value.data)

      // testConfig.value = value.data
    }
  })
}
function showNotiError(errorObject: any) {
  window._.forEach(errorObject, (value, key) => {
    toast('ERROR', t('Thông tin tùy chỉnh không hợp lệ'))
  })
}
const myFormSettingConditions = ref()

// lưu  dữ liệu
async function saveDataCondition(idx: any) {
  myFormAddConditionComplete.value.validate().then(async (success: any) => {
    unLoadComponent(idx)
    if (success.valid) {
      if (conditionComplete.value.isComplete === false && conditionComplete.value.isAfterTime === false && conditionComplete.value.isAnswerTheQuestion === false) {
        toast('WARNING', t('condition-complete-invalid'))
        return
      }

      if (conditionComplete.value.isAfterTime === true && time.value.minuteTime !== null && time.value.secondTime !== null) {
        // conditionComplete.value.timeFinish =
        emit('update:conditionCompleteData', {
          ...conditionComplete.value,
          timeFinish: Number(time.value.minuteTime) * 60 + Number(time.value.secondTime),
        })
        if (time.value.noActiveMinute !== null && time.value.noActiveSecond !== null) {
          conditionComplete.value.noticeTimeAttendance = Number(time.value.noActiveMinute) * 60 + Number(time.value.noActiveSecond)
          emit('update:conditionCompleteData', conditionComplete.value)
        }

        else {
          emit('update:conditionCompleteData', {
            ...conditionComplete.value,
            noticeTimeAttendance: 0,
          })

          // conditionComplete.value.noticeTimeAttendance = 0
        }
        if ((time.value.noticeMinute !== null) && time.value.noticeSecond !== null) {
          conditionComplete.value.numberOfAttendance = Number(time.value.noticeMinute) * 60 + Number(time.value.noticeSecond)
          emit('update:conditionCompleteData', conditionComplete.value)
        }
        else {
          conditionComplete.value.numberOfAttendance = 0
          emit('update:conditionCompleteData', conditionComplete.value)
        }
        if (conditionComplete.value.timeFinish <= conditionComplete.value.noticeTimeAttendance) {
          toast('WARNING', t('notice-time-less-than-success-time'))
          return
        }
      }
      else {
        conditionComplete.value = {
          ...conditionComplete.value,
          timeFinish: 0,
          noticeTimeAttendance: 0,
          numberOfAttendance: 0,
        }
        emit('update:conditionCompleteData', conditionComplete.value)
      }
      if (conditionComplete.value.isAnswerTheQuestion) {
        // thiết lập các giá trih về mặc định khi ko chọn
        if (props.isNumberPerPage !== true) {
          emit('update:testConfig', {
            ...props.testConfig,
            totalQuestionDisplayInPage: 0,
          })
        }
        if (props.isShowRandom !== true) {
          emit('update:testConfig', {
            ...props.testConfig,
            randomQuestion: 0,
          })
        }
        if (props.isTimeOfWork !== true) {
          emit('update:testConfig', {
            ...props.testConfig,
            minuteWork: 0,
          })
        }
        if (props.isAutoLog !== true) {
          emit('update:testConfig', {
            ...props.testConfig,
            writeLogMinute: 0,
          })
        }
        if (props.isAllowRetake !== true) {
          emit('update:testConfig', {
            ...props.testConfig,
            numberOfRetake: 0,
            retakeResultType: 0,
          })
        }
        const validateSet = await myFormSettingConditions.value.validate().then(async (successSetting: any) => {
          if (successSetting.valid) {
            if (props.isTimeOfWork === true && props.minuteWork !== null && props.secondWork !== null) {
              emit('update:testConfig', {
                ...props.testConfig,
                minuteOfWork: Number(props.minuteWork) * 60 + Number(props.secondWork),
              })
            }

            else {
              emit('update:testConfig', {
                ...props.testConfig,
                minuteOfWork: 0,
              })
            }
            if (props.isAutoLog === true && props.testConfig.writeLogMinute && props.testConfig.writeLogMinute < 1)
              return false
            unLoadComponent(idx)
            return true
          }
          else {
            unLoadComponent(idx)
            showNotiError(successSetting.errors)
            return false
          }
        })
        if (!validateSet)
          return
      }
      let response
      response = await MethodsUtil.requestApiCustom(CourseService.PostSaveRequireFinish, TYPE_REQUEST.POST, conditionComplete.value)
      if (response.code === 200) {
        toast('SUCCESS', t(response.message))

        // cập nhật config
        changeTimeComplete()
        if (conditionComplete.value.isAnswerTheQuestion === true) {
          emit('update:testConfig', {
            ...props.testConfig,
            courseContentId: Number(route.params.contentId),
          })

          // thêm config
          if (props.isHaveConfig === true) {
            await MethodsUtil.requestApiCustom(CourseService.PostuUpdateTestConfig, TYPE_REQUEST.POST, props.testConfig)
          }
          else {
            const res = await MethodsUtil.requestApiCustom(CourseService.PostuCreateTestConfig, TYPE_REQUEST.POST, props.testConfig)
            if (res.code === 200) {
              emit('update:testConfig', {
                ...props.testConfig,
                id: res.data,
              })
              emit('update:isHaveConfig', true)
            }
          }

          // lưu danh sách câu hỏi
          const model = {
            courseContentId: Number(route.params.contentId),
            listData: props.listQuestions || [],
          }

          // Nếu là câu hỏi vừa được tạo thì set id = 0
          model.listData?.forEach((element: any) => {
            if (typeof element.id === 'string')
              element.id = 0

            element.questionId = element.id === 0 ? 0 : element.questionId
            element.listQuestions.forEach((item: any) => {
              item.questionId = item.id === 0 ? 0 : item.questionId
            })
          })
          response = await MethodsUtil.requestApiCustom(CourseService.PostuUpdateQuestionTest, TYPE_REQUEST.POST, model)
        }
      }
      else {
        toast('ERROR', t(response.message))
      }
    }
  })
}

function changeType(val: any, type: string) {
  conditionComplete.value[type] = val
  emit('update:conditionCompleteData', conditionComplete.value)

  if (val && type === 'isComplete') {
    conditionComplete.value = {
      ...conditionComplete.value,
      isAfterTime: false,
      isAnswerTheQuestion: false,
    }
    emit('update:conditionCompleteData', conditionComplete.value)
  }
  if (val && ['isAfterTime', 'isAnswerTheQuestion'].includes(type)) {
    conditionComplete.value = {
      ...conditionComplete.value,
      isComplete: false,
    }
    emit('update:conditionCompleteData', conditionComplete.value)
  }
}
onMounted(async () => {
  if (!conditionComplete.value.isAnswerTheQuestion)
    await getDefaultSetting()
  loadDataEdit()
  if (route.params.contentId)
    await fetchConfig()
})

watch(() => props.conditionCompleteData, (val: any) => {
  conditionComplete.value = { ...val }

  // loadDataEdit()
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormAddConditionComplete"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          sm="5"
          lg="4"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('setting-conditions') }}
          </div>
          <div>
            <CmCheckBox
              v-model:model-value="conditionComplete.isComplete"
              :label="LABEL.LABEL1"
              @update:model-value="changeType($event, 'isComplete')"
            />
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
        >
          <div class="text-semibold-md color-text-900 mb-4 ">
            {{ t('setting-conditions') }}
          </div>
          <div class="d-flex align-center">
            <div class="d-flex align-center">
              <CmCheckBox
                v-model:model-value="conditionComplete.isAfterTime"
                :disabled="isViewDetail"
                @update:model-value="changeType($event, 'isAfterTime')"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ LABEL.LABEL2 }}</div>
            </div>
            <div v-show="conditionComplete.isAfterTime">
              <div class="d-flex">
                <Field
                  v-slot="{ field, errors }"
                  v-model:model-value="time.minuteTime"
                  name="minuteTime"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :field="field"
                          type="number"
                          :model-value="time.minuteTime"
                          :disabled="isViewDetail"
                          :min="0"
                          :max="59"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                    </div>
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
                <Field
                  v-slot="{ field, errors }"
                  :model-value="time.secondTime"
                  name="secondTime"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          :field="field"
                          :disabled="isViewDetail"
                          :model-value="time.secondTime"
                          type="number"
                          :min="0"
                          :max="59"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                    </div>
                    <div class="styleError text-errors">
                      {{ errors[0] }}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
          <div
            v-show="conditionComplete.isAfterTime"
          >
            <div
              class="d-flex align-center"
            >
              <div class="d-flex align-center mr-4 ml-8">
                <div>{{ LABEL.LABEL3 }}</div>
              </div>
              <div>
                <div class="d-flex">
                  <Field
                    v-slot="{ field, errors }"
                    :model-value="time.noActiveMinute"
                    name="noActiveMinute"
                    type="number"
                  >
                    <div class="mr-3">
                      <div class="d-flex align-center">
                        <div class="mr-3 conditon-input">
                          <CmTextField
                            :field="field"
                            type="number"
                            :model-value="time.noActiveMinute"
                            :disabled="isViewDetail"
                            :min="0"
                            :max="59"
                          />
                        </div>
                        <span class="text-regular-md">{{ t('minutes').toLowerCase() }}</span>
                      </div>
                      <div class="styleError text-errors">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </Field>
                  <Field
                    v-slot="{ field, errors }"
                    :model-value="time.noActiveSecond"
                    name="noActiveSecond"
                    type="number"
                  >
                    <div class="mr-3">
                      <div class="d-flex align-center">
                        <div class="mr-3 conditon-input">
                          <CmTextField
                            :field="field"
                            :disabled="isViewDetail"
                            :model-value="time.noActiveSecond"
                            type="number"
                            :min="0"
                            :max="59"
                          />
                        </div>
                        <span class="text-regular-md">{{ t('seconds').toLowerCase() }}</span>
                      </div>
                      <div class="styleError text-errors">
                        {{ errors[0] }}
                      </div>
                    </div>
                  </Field>
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
          <div class="d-flex align-center mb-4">
            <div class="d-flex align-center mr-4">
              <CmCheckBox
                v-model:model-value="conditionComplete.isAnswerTheQuestion"
                :label="LABEL.LABEL4"
                :disabled="isViewDetail"
                @update:model-value="changeType($event, 'isAnswerTheQuestion')"
              />
            </div>
          </div>
        </vcol>
      </VRow>
      <div v-show="conditionComplete.isAnswerTheQuestion">
        <div class="text-medium-lg">
          {{ t('list-content-req') }}
        </div>
        <CpQuestionCondition ref="myFormSettingConditions" />
      </div>
      <div>
        <CpActionFooterEdit
          is-cancel
          is-save
          :title-cancel="t('cancel-title')"
          :title-save="t('save')"
          @on-save="saveDataCondition"
        />
        <!-- @on-cancel="handleCancle" -->
      </div>
    </Form>
  </div>
</template>
