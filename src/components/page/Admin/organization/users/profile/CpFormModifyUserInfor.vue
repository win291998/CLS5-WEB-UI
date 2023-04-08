<script setup lang="ts">
import { ref } from 'vue'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'
import { userManagerStore } from '@/stores/admin/users/user'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { load } from '@/stores/loadComponent'
import toast from '@/plugins/toast'

/**
 * emit
 */
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'tabAction', position: number, status: any): void
}
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpTitleTable = defineAsyncComponent(() => import('./CpTitleTable.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CmRadioGroup = defineAsyncComponent(() => import('@/components/common/CmRadioGroup.vue'))
const CpUserProfileAvatarEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpUserProfileAvatarEdit.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const storeCombobox = comboboxStore()
const storeUserManager = userManagerStore()
const storeButton = load()
const { unLoadComponent } = storeButton
const { idUser } = storeToRefs(storeUserManager)
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { userType, statuses } = storeToRefs(storeCombobox)
const { fetchTypeUsersCombobox, fetchStatusUsersCombobox } = storeCombobox
const router = useRouter()
const route = useRoute()

// interface
// params main

// data
const LABEL = Object.freeze({
  TEXT_USER_TYPE: `${t('users.user.filters.user-role')}*`,
  PLACEHOLDER_USER_TYPE: t('users.user.filters.user-role'),
  TEXT_STATUS: `${t('common.status-name')}*`,
  PLACEHOLDER_STATUS: t('common.status-name'),
})

const titleTable = ref()
const isShowButton = ref(true)

// method
const handleFormValue = (value: any) => {
  console.log(value)
}

const backUser = () => {
  router.push({ name: 'admin-organization-users-manager' })
}

/**
 *
 * Lấy dữ liệu compobox
 */
const optionSex = ref([
  { label: 'nam', value: false },
  { label: 'nữ', value: true },
])

if (window._.isEmpty(statuses.value))
  fetchStatusUsersCombobox()
if (window._.isEmpty(userType.value))
  fetchTypeUsersCombobox()

const isOwner = computed(() => {
  // const token = useJwt.getToken()
  // if (!token)
  //   return true
  // const permission = parseJwt(token)
  // if (Number(permission?.OwnerId) === Number(this.$route.params.id))
  //   return true

  return false
})

const getErrorsMessage = (errors: Array<any>) => {
  let str = ''
  errors.forEach(element => {
    str += `${t(element.message, element.params)}`
    str += '. '
  })

  return str
}

/**
 * Xử lý data form
 *
 */
let schema = reactive<any>({
  lastName: schemaOption.lastName,
  firstName: schemaOption.firstName,
  email: schemaOption.email,
  userName: schemaOption.userName,
  userCode: schemaOption.userCode,
  phoneNumber: schemaOption.phoneNumber,
  kpiLearn: schemaOption.kpiLearn,
  kpiTeach: schemaOption.kpiTeach,
  userTypeIdSingle: schemaOption.userTypeIdSingle,
  statusIdSingle: schemaOption.statusIdSingle,
})

const schemaPass = reactive <any> ({
  password: schemaOption?.password,
})

if (!Number(route.params.id))
  schema = { ...schema, ...schemaPass }

const { handleSubmit, validate, errors, submitForm, resetForm } = useForm({
  validationSchema: schema,
})

const { values, setValues } = useForm({
  validationSchema: schema,
  initialValues: reactive({
    academicDegreeId: null,
    academicRankId: null,
    address: '',
    avatar: '',
    birthDay: null,
    email: '',
    employmentDate: '',
    firstName: '',
    gender: true,
    lastName: '',
    levelId: null,
    listEducationUser: null,
    listExperienceUser: null,
    listGroupId: null,
    listOrganizationalStructureId: null,
    passport: '',
    password: '',
    payrollScaleId: null,
    phoneNumber: '',
    position: '',
    statusId: null,
    story: '',
    timeZoneId: null,
    userCode: '',
    userName: '',
    userTitleId: null,
    userTypeId: null,
    wardId: null,
    districtId: null,
    provinceId: null,
    workplace: '',
    listBranchId: null,
    countryId: null,
    kpiLearn: null,
    kpiTeach: null,
    userGroups: [],
    userBranches: [],
  }),
})

/**
 *
 * Lấy dữ liệu edit
 */
const getAutoCode = async () => {
  await MethodsUtil.requestApiCustom(ApiUser.getAutoCode, TYPE_REQUEST.GET).then(value => {
    values.userCode = value?.data?.data
  })
}

// lấy mã người dùng tự động
if (route.name === 'admin-organization-users-profile-add')
  getAutoCode()

// lấy thông tin học viên

const fectchLecturers = async (id: any) => {
  const params = { userId: id }

  await MethodsUtil.requestApiCustom(ApiUser.fetchDetailUpdate, TYPE_REQUEST.GET, params).then(value => {
    setValues(value.data)
    Promise.resolve().then(() => {
      console.log(titleTable)

      titleTable.value?.checkGetListOrgStruct()
    })
  })
}

const idUpdate = ref<null | number>(null)

if (Number(route.params.id) >= 0) {
  console.log(route.params.id)

  fectchLecturers(route.params.id)
  idUpdate.value = Number(route.params.id)
  emit('tabAction', 3, false)
}

/**
 * create users
 *
 */
const myForm = ref(null)

const resetData = () => {
  isShowButton.value = true

  router.push({ name: 'admin-organization-users-profile-edit', params: { tabActive: 'infor', id: route?.params?.id } })

  idUpdate.value = null
  resetForm()
  idUser.value = null
  getAutoCode()
}

const handlesCreateUser = async (bvModalEvt: any, dataObj: any, type: any) => {
  console.log(titleTable)

  const form: any = myForm.value
  if (form) {
    form.validate().then(async (success: any) => {
      console.log(success)

      if (success.valid) {
        const params = dataObj

        await MethodsUtil.requestApiCustom(ApiUser.fetchCreateUser, TYPE_REQUEST.POST, params)
          .then(value => {
            console.log(value)
            if (titleTable.value?.isChange)
              titleTable.value.updateTitle(value.data)
            toast('SUCCESS', t(value.message))

            if (type === 'save') {
              router.push({ name: 'admin-organization-users-manager' })

              return
            }
            if (type === 'save-add')
              resetData()

            idUser.value = value.data

            emit('tabAction', 3, false)
            fectchLecturers(value.data)
            idUpdate.value = value.data

            router.push({ name: 'admin-organization-users-profile-edit', params: { tabActive: 'infor', id: idUser.value } })
          })
          .catch(error => {
            toast('ERROR', t(getErrorsMessage(error)))
          })
      }
    })
  }
}

/**
 * update users
 *
 */
const handleUpdateUser = async (bvModalEvt, dataObj, type) => {
  const form: any = myForm.value

  form.validate().then(async (success: any) => {
    if (success) {
      const params = dataObj

      await MethodsUtil.requestApiCustom(ApiUser.fetchUpdateUser, TYPE_REQUEST.POST, params)
        .then(value => {
          console.log(value)

          if (titleTable.value?.isChange) {
            console.log(titleTable.value?.isChange)
            titleTable.value.updateTitle()
          }
          toast('SUCCESS', t(value.message))
          if (type === 'save') {
            router.push({ name: 'admin-organization-users-manager' })

            return
          }
          if (type === 'save-add')
            resetData()
        })
    }
  })
}

const handleUser = (bvModalEvt: any, dataObj: any, type: any) => {
  dataObj.firstName = dataObj?.firstName.trim()
  dataObj.lastName = dataObj?.lastName.trim()
  dataObj.userName = dataObj?.userName.trim()
  console.log(dataObj)

  if (idUpdate.value === null)
    handlesCreateUser(bvModalEvt, dataObj, type)

  else
    handleUpdateUser(bvModalEvt, dataObj, type)
}
</script>

<template>
  <Form
    ref="myForm"
    :validation-schema="schema"
    @submit.prevent="submitForm"
  >
    <VSheet
      width="100%"
      class="user-infor mx-auto no-background"
    >
      <div>
        User profile
      </div>

      <VRow class="my-3">
        <VCol
          cols="12"
          md="2"
        >
          <CpUserProfileAvatarEdit
            v-model:src="values.avatar"
            :tooltip="t('system-management.100x100')"
          />
        </VCol>
        <VCol
          cols="12"
          md="10"
          class="d-flex align-center"
        >
          <CmRadioGroup
            v-model="values.gender"
            :label="t('common.gender')"
            :option="optionSex"
          />
        </VCol>
      </VRow>
      <VRow class="mb-5">
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.lastName"
            name="lastName"
            type="text"
            :rules="schema.lastName"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.surname')}*`"
              :placeholder="t('users.add-user.enter-surname')"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.firstName"
            name="firstName"
            type="text"
            :rules="schema.firstName"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.name')}*`"
              :placeholder="t('users.add-user.enter-last-name')"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.email"
            name="email"
            type="text"
            :rules="schema.email"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.email')}*`"
              :placeholder="t('users.add-user.enter-email')"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.userName"
            name="userName"
            type="text"
            :rules="schema.userName"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.sign-name')}*`"
              :placeholder="t('users.add-user.enter-sign-name')"
              @change="handleFormValue"
            />
          </Field>
        </VCol>

        <VCol
          v-if="!idUpdate"
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.password"
            name="password"
            type="password"
            :rules="schema.password"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              type="password"
              :text="`${t('common.password')}*`"
              :placeholder="t('users.add-user.enter-password')"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.userCode"
            name="userCode"
            type="text"
            :rules="schema.userCode"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.employee-code')}*`"
              :placeholder="$t('users.add-user.enter-employee-code')"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.phoneNumber"
            name="phoneNumber"
            type="number"
            :rules="schema.phoneNumber"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.phone-number')}`"
              :placeholder="$t('common.phone-number')"
              type="number"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.userTypeId"
            name="userTypeIdSingle"
            :rules="schema.userTypeIdSingle"
          >
            <CmSelect
              :field="field"
              :model-value="values.userTypeId"
              :text="LABEL.TEXT_USER_TYPE"
              :placeholder="LABEL.PLACEHOLDER_USER_TYPE"
              :items="userType"
              :errors="errors"
              :disabled="isOwner"
              item-value="id"
              custom-key="userTypeName"
              @update:model-value="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.statusId"
            name="statusIdSingle"
            :rules="schema.statusIdSingle"
          >
            <CmSelect
              :field="field"
              :model-value="values.statusId"
              :text="LABEL.TEXT_STATUS"
              :placeholder="LABEL.PLACEHOLDER_STATUS"
              :items="statuses"
              :errors="errors"
              item-value="key"
              custom-key="value"
              @update:model-value="handleFormValue"
            />
          </Field>
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.kpiLearn"
            name="kpiLearn"
            type="number"
            :rules="schema.kpiLearn"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.kpi-learning')}`"
              :placeholder="$t('common.kpi-learning')"
              type="number"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="values.kpiTeach"
            name="kpiTeach"
            type="number"
            :rules="schema.kpiTeach"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :text="`${t('common.kpi-teaching')}`"
              :placeholder="$t('common.kpi-teaching')"
              type="number"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
      </VRow>

      <VDivider class="mb-5" />
    </VSheet>
    <VSheet
      width="100%"
      class="user-infor mx-auto no-background"
    >
      <CpTitleTable
        ref="titleTable"
        :user-id="route.params.id"
      />
    </VSheet>
    <VSheet
      width="100%"
      class="user-infor mx-auto no-background my-5"
    >
      <CpActionFooterEdit
        :is-save="isShowButton"
        @onCancel="backUser"
        @onSave="handleUser($event, values, 'save')"
      />
    </VSheet>
  </Form>
</template>

<style scoped lang="scss">
@use "/src/styles/style-global" as *;
</style>
