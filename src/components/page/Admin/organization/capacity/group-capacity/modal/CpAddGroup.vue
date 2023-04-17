<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'

const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
  title: '',
  dataDetail: {
    name: '',
    description: '',
  },
}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'ok', value: any): void
  (e: 'edit', value: any): voidf
  (e: 'update:isShow', value: any): void
}

// Ẩn modal
const storeValidate = validatorStore()
const { schema, Field, Form } = storeValidate
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface Props {
  isShow: boolean
  title: string
  dataDetail: any
}

/**
 * Thêm nhóm năng lực
 * */
const dataInput = ref({
  id: '',
  name: '',
  description: '',
})

const confirm = (isShow: boolean) => {
  if (isShow) {
    if (dataInput.value.id)
      emit('edit', dataInput.value)
    else
      emit('ok', dataInput.value)

    emit('update:isShow', false)
  }
}

/**
 * Chỉnh sửa
 * */

watch(() => props.dataDetail, val => {
  if (val) {
    dataInput.value.id = val.id
    dataInput.value.name = val.name
    dataInput.value.description = val.description
  }
})

const hideModal = (val: any) => {
  dataInput.value = {
    id: '',
    name: '',
    description: '',
  }
  emit('update:isShow', val)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isShow"
    :title="title"
    @update:is-dialog-visible="hideModal"
    @confirm="confirm"
  >
    <template #content>
      <Form>
        <VRow>
          <VCol>
            <Field
              v-slot="{ field, errors }"
              name="name"
              type="text"
              :rules="schema.fields.lastName"
            >
              <CmTextField
                v-model="dataInput.name"
                v-bind="field"
                :errors="errors"
                :text="`${t('users.capacity-management.proficiency-group.name')}*`"
                :placeholder="t('users.capacity-management.proficiency-group.name')"
              />
            </Field>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <Field
              v-slot="{ field, errors }"
              name="name"
              type="text"
              :rules="schema.fields.lastName"
            >
              <CmTextField
                v-model="dataInput.description"
                v-bind="field"
                :errors="errors"
                :text="t('common.description')"
                :placeholder="t('users.capacity-management.proficiency-group.name')"
              />
            </Field>
          </VCol>
        </VRow>
      </Form>
    </template>
  </CmDialogs>
</template>
