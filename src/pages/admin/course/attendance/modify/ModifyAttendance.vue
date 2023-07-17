<script setup lang="ts">
import { reactive } from 'vue'
import moment from 'moment'
import CmDateTimePicker from '@/components/common/CmDateTimePicker.vue'
import { validatorStore } from '@/stores/validatator'
import CmSelect from '@/components/common/CmSelect.vue'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CourseService from '@/api/course/index'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmTable from '@/components/common/CmTable.vue'
import StringUtil from '@/utils/StringUtil'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CpMdQrCode from '@/components/page/Admin/course/modal/CpMdQrCode.vue'
import { load } from '@/stores/loadComponent.js'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const store = load()
const { unLoadComponent } = store

/** store */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate

const dataInput = reactive({
  date: null as null | string,
  startDateTime: null as null | string,
  endDateTime: null as null | string,
  contentId: null as null | string | number,
  qrCodeId: null as null | string | number,
  contentId: null as null | string | number,
})
const courseId = route.params.id
const comboboxContent = ref([])
const disabled = ref(false)
const qrContent = reactive({
  courseContentId: null as any,
  dateRollCall: '' as any,
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
const schema = computed(() => ({
  date: schemaOption.defaultString,
  contentId: schemaOption.defaultSelectSingle,
}))

// data table
const items = ref<any[]>([])
const totalRecord = ref(0)
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('user-name'), value: 'fullname', type: 'custom' },
  { text: t('checkin'), value: 'checkin', type: 'custom', header: 'custom' },
  { text: t('vacation'), value: 'askPermission', type: 'custom' },
  { text: '', value: 'actions', width: 150, type: 'custom' },
])
const queryParams = ref<any>({
  sort: [],
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const searchField = ref('info')
const searchValue = ref()
const myFormAddAttendance = ref()
function selectedRows(e: any) {
  data.selectedRowsIds = e
}

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

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value
  searchValue.value = value

  // await getListAttendance()
}
async function handlePageClick(page: any) {
  queryParams.value.pageNumber = page

  // await getListAttendance()
}
async function getDataTable(contentId?: any) {
  const params = {
    contentId,
    RollCallId: isEdit ? route.params.idAttendance : 0,
    sort: ['+name'],
  }
  await window.requestApiCustom(CourseService.GetListCheckinStudentCourse(`${courseId}`), TYPE_REQUEST.GET, params).then((value: any) => {
    value.data.pageLists.forEach((item: any) => {
      item.info = StringUtil.formatFullName(item.firstName, item.lastName)
    })
    items.value = value.data.pageLists
  })
}
async function getInforOfAttendance(idAttendance) {
  const params = {
    id: courseId,
    idAttendance,
  }

  // const res = await this.$store.dispatch(`${TEACHER_MODULE_STORE}/getInforOfAttendance`, params)
  // const data = res?.data.data
  // if (data) {
  //   this.dataInput.contentId = 0
  //   this.dataInput.contentId = data.contentId
  //   this.dataInput.date = data.date
  //   this.dataInput.startDateTime = data.startDateTime
  //   this.dataInput.endDateTime = data.endDateTime
  //   this.dataInput.qrCodeId = data.qrCodeId
  // }
}

/** computed */
const isCheckinAll = computed(() => {
  return !items.value.find((item: any) => !item.checkin) && items.value.length > 0
})

const indeterminateCheckin = computed(() => {
  const checkedRows = items.value.filter((item: any) => item.checkin)
  return checkedRows.length > 0 && checkedRows.length !== items.value.length
})

function checkinAll(val: any) {
  console.log(val)

  const cloneRows = JSON.parse(JSON.stringify(items.value))
  if (indeterminateCheckin.value) {
    cloneRows.forEach((item: any) => item.checkin = true)
    items.value = cloneRows
    return
  }
  cloneRows.forEach((item: any) => {
    item.checkin = val
    item.askPermission = false
  })
  items.value = cloneRows
}
function onCheckinChange(val: any, index: any) {
  console.log(index)

  const changedElement = items.value[index]
  const cloneRow: any = JSON.parse(JSON.stringify(changedElement))
  cloneRow.checkin = val
  cloneRow.askPermission = val ? false : cloneRow.askPermission
  items.value.splice(index, 1, cloneRow)
}
function onAskPermissonChange(event: any, index: any) {
  let permissonChange: any = items.value[index]
  permissonChange = JSON.parse(JSON.stringify(permissonChange))
  permissonChange.askPermission = event
  items.value.splice(index, 1, permissonChange)
}
function handleCancle() {
  router.push({ name: 'course-attendance', params: { id: Number(route.params.id) } })
}
async function handleAttendance(idx: any) {
  await myFormAddAttendance.value.validate().then((success: any) => {
    console.log(success)
    if (success.valid) {
      const checkinList = ref<any[]>([])
      items.value.forEach((item: any) => {
        checkinList.value.push({
          userId: item.id,
          checkin: item.checkin,
          askPermission: item.askPermission,
        })
      })
      const params = {
        id: route.params.id,
        params: {
          id: isEdit ? route.params.idAttendance : null,
          date: dataInput.date,
          contentId: dataInput.contentId,
          startDateTime: dataInput.startDateTime === '0001-01-01T00:00:00' ? null : dataInput.startDateTime,
          endDateTime: dataInput.endDateTime === '0001-01-01T00:00:00' ? null : dataInput.endDateTime,
          qrCodeId: dataInput.qrCodeId,
          checkinList: checkinList.value,
        },
      }
      console.log(params)
    }
    unLoadComponent(idx)
  })
}
function qrUpdate(value: any) {
  console.log(value)
  dataInput.startDateTime = value.startDateTime
  dataInput.endDateTime = value.endDateTime
  dataInput.qrCodeId = value.id
}
const isShowMdQrCode = ref(false)
function viewQr(contentId: number) {
  const { firstName, lastName }: any = window.userData

  const content: any = comboboxContent.value.find((item: any) => item.key === contentId)
  if (content)
    qrContent.name = content.value

  qrContent.firstName = firstName
  qrContent.lastName = lastName
  qrContent.courseContentId = dataInput.contentId
  qrContent.dateRollCall = dataInput.date
  isShowMdQrCode.value = true
}

if (route.name === 'attendance-view')
  disabled.value = true

if (Number(route.params.idAttendance) >= 0) {
  isEdit.value = true
  getDataTable(dataInput.contentId)
  getInforOfAttendance(route.params.idAttendance)
}
else {
  dataInput.date = moment().locale('vi').format('YYYY-MM-DD HH:mm')
  getDataTable()
}
</script>

<template>
  <div>
    <div class="text-medium-lg mb-6">
      {{ t('add-attendance') }}
    </div>
    <div>
      <Form
        ref="myFormAddAttendance"
        :validation-schema="schema"
      >
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
                :key="qrContent.startDateRequire + qrContent.endDateRequire"
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
              name="contentId"
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
      </Form>
    </div>
    <div>
      <CpHeaderAction
        is-add
        :is-fillter="false"
        :add-button-name="t('QrCode')"
        :disabled-add="!dataInput.contentId || !dataInput.date"
        @add-handler="viewQr(dataInput.contentId) "
        @update:keyword="handleSearch"
      />
    </div>
    <div class="mb-6">
      <CmTable
        v-model:pageSize="queryParams.pageSize"
        v-model:page-number="queryParams.pageNumber"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        is-local-table
        :search-field="searchField"
        :search-value="searchValue"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
      >
        <template #headerItem="{ col, context }">
          <div v-if="col === 'checkin'">
            <CmCheckBox
              v-model="isCheckinAll"
              color="primary"
              :indeterminate="indeterminateCheckin"
              :label="context.text"
              ripple
              :class-name="{ indeterminate: indeterminateCheckin }"
              @update:modelValue="checkinAll"
            />
          </div>
        </template>
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
          <div v-if="col === 'checkin'">
            <CmCheckBox
              v-model="context.checkin"
              color="primary"
              :label="context.text"
              ripple
              @update:modelValue="onCheckinChange($event, context.originIndex)"
            />
          </div>
          <div v-if="col === 'askPermission'">
            <CmCheckBox
              v-model="context.askPermission"
              color="primary"
              :label="context.text"
              ripple
              :disabled="context.checkin || disabled"
              @update:modelValue="onAskPermissonChange($event, context.originIndex)"
            />
          </div>
        </template>
      </CmTable>
    </div>
    <div>
      <CpActionFooterEdit
        is-cancel
        is-save
        :title-cancel="t('come-back')"
        :title-save="t('save')"
        @on-save="(idx: any) => handleAttendance(idx)"
        @on-cancel="handleCancle"
      />
    </div>
    <CpMdQrCode
      v-model:isShowModal="isShowMdQrCode"
      :content="qrContent"
      @update="qrUpdate"
    />
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
.indeterminate {
    color: #{$color-checkbox-indeterminate} !important;
    opacity: 1 !important;
  }
</style>
