<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { configStore } from '@/stores/index'
import CmTextField from '@/components/common/CmTextField.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CmRadio from '@/components/common/CmRadio.vue'

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup, ruleMessage } = storeValidate
const configControl = configStore()
const { settingDefaults } = storeToRefs(configControl)

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const LABEL = Object.freeze({
  LABEL1: t('anwser-question'),
  LABEL2: t('ratio-req'),
  LABEL3: t('ratio-complete-point'),
})
interface Props {
  totalQuestion: number
}

interface Emit {
  (e: string, value: any): void
}

const isNumberPerPage = ref(false)
const isTimeOfWork = ref(false)
const isAutoLog = ref(false)
const isViewDetail = ref(false)
const isAllowRetake = ref(false)
const isCompleteEnoughPoints = ref(false)
const isPreserveTime = ref(false)
const minuteOfWork = ref(false)
const minuteWork = ref<any>(null)
const myFormConfig = ref()

// biến model
const pointRatio = ref(0)
const courseContentId = ref(null)
const requiredPointRatio = ref(80)
const totalQuestionDisplayInPage = ref(0)
const writeLogMinute = ref(0)
const numberOfRetake = ref(0)
const retakeResultType = ref(0)
const reviewId = ref(null)
const isRequiredRetest = ref(false)
const isDisplayPoint = ref(false)
const isDisplayResult = ref(false)
const isCorrectAnswer = ref(false)
const timeFinish = ref(0)
const isReviewTheTest = ref(false)
const isMaintainStatus = ref(false)
const isDisplayFalseAnswer = ref(false)
const secondWork = ref<any>(null)

// state mới
const isShuffle = ref(false)
const pageSize = ref<number>(0)
const randomQuestion = ref<number>(0)
const countDown = ref<number>(0)
const persistentStatus = ref<boolean>(false)
const persistentTime = ref<boolean>(false)
const authRequest = ref<boolean>(false)

// state dùng trên component
const isShowPageSize = ref(false)
const isShowRandom = ref(false)
const isCountDown = ref(false)
const isAuthRequest = ref(false)

const schema = computed(() => ({
  pointRatio: schemaOption.defaultNumber100YubNoRequire,
  ...(isShowPageSize.value ? ({ totalQuestionDisplayInPage: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isShowRandom.value ? ({ randomQuestion: schemaOption.defaultNumberNoReqPosNoNulls(props.totalQuestion) }) : {}),
  ...(isTimeOfWork.value ? ({ minuteWork: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isTimeOfWork.value ? ({ secondWork: schemaOption.defaultNumberTime }) : {}),
  ...(isAutoLog.value ? ({ writeLogMinute: schemaOption.defaultNumberNoReqPosNoNull }) : {}),
  ...(isAllowRetake.value ? ({ numberOfRetake: schemaOption.defaultNumberNoReqPosNoNullNot0 }) : {}),
  authRequest: yup.number().typeError(ruleMessage.typeNumber).test('positive', ruleMessage.positive, (value: any) => value >= 0).nullable().required(ruleMessage.required()).max(16, 'Số mốc nhỏ hơn hoặc bằng 16'),
}))

function updateValue(val: any, text: string) {
  // value[text] = val
  // emit('update:testConfigModel', testConfig.value)
}

function allowRetakeChange(val: boolean) {
  if (retakeResultType.value === 0)
    retakeResultType.value = 1
}
function timeOfWorkChange() {
  minuteOfWork.value = Number(minuteWork.value) * 60 + secondWork.value
  if (isTimeOfWork.value && minuteWork.value !== null && secondWork.value !== null) {
    if (!(Number(minuteWork.value) * 60 + Number(secondWork.value) > 0))
      isPreserveTime.value = false
  }
  else {
    isPreserveTime.value = false
  }
}
function changeReviewMode(val: any, type: any) {
  [type] = val
  if (type === 'isDisplayFalseAnswer' && val) {
    isCorrectAnswer.value = false
    isDisplayResult.value = false
  }
  if (val && ['isCorrectAnswer', 'isDisplayResult'].includes(type))
    isDisplayFalseAnswer.value = false
}

defineExpose({
  myFormConfig,
})
</script>

<template>
  <div class="mt-6">
    <Form
      ref="myFormConfig"
      :validation-schema="schema"
    >
      <VRow>
        <VCol class="d-flex align-center mr-4 text-semibold-md">
          <div>{{ t('setting-custom') }}</div>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="isShuffle"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'isShuffle')"
          >
            <span class="ml-2">{{ t('shuffer-question') }}</span>
          </CmCheckBox>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          class="d-flex align-center"
        >
          <div>
            <CmCheckBox
              v-model:model-value="isShowPageSize"
              :disabled="isViewDetail"
            >
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('number-pages') }}
              </div>
            </CmCheckBox>
          </div>

          <div
            v-if="isShowPageSize"
            class="d-flex align-center h-100"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :disabled="isViewDetail"
                :model-value="pageSize"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div class="d-flex align-center h-100">
                  <div class="mr-3 conditon-input">
                    <CmTextField
                      v-model="pageSize"
                      :field="field"
                      type="number"
                      style="width: 90px;"
                      :disabled="isViewDetail"
                      :is-errors="!!errors.length"
                      :min="0"
                      @update:model-value="updateValue($event, 'totalQuestionDisplayInPage')"
                    />
                  </div>
                  <span class="text-regular-md">{{ t('question') }}</span>
                </div>
                <div
                  v-if="errors.length"
                  class="styleError text-errors"
                >
                  {{ t(MethodsUtil.showErrorsYub(errors)) }}
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>

      <VRow>
        <VCol class="d-flex align-center">
          <CmCheckBox
            v-model:model-value="isShowRandom"
            :disabled="isViewDetail"
            @update:model-value=" emit('update:isShowRandomModel', $event)"
          >
            <div class="d-flex align-center">
              <div class="ml-2 mr-4 text-medium-md">
                {{ t('random') }}
              </div>
            </div>
          </CmCheckBox>

          <div
            v-if="isShowRandom"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="randomQuestion"
                :disabled="isViewDetail"
                name="randomQuestion"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="randomQuestion"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'randomQuestion')"
                      />
                    </div>
                    <span class="text-regular-md">{{ t('over') }} {{ totalQuestion }} {{ t('question').toLowerCase() }}</span>
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
        </VCol>
      </VRow>

      <VRow>
        <VCol class="d-flex align-center">
          <CmCheckBox
            v-model:model-value="isCountDown"
            :disabled="isViewDetail"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('countdown-on-exam') }}
            </div>
          </CmCheckBox>
          <div
            v-if="isCountDown"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :disabled="isViewDetail"
                :model-value="minuteWork"
                name="minuteWork"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="countDown"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        :max="59"
                        @change="timeOfWorkChange"
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
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox v-model:model-value="persistentStatus">
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('persistent-status') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex align-center">
          <CmCheckBox
            v-model:model-value="isTimeOfWork"
            :disabled="isViewDetail"
            @update:model-value=" emit('update:isTimeOfWorkModel', $event)"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('time-doing') }}
            </div>
          </CmCheckBox>
          <div
            v-if="isTimeOfWork"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :disabled="isViewDetail"
                :model-value="minuteWork"
                name="minuteWork"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="minuteWork"
                        :field="field"
                        type="number"
                        :disabled="isViewDetail"
                        :min="0"
                        :max="59"
                        @change="timeOfWorkChange"
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
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CmCheckBox v-model:model-value="persistentTime">
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('preserving-time') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="3">
          <CmCheckBox
            v-model:model-value="isAuthRequest"
            :disabled="isViewDetail"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('auto-request-face') }}
            </div>
          </CmCheckBox>
        </VCol>
        <VCol
          v-if="isAuthRequest"
          class="d-flex align-center"
        >
          <div class="mr-3">
            <Field
              v-slot="{ field, errors }"
              :model-value="authRequest"
              :disabled="isViewDetail"
              name="authRequest"
              type="number"
            >
              <div class="mr-3">
                <div class="d-flex align-center">
                  <div class="mr-3 conditon-input">
                    <CmTextField
                      :model-value="authRequest"
                      :field="field"
                      type="number"
                      style="width:7rem"
                      :disabled="isViewDetail"
                      :min="0"
                      @update:model-value="updateValue($event, 'authRequest')"
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
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol class="d-flex algin-center">
          <CmCheckBox
            v-model:model-value="isAutoLog"
            :disabled="isViewDetail"
            @update:model-value=" emit('update:isAutoLogModel', $event)"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('auto-log') }}
            </div>
          </CmCheckBox>
          <div
            v-if="isAutoLog"
            class="d-flex align-center"
          >
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="writeLogMinute"
                :disabled="isViewDetail"
                name="writeLogMinute"
                type="number"
              >
                <div class="mr-3">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        :model-value="writeLogMinute"
                        :field="field"
                        type="number"
                        style="width:7rem"
                        :disabled="isViewDetail"
                        :min="0"
                        @update:model-value="updateValue($event, 'writeLogMinute')"
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
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <div class="d-flex align-center">
            <CmCheckBox
              v-model:model-value="isAllowRetake"
              :disabled="isViewDetail"
              @change="allowRetakeChange"
            >
              <div class="d-flex align-center">
                <div class="ml-2 mr-4 text-medium-md">
                  {{ t('rework-is-allowed') }}
                </div>
              </div>
            </CmCheckBox>
            <div
              v-if="isAllowRetake"
              class="d-flex align-center"
            >
              <div class="mr-3">
                <Field
                  v-slot="{ field, errors }"
                  :model-value="numberOfRetake"
                  :disabled="isViewDetail"
                  name="numberOfRetake"
                  type="number"
                >
                  <div class="mr-3">
                    <div class="d-flex align-center">
                      <div class="mr-3 conditon-input">
                        <CmTextField
                          v-model="numberOfRetake"
                          :field="field"
                          type="number"
                          :disabled="isViewDetail"
                          :min="0"
                          :max="59"
                          @update:model-value="updateValue($event, 'numberOfRetake')"
                        />
                      </div>
                      <span class="text-regular-md">{{ t('turns').toLowerCase() }}</span>
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

          <div
            v-if="isAllowRetake"
            class="ml-9 mt-3 d-flex align-center"
          >
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="retakeResultType"
                :disabled="isViewDetail"
                name="retakeResultType"
                :type="1"
                :value="1"
                @update:model-value="updateValue($event, 'retakeResultType')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('get-high-results') }}</div>
            </div>
          </div>
          <div
            v-if="isAllowRetake"
            class="ml-9 mt-3 d-flex align-center"
          >
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="retakeResultType"
                :disabled="isViewDetail"
                name="retakeResultType"
                :type="1"
                :value="2"
                @update:model-value="updateValue($event, 'retakeResultType')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('get-the-final-result') }}</div>
            </div>
          </div>
          <div
            v-if="isAllowRetake"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              :model-value="isRequiredRetest"
              :disabled="isViewDetail"
              @update:model-value="updateValue($event, 'isRequiredRetest')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('required-retake') }}
              </div>
            </CmCheckBox>
          </div>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <CmCheckBox
            :model-value="isDisplayPoint"
            :disabled="isViewDetail"
            @update:model-value="updateValue($event, 'isDisplayPoint')"
          >
            <div class="ml-2 mr-4 text-medium-md">
              {{ t('show-point') }}
            </div>
          </CmCheckBox>
        </VCol>
      </VRow>

      <VRow
        class="d-flex align-center mr-4"
      >
        <VCol>
          <div class="text-semibold-md text-medium-md">
            {{ t('setting-review-test') }}
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <div class=" d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="reviewId"
                name="time"
                :type="1"
                :value="1"
                @update:model-value="updateValue($event, 'reviewId')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('no-review') }}</div>
            </div>
          </div>
          <div class="mt-3 d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="reviewId"
                name="time"
                :type="1"
                :value="2"
                @update:model-value="updateValue($event, 'reviewId')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('review-without-point') }}</div>
            </div>
          </div>
          <div class="mt-3 d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                :model-value="reviewId"
                name="time"
                :type="1"
                :value="3"
                @update:model-value="updateValue($event, 'reviewId')"
              />
            </div>
            <div class="d-flex align-center mr-4 text-medium-md">
              <div>{{ t('review-deitail-point') }}</div>
            </div>
          </div>
          <div
            v-if="reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              v-model:model-value="isCorrectAnswer"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'isCorrectAnswer')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-correct-option') }}
              </div>
            </CmCheckBox>
          </div>
          <div
            v-if="reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              v-model:model-value="isDisplayResult"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'isDisplayResult')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-true-false') }}
              </div>
            </CmCheckBox>
          </div>
          <div
            v-if="reviewId === 3"
            class="ml-9 mt-2 d-flex align-center"
          >
            <CmCheckBox
              v-model:model-value="isDisplayFalseAnswer"
              :disabled="isViewDetail"
              @change="changeReviewMode($event, 'isDisplayFalseAnswer')"
            >
              <div class="ml-2 text-medium-md">
                {{ t('show-false') }}
              </div>
            </CmCheckBox>
          </div>
        </VCol>
      </VRow>
    </Form>
  </div>
</template>
