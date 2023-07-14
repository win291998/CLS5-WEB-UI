<script setup lang="ts">
import { reactive } from 'vue'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import { validatorStore } from '@/stores/validatator'
import CmSelect from '@/components/common/CmSelect.vue'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CourseService from '@/api/course/index'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()

/** store */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate

const dataInput = reactive({
  date: null as null | string,
  contentId: null as null | string | number,
})
const courseId = route.params.id
const comboboxContent = ref([])
const disabled = ref(false)
const qrContent = reactive({
  courseContentId: null,
  dateRollCall: '',
  startDateRequire: '',
  endDateRequire: '',
  firstName: '',
  key: null,
  lastName: '',
  name: '',
  value: '',
})
const errorApi = reactive({
  location: '',
  message: '',
})
const isEdit = ref(false)
async function getComBoBoxContent() {
  const params = {
    courseId,
  }
  await window.requestApiCustom(ComboboxService.GetComboboxContentOffline, TYPE_REQUEST.GET, params).then((value: any) => {
    comboboxContent.value = value?.data
  })
}

// lấy nội dung điều kiện tham gia khóa học
async function fetchConditionAttend(id: number) {
  const params = { id }
  await window.requestApiCustom(CourseService.GetRequireParticipate, TYPE_REQUEST.GET, params).then((value: any) => {
    qrContent.startDateRequire = value.data.dateTimeStart
    qrContent.endDateRequire = value.data.dateTimeEnd
    if (
      (qrContent.startDateRequire && qrContent.endDateRequire)
    && ((new Date(`${dataInput.date}`) < new Date(qrContent.startDateRequire))
      || (new Date(`${dataInput.date}`) > new Date(qrContent.endDateRequire)))
    )
      dataInput.date = ''
  })
}
function changeCombobox(contentId: number) {
  getDataTable(contentId)
  if (contentId) {
    fetchConditionAttend(contentId)
  }
  else {
    qrContent.startDateRequire = ''
    qrContent.endDateRequire = ''
  }
}
function changeDateTime() {
  errorApi.location = ''
  errorApi.message = ''
}
async function getDataTable(contentId) {
  // const params = {
  //   id: this.$route.params.id,
  //   params: {
  //     contentId,
  //     RollCallId: this.edit ? this.$route.params.idAttendance : 0,
  //     sort: ['+name'],
  //   },
  // }
  // const res = await this.$store.dispatch(`${TEACHER_MODULE_STORE}/getListStudentOfAttendance`, params)
  // const data = res?.data
  // if (data) {
  //   data.pageLists.forEach((item, index) => {
  //     item.listIndex = index
  //     item.info = formatFullName(item.firstName, item.lastName)
  //   })
  //   this.rows = data.pageLists
  // }
}
</script>

<template>
  <div>
    <div class="text-medium-lg mb-6">
      {{ t('add-attendance') }}
    </div>
    <div>
      <VRow>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="dataInput.date"
            name="date"
            type="text"
          >
            <CmDateTimePicker
              :model-value="dataInput.date"
              :field="field"
              :errors="errors"
              :disabled="disabled"
              :min-date="qrContent.startDateRequire"
              :max-date="qrContent.endDateRequire"
              :text="`${t('date-attendance')}*`"
              :placeholder="t('date-attendance')"
              @update:modelValue="changeDateTime"
            />
            <div
              v-if="errors?.length > 0"
              class="styleError text-errors"
            >
              {{ errors[0] }}
            </div>
            <div
              v-if="errorApi.location === 'Date'"
              class="styleError text-errors"
            >
              {{ t(errorApi.message) }}
            </div>
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model:model-value="dataInput.contentId"
            name="costTypeId"
          >
            <CmSelect
              :model-value="dataInput.contentId"
              :field="field"
              :errors="errors"
              :disabled="disabled || isEdit"
              append-to-body
              :items="comboboxContent"
              item-value="key"
              custom-key="value"
              :text="t('name-content')"
              :placeholder="t('text-content')"
              class="mb-4"
              @open="getComBoBoxContent"
              @update:model-value="changeCombobox(Number(dataInput.contentId))"
            />
          </Field>
        </VCol>
      </VRow>
    </div>
  </div>
</template>
