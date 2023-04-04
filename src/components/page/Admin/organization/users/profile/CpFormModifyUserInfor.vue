<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const store = validatorStore()
const { schema, Field, Form } = store
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

// interface
// params main

// data
const data = reactive({
  lastName: '',
  firstName: '',
  email: '',
  userName: '',
  password: '',
})

// method
const handleFormValue = (value: any) => {
  console.log(value)
}

// event
</script>

<template>
  <VSheet
    width="100%"
    class="user-infor mx-auto no-background"
  >
    <Form>
      <VRow>
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
              :label="`${t('common.surname')}*`"
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
              :label="`${t('common.name')}*`"
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
              :label="`${t('common.email')}*`"
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
              :label="`${t('common.sign-name')}*`"
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
            type="text"
            :rules="schema.fields.password"
          >
            <CmTextField
              v-model="data.password"
              v-bind="field"
              :errors="errors"
              :label="`${t('common.password')}*`"
              :placeholder="t('users.add-user.enter-password')"
              @change="handleFormValue"
            />
          </Field>
        </VCol>
      </VRow>
    </Form>
  </VSheet>
</template>

<style scoped lang="scss">
  .user-infor.no-background {
    background-color: transparent;
  }
</style>
