<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'

const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CpTitleTable = defineAsyncComponent(() => import('./CpTitleTable.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const storeCombobox = comboboxStore()
const { schema, Field, Form } = storeValidate
const { userType, statuses } = storeToRefs(storeCombobox)
const { fetchTypeUsersCombobox, fetchStatusUsersCombobox } = storeCombobox

// interface
// params main

// data
const data = reactive({
  lastName: '',
  firstName: '',
  email: '',
  userName: '',
  password: '',
  userCode: '',
  phoneNumber: '',
  kpiLearn: '',
  kpiTeach: '',
  userTypeId: null,
  statusId: null,
})

const LABEL = Object.freeze({
  TEXT_USER_TYPE: t('users.user.filters.user-role'),
  PLACEHOLDER_USER_TYPE: t('users.user.filters.user-role'),
  TEXT_STATUS: t('common.status-name'),
  PLACEHOLDER_STATUS: t('common.status-name'),
})

// method
const handleFormValue = (value: any) => {
  console.log(value)
}

// event
if (window._.isEmpty(statuses.value))
  fetchStatusUsersCombobox()
if (window._.isEmpty(userType.value))
  fetchTypeUsersCombobox()
</script>

<template>
  <VSheet
    width="100%"
    class="user-infor mx-auto no-background"
  >
    <Form>
      <VRow class="mb-5">
        <VCol
          cols="12"
          md="4"
        >
          <Field
            v-slot="{ field, errors }"
            name="lastName"
            type="text"
            :rules="schema.fields.lastName"
          >
            <CmTextField
              v-model="data.lastName"
              v-bind="field"
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
            name="name"
            type="text"
            :rules="schema.fields.firstName"
          >
            <CmTextField
              v-model="data.firstName"
              v-bind="field"
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
            name="email"
            type="text"
            :rules="schema.fields.email"
          >
            <CmTextField
              v-model="data.email"
              v-bind="field"
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
            name="userName"
            type="text"
            :rules="schema.fields.userName"
          >
            <CmTextField
              v-model="data.userName"
              v-bind="field"
              :errors="errors"
              :text="`${t('common.sign-name')}*`"
              :placeholder="t('users.add-user.enter-sign-name')"
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
            name="password"
            type="password"
            :rules="schema.fields.password"
          >
            <CmTextField
              v-model="data.password"
              v-bind="field"
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
            name="userCode"
            type="text"
            :rules="schema.fields.userCode"
          >
            <CmTextField
              v-model="data.userCode"
              v-bind="field"
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
            name="userTypeId"
            :rules="schema.fields.userTypeId"
          >
            <CmSelect
              v-bind="field"
              v-model="data.userTypeId"
              :text="LABEL.TEXT_USER_TYPE"
              :placeholder="LABEL.PLACEHOLDER_USER_TYPE"
              :items="userType"
              :errors="errors"
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
            name="statusId"
            :rules="schema.fields.statusId"
          >
            <CmSelect
              v-bind="field"
              v-model="data.statusId"
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
            name="phoneNumber"
            type="number"
            :rules="schema.fields.phoneNumber"
          >
            <CmTextField
              v-model="data.phoneNumber"
              v-bind="field"
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
            name="kpiLearn"
            type="number"
            :rules="schema.fields.kpiLearn"
          >
            <CmTextField
              v-model="data.kpiLearn"
              v-bind="field"
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
            name="kpiTeach"
            type="number"
            :rules="schema.fields.kpiTeach"
          >
            <CmTextField
              v-model="data.kpiTeach"
              v-bind="field"
              :errors="errors"
              :text="`${t('common.kpi-teaching')}`"
              :placeholder="$t('common.kpi-teaching')"
              type="number"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
      </VRow>
    </Form>
    <VDivider class="mb-5" />
  </VSheet>
  <VSheet
    width="100%"
    class="user-infor mx-auto no-background"
  >
    <CpTitleTable />
  </VSheet>
</template>

<style scoped lang="scss">
@use "/src/styles/style-global" as *;
</style>
