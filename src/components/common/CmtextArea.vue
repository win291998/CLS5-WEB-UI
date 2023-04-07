<script lang="ts" setup>
interface Prop {
  value?: any
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
}

const props = withDefaults(defineProps<Prop>(), ({}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:model-value', data: any): void
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
    :value="value"
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
    :messages="messages"
    :model-modifiers="modelModifiers"
    :name="name"
    :no-resize="noResize"
    :persistent-clear="persistentClear"
    :persistent-counter="persistentCounter"
    @update:model-value="emit('update:model-value', $event)"
  />
</template>

