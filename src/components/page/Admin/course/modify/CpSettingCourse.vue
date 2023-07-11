<script setup lang="ts">
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmDateTimePicker = defineAsyncComponent(() => import('@/components/common/CmDateTimePicker.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

/** LIB */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()

const settingData = reactive({
  registrationStartDate: '',
  registrationEndDate: '',
  isReviewExpired: false,
  certificationTemplateId: null,
})
const optionData = reactive({
  isRegisterTime: false,
  isTimeAttend: false,
  isCertification: false,
})
const comboboxCertificate = ref([])

/** *******method-******* */
function getComboboxCertificate() {
  const params = { type: 1 }
  window.requestApiCustom(ComboboxService.GetComboboxCertificate, TYPE_REQUEST.GET, params).then((value: any) => {
    comboboxCertificate.value = value?.data || []
  })
}

/** *************main */
getComboboxCertificate()
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
      <VCol>
        <CmCheckBox
          v-model:model-value="optionData.isCertification"
          :label="t('certifications')"
        />
      </VCol>
    </VRow>
    <VRow
      class="ml-8"
    >
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <CmSelect
          :model-value="settingData.certificationTemplateId"
          :items="comboboxCertificate"
          item-value="key"
          custom-key="value"
          :text="t('certification-template')"
          :placeholder="t('choose-template-cert')"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <div class="d-flex align-center">
          <div>
            {{ t('time-use') }}
          </div>
        </div>
      </VCol>
    </VRow>
  </div>
</template>
