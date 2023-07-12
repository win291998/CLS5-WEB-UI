<script setup lang="ts">
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { validatorStore } from '@/stores/validatator'
import constant from '@/constant/constant'

const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

/** store */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate

const settingData = reactive({
  registrationStartDate: '',
  registrationEndDate: '',
  isReviewExpired: false,
  isDisplayHome: false,
  certificationTemplateId: null,
  certificationDurationMonth: null,
  ratingScaleId: null,
  displayId: null,
})
const optionData = reactive({
  isRegisterTime: false,
  isTimeAttend: false,
  isCertification: false,
  isRatingScale: false,
})
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
</script>

<template>
  <div class="setting-course mt-7">
    <!-- Thời gian đăng ký -->
    <VRow>
      <VCol>
        <div class="text-semibold-md color-text-900 mb-4 ">
          {{ t('setting-register') }}
        </div>
        <CmCheckBox
          v-model:model-value="optionData.isRegisterTime"
          :label="t('time-register')"
        />
      </VCol>
    </VRow>
    <VRow
      v-if="optionData.isRegisterTime"
      class="ml-8 mb-1"
    >
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <CmDateTimePicker
          v-model="settingData.registrationStartDate"
          :text="`${t('start-day')}*`"
          :placeholder="t('start-day')"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <CmDateTimePicker
          v-model="settingData.registrationEndDate"
          :text="`${t('to-day')}*`"
          :placeholder="t('to-day')"
        />
      </VCol>
    </VRow>
    <!-- Thời gian diễn ra khóa học -->
    <VRow>
      <VCol>
        <CmCheckBox
          v-model:model-value="optionData.isTimeAttend"
          :label="t('time-register')"
        />
      </VCol>
    </VRow>
    <VRow
      v-if="optionData.isTimeAttend"
      class="ml-8"
    >
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <CmDateTimePicker
          v-model="settingData.registrationStartDate"
          :text="`${t('start-day')}*`"
          :placeholder="t('start-day')"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <CmDateTimePicker
          v-model="settingData.registrationEndDate"
          :text="`${t('to-day')}*`"
          :placeholder="t('to-day')"
        />
      </VCol>
    </VRow>
    <!-- Không cho phép học viên xem lại khóa học khi hết hạn -->
    <VRow>
      <VCol>
        <CmCheckBox
          v-model:model-value="settingData.isReviewExpired"
          :label="t('no-preview')"
        />
      </VCol>
    </VRow>
    <!-- Cấp chứng nhận -->
    <VRow>
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
    <VRow>
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
    <!-- Thang đánh giá -->
    <VRow>
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
  </div>
</template>

<style lang="scss">
.conditon-input{
  min-width: 100px;
}
</style>
