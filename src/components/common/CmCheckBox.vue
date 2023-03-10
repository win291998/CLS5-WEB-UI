<script setup lang="ts">
interface Props {/** ** Interface */
  modelValue?: boolean
  color?: string
  disabled?: boolean
  indeterminate?: boolean
  error?: boolean
  errorMessages?: string | string[]
  falseIcon?: string | (new () => any)
  falseValue?: any
  focused?: boolean
  hideDetails?: boolean | 'auto'
  id?: string
  indeterminateIcon?: string | (new () => any)
  prependIcon?: string | (new () => any)
  trueIcon?: string | (new () => any)
  inline?: boolean
  label?: string
  multiple?: boolean
  readonly?: boolean
  ripple?: boolean
  name?: string
  theme?: string
  type?: string
  rules?: any
  trueValue?: any
  tooltip?: boolean
  tooltipLabel?: string
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}

/** ** Khởi tạo prop emit */
const propsValue = withDefaults(defineProps<Props>(), ({
  modelValue: false,
  color: '',
  disabled: false,
  indeterminate: false,
  error: false,
  errorMessages: '',
  falseIcon: undefined,
  falseValue: undefined,
  focused: false,
  hideDetails: undefined,
  id: undefined,
  indeterminateIcon: undefined,
  trueIcon: undefined,
  prependIcon: undefined,
  inline: undefined,
  label: undefined,
  multiple: false,
  ripple: false,
  readonly: false,
  name: undefined,
  theme: undefined,
  trueValue: undefined,
  type: undefined,
  tooltip: true,
  tooltipLabel: 'Tooltip',
}))

const emit = defineEmits<Emit>()
const checkbox = ref(propsValue.modelValue)

const onChangeChecked = (val: boolean) => {
  emit('update:modelValue', val)
}

watch(() => propsValue.modelValue, value => {
  checkbox.value = window._.cloneDeep(propsValue.modelValue)
  emit('change', value)
})
</script>

<template>
  <VTooltip
    :text="propsValue.tooltipLabel"
    offset="0"
    :disabled="!propsValue.tooltip"
  >
    <template #activator="{ props }">
      <span v-bind="props">
        <VCheckbox
          :id="propsValue.id"
          v-model="checkbox"
          :color="propsValue.color"
          :disabled="propsValue.disabled"
          :indeterminate="propsValue.indeterminate"
          :error="propsValue.error"
          :error-messages="propsValue.errorMessages"
          :false-icon="propsValue.falseIcon"
          :false-value="propsValue.falseValue"
          :focused="propsValue.focused"
          :hide-details="propsValue.hideDetails"
          :indeterminate-icon="propsValue.indeterminateIcon"
          :inline="propsValue.inline"
          :label="propsValue.label"
          :multiple="propsValue.multiple"
          :prepend-icon="propsValue.prependIcon"
          :ripple="propsValue.ripple"
          :rules="propsValue.rules"
          :name="propsValue.name"
          :readonly="propsValue.readonly"
          :type="propsValue.type"
          :true-icon="propsValue.trueIcon"
          :true-value="propsValue.trueValue"
          @update:modelValue="onChangeChecked($event)"
        >
          <template #label>
            <slot name="label" />
          </template>
        </VCheckbox>
      </span>
    </template>
  </VTooltip>
</template>

