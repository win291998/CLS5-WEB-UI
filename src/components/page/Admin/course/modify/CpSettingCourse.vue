<script setup lang="ts">
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { validatorStore } from '@/stores/validatator'
import constant from '@/constant/constant'
import { load } from '@/stores/loadComponent.js'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CmRadio from '@/components/common/CmRadio.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** store */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const store = load()
const { unLoadComponent } = store
const settingData = reactive({
  courseStartDate: '',
  courseEndDate: '',
  registrationStartDate: '',
  registrationEndDate: '',
  isReviewExpired: false,
  isDisplayHome: false,
  certificationTemplateId: null,
  certificationDurationMonth: null,
  ratingScaleId: null,
  displayId: null,
  numberOfRemindDay: null,
  timesOfRemind: null,
  timeSpanByMinute: null,
  studyTimeType: 1,
  studyTime: null,
  point: null,
  formOfRegistration: 1,
  studyMode: 1,
})
const optionData = reactive({
  isRegisterTime: false,
  isTimeAttend: false,
  isCertification: false,
  isRatingScale: false,
  isRemind: false,
  isAmountRemind: false,
  isTimeLearning: false,
  experiencePoint: false,
})

const schema = computed(() => ({
  ...(optionData.isRegisterTime ? { isStartTime: schemaOption.defaultString, isEndTime: schemaOption.defaultString } : {}),
  ...(optionData.isTimeAttend ? { courseStartDate: schemaOption.defaultString, courseEndDate: schemaOption.defaultString } : {}),
}))
const comboboxCertificate = ref([])
const comboboxRatingScale = ref([])
const displayHomeOption = ref([
  { key: 1, value: t('public') },
  { key: 2, value: t('internal') },
  { key: 3, value: t('by-org') },
])

/** *******method-******* */
// danh sách chứng nhận
function getComboboxCertificate() {
  if (window._.isEmpty(comboboxCertificate.value)) {
    const params = { type: 1 }
    window.requestApiCustom(ComboboxService.GetComboboxCertificate, TYPE_REQUEST.GET, params).then((value: any) => {
      comboboxCertificate.value = value?.data || []
    })
  }
}

// danh sách thang đánh giá
async function getComboboxRatingScale() {
  if (window._.isEmpty(comboboxRatingScale.value)) {
    window.requestApiCustom(ComboboxService.GetComboboxRatingScale, TYPE_REQUEST.GET).then((value: any) => {
      comboboxRatingScale.value = value?.data || []
    })
  }
}

/** *************main */
const myFormSettingCourse = ref()
async function saveSetting(idx: number) {
  await myFormSettingCourse.value.validate().then((successSetting: any) => {
    console.log(successSetting)

    if (successSetting.valid) {
      console.log(idx)

      unLoadComponent(idx)
    }
    else { unLoadComponent(idx) }
  })
}
function handleCancle() {
  router.push({ name: 'course' })
}
</script>

<template>
  <div class="setting-course mt-7">
    <Form
      ref="myFormSettingCourse"
      :validation-schema="schema"
    >
      <!-- Cài đặt thiết lập -->
      <VRow>
        <VCol>
          <div class="text-semibold-md color-text-900">
            {{ t('setting-register') }}
          </div>
        </VCol>
      </VRow>
      <!-- Thời gian đăng ký -->
      <VRow :class="{ 'pb-2': !optionData.isRegisterTime }">
        <VCol>
          <CmCheckBox
            v-model:model-value="optionData.isRegisterTime"
            :label="t('time-register')"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isRegisterTime"
        class="ml-4 pb-2"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="settingData.registrationStartDate"
            name="isStartTime"
            type="text"
          >
            <CmDateTimePicker
              :model-value="settingData.registrationStartDate"
              :max-date="settingData.registrationEndDate"
              :field="field"
              :errors="errors"
              :text="`${t('start-day')}*`"
              :placeholder="t('start-day')"
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
            :model-value="settingData.registrationEndDate"
            name="isEndTime"
            type="text"
          >
            <CmDateTimePicker
              v-model="settingData.registrationEndDate"
              :min-date="settingData.registrationStartDate"
              :field="field"
              :errors="errors"
              :text="`${t('to-day')}*`"
              :placeholder="t('to-day')"
            />
          </Field>
        </VCol>
      </VRow>
      <!-- Thời gian diễn ra khóa học -->
      <VRow :class="{ 'pb-2': !optionData.isTimeAttend }">
        <VCol>
          <CmCheckBox
            v-model:model-value="optionData.isTimeAttend"
            :label="t('time-register')"
          />
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isTimeAttend"
        class="ml-4 pb-2"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            :model-value="settingData.courseStartDate"
            name="courseStartDate"
            type="text"
          >
            <CmDateTimePicker
              v-model="settingData.courseStartDate"
              :max-date="settingData.courseEndDate"
              :field="field"
              :errors="errors"
              :text="`${t('start-day')}*`"
              :placeholder="t('start-day')"
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
            :model-value="settingData.courseEndDate"
            name="courseEndDate"
            type="text"
          >
            <CmDateTimePicker
              v-model="settingData.courseEndDate"
              :min-date="settingData.courseStartDate"
              :field="field"
              :errors="errors"
              :text="`${t('to-day')}*`"
              :placeholder="t('to-day')"
            />
          </Field>
        </VCol>
      </VRow>
      <!-- Không cho phép học viên xem lại khóa học khi hết hạn -->
      <VRow class="pb-2">
        <VCol>
          <CmCheckBox
            v-model:model-value="settingData.isReviewExpired"
            :label="t('no-preview')"
          />
        </VCol>
      </VRow>
      <!-- Thời gian học -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <div class="d-flex">
            <CmCheckBox
              v-model:model-value="optionData.isTimeLearning"
              :label="t('learning-time')"
            />
            <div
              v-if="optionData.isTimeLearning"
              class="ml-4"
            >
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.studyTime"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.studyTime"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('day') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
                    class="styleError text-errors"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isTimeLearning"
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyTimeType"
                :type="1"
                name="studyTimeType"
                :value="1"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('from-student-start') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isTimeLearning"
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyTimeType"
                :type="1"
                name="studyTimeType"
                :value="2"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('from-course-release') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        v-if="optionData.isTimeLearning"
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyTimeType"
                :type="1"
                name="studyTimeType"
                :value="3"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('from-register') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Nhắc nhở trước khi hết hạn -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <div class="d-flex">
            <CmCheckBox
              v-model:model-value="optionData.isRemind"
              :label="t('remind-before-expiration')"
            />
            <div class="ml-4">
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.numberOfRemindDay"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.numberOfRemindDay"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('day') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
                    class="styleError text-errors"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-7"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex">
            <CmCheckBox
              v-model:model-value="optionData.isAmountRemind"
              :label="t('times-remind')"
            />
            <div class="ml-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.timesOfRemind"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div>
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.timesOfRemind"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('minutes') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
                    class="styleError text-errors"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </Field>
            </div>
            <div class="ml-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.timeSpanByMinute"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div>
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.timeSpanByMinute"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('separate') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
                    class="styleError text-errors"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Cấp chứng nhận -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <CmCheckBox
            v-model:model-value="optionData.isCertification"
            :label="t('certifications')"
          />
        </VCol>
      </VRow>
      <VRow class="ml-8">
        <div class="mbn-2">
          {{ t('certification-template') }}
        </div>
      </VRow>
      <VRow
        class="ml-7"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
          class="mln-2"
        >
          <CmSelect
            v-model="settingData.certificationTemplateId"
            :items="comboboxCertificate"
            item-value="key"
            custom-key="value"
            :placeholder="t('choose-template-cert')"
            @open="getComboboxCertificate"
          />
        </VCol>
        <VCol
          cols="12"
          md="8"
          sm="6"
          class="d-flex align-center"
        >
          <div class="mr-4 d-flex align-center">
            {{ t('time-use') }}
          </div>
          <div>
            <div class="mr-3">
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.certificationDurationMonth"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.certificationDurationMonth"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('month') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
                    class="styleError text-errors"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Thang đánh giá -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <CmCheckBox
            v-model:model-value="optionData.isRatingScale"
            :label="t('rating-scale')"
          />
        </VCol>
      </VRow>
      <VRow class="ml-8">
        <div class="mbn-2">
          {{ t('rating-scale') }}
        </div>
      </VRow>
      <VRow
        class="ml-7"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
          class="mln-2"
        >
          <CmSelect
            v-model="settingData.ratingScaleId"
            :items="comboboxRatingScale"
            item-value="key"
            custom-key="value"
            :placeholder="t('choose-rating-scale')"
            @open="getComboboxRatingScale"
          />
        </VCol>
      </VRow>
      <!-- Hiển thị trang chủ -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <CmCheckBox
            v-model:model-value="settingData.isDisplayHome"
            :label="t('is-display-home')"
          />
        </VCol>
      </VRow>
      <VRow class="ml-8">
        <div class="mbn-2">
          {{ t('type-display') }}
        </div>
      </VRow>
      <VRow
        class="ml-7"
      >
        <VCol
          cols="12"
          md="4"
          sm="6"
          class="mln-2"
        >
          <CmSelect
            v-model="settingData.displayId"
            :items="displayHomeOption"
            item-value="key"
            custom-key="value"
            :placeholder="t('choose-type-display')"
          />
        </VCol>
      </VRow>
      <!-- Tính điểm kinh nghiệm theo thời gian học -->
      <VRow class="pb-2">
        <VCol class="p-0">
          <div class="d-flex">
            <CmCheckBox
              v-model:model-value="optionData.experiencePoint"
              :label="t('calculating-experience-points')"
            />
            <div class="ml-4">
              <Field
                v-slot="{ field, errors }"
                :model-value="settingData.point"
                name="totalQuestionDisplayInPage"
                type="number"
              >
                <div class="mr-6">
                  <div class="d-flex align-center">
                    <div class="mr-3 conditon-input">
                      <CmTextField
                        v-model="settingData.point"
                        :field="field"
                        type="number"
                        :min="constant.MIN_NUMBER"
                        :max="constant.MAX_NUMBER"
                        :maxlength="constant.MAX_NUMBER.toString().length"
                        counter
                      />
                    </div>
                    <span class="text-regular-md text-lowercase">{{ t('point') }} / {{ t('minutes') }}</span>
                  </div>
                  <div
                    v-if="errors[0]"
                    class="styleError text-errors"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </Field>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Hình thức học viên đăng kí tham gia khóa học -->
      <VRow class="pb-2">
        <VCol>
          <div class="text-semibold-md color-text-900">
            {{ t('register-form') }}
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.formOfRegistration"
                :type="1"
                name="formOfRegistration"
                :value="1"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('from-student-start') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.formOfRegistration"
                :type="1"
                name="formOfRegistration"
                :value="2"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('registration-requires-moderation') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.formOfRegistration"
                :type="1"
                name="formOfRegistration"
                :value="3"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('not-allow-register') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <!-- Hình thức học viên đăng kí tham gia khóa học -->
      <VRow class="pb-2">
        <VCol>
          <div class="text-semibold-md color-text-900">
            {{ t('study-mode') }}
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyMode"
                :type="1"
                name="studyMode"
                :value="1"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('study-out-of-order') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyMode"
                :type="1"
                name="studyMode"
                :value="2"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('learn-by-order') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow
        class="ml-1"
      >
        <VCol
          cols="12"
          class="mln-2"
        >
          <div class="d-flex align-center">
            <div class="d-flex align-center mr-4">
              <CmRadio
                v-model="settingData.studyMode"
                :type="1"
                name="studyMode"
                :value="3"
              />
            </div>
            <div class="d-flex align-center mr-4">
              <div>{{ t('conditional-study') }}</div>
            </div>
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <CpActionFooterEdit
            is-cancel
            is-save
            :title-cancel="t('cancel-title')"
            :title-save="t('save')"
            @on-save="saveSetting"
            @on-cancel="handleCancle"
          />
        </VCol>
      </VRow>
    </Form>
  </div>
</template>

<style lang="scss">
.conditon-input{
  min-width: 100px;
}
</style>
