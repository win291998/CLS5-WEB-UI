<script lang="ts" setup>
import CmTextField from '@/components/common/CmTextField.vue'
import { validatorStore } from '@/stores/validatator'

const emit = defineEmits<Emit>()
const storeValidate = validatorStore()
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}
const { schemaOption, Field, Form, useForm, yup } = storeValidate
interface DataInput {
  id?: number
  userTypeName: string
  defaultRoleId: number
  listFeature: Feature[]
}
interface Feature {
  featureId?: number
  permissionOrganizationalStructure?: number
  permissionValue?: number
}
const dataInput = reactive<DataInput>({
  userTypeName: '',
  defaultRoleId: 0,
  listFeature: [],
})
</script>

<template>
  <Form>
    <VRrow
      cols="4"
    >
      <VCol>
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.userTypeName"
          name="name"
          type="text"
          :rules="schemaOption.defaultString"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            text="Tên nhóm người dùng*"
            placeholder="Mã nhóm người dùng"
          />
          <!-- @update:model-value="emit('update:name', $event)" -->
        </Field>
      </VCol>
      <VCol
        cols="4"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="dataInput.userTypeName"
          name="name"
          type="text"
          :rules="schemaOption.defaultString"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            text="Tên nhóm người dùng*"
            placeholder="Mã nhóm người dùng"
          />
          <!-- @update:model-value="emit('update:name', $event)" -->
        </Field>
      </VCol>
    </VRrow>
  </Form>
</template>

