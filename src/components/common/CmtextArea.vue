<script lang="ts" setup>
interface Prop {
  modelValue?: any
  active?: boolean
  appendIcon?: string
  appendInnerIcon?: string
  autofocus?: boolean
  autoGrow?: boolean
  bgColor?: string
  clearable?: boolean
  clearIcon?: boolean
  color?: string
  counter?: string | number | true
  counterValue?: (val: any) => number
  dirty?: boolean
  disabled?: boolean
  error?: boolean
  errorMessages?: string
  focused?: boolean
  hideDetails?: boolean | 'auto'
  hint?: string
  id?: string
  label?: string
  loading?: string | boolean
  maxErrors?: string | number
  maxRows?: string | number
  messages?: string | string[]
  modelModifiers?: Record<string, boolean>
  name?: string
  noResize?: boolean
  persistentClear?: boolean
  persistentCounter?: boolean
  text?: string
  field?: any
}

const props = withDefaults(defineProps<Prop>(), ({}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:model-value', data: any): void
}
const formModelValue = ref(props.modelValue)

const handleUpdate = (event: any) => {
  emit('update:model-value', event)
}
</script>

<template>
  <div class="mb-1">
    <label
      class="text-medium-sm color-dark"
    >{{ props.text }}</label>
  </div>

  <VTextarea
    :id="id"
    v-model="formModelValue"
    v-bind="field"
    :active="active"
    :append-icon="appendIcon"
    :append-inner-icon="appendInnerIcon"
    :autofocus="autofocus"
    :auto-grow="autoGrow"
    :bg-color="bgColor"
    :clearable="clearable"
    :color="color"
    :counter="counter"
    :counter-value="counterValue"
    :dirty="dirty"
    :disabled="disabled"
    :error="error"
    :error-messages="errorMessages"
    :focused="focused"
    :hide-details="true"
    :hint="hint"
    :label="label"
    :max-errors="maxErrors"
    :max-rows="maxRows"
    rows="4"
    :messages="messages"
    :model-modifiers="modelModifiers"
    :name="name"
    :no-resize="noResize"
    :persistent-clear="persistentClear"
    :persistent-counter="persistentCounter"
    @update:model-value="emit('update:model-value', formModelValue)"
  />
</template>

<style lang="scss" scoped>
.text-area {
  height: unset;
}
</style>

