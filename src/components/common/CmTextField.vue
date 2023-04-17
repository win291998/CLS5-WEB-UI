<script setup lang="ts">
import type { JSXComponent, PropType } from 'vue'

type IconValue = string | JSXComponent

const props = withDefaults(defineProps<Props>(), ({
  prependInnerIcon: '',
  label: '',
  bgColor: 'white',
  type: 'text',
}))

const emit = defineEmits<Emit>(); const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** ** Interface */

interface Props {
  modelValue?: any
  prependInnerIcon?: IconValue
  label?: string
  text?: string
  bgColor?: string
  errors?: any
  field?: any
  placeholder?: any
  type?: string
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}

const formModelValue = ref(props.modelValue)

/** Method */
const handleChangeText = () => {
  emit('change', formModelValue.value)
}

const handleUpdateText = () => {
  emit('update:modelValue', formModelValue.value)
}

const messageError = computed(() => {
  if (props.errors?.length)
    return t(props.errors[0])

  return ''
})
</script>

<template>
  <div>
    <div class="mb-1">
      <label
        class="text-label-default"
      >{{ props.text }}</label>
    </div>
    <div>
      <VTextField
        v-model="formModelValue"
        v-bind="field"
        :prepend-inner-icon="props.prependInnerIcon"
        :label="props.label"
        :bg-color="bgColor"
        hide-details="auto"
        :placeholder="placeholder"
        :error-messages="messageError"
        :type="type"
        @change="handleChangeText"
        @update:modelValue="handleUpdateText"
      />
    </div>
  </div>
</template>

