<script setup lang="ts">
import type { JSXComponent, PropType } from 'vue'

type IconValue = string | JSXComponent

interface Props {
  prependInnerIcon?: IconValue
  label?: string
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), ({
  prependInnerIcon: '',
  label: '',
  bgColor: 'white',
}))

const rules = [
  (value: any) => !!value || 'Required.',
  (value: any) => (value && value.length >= 3) || 'Min 3 characters',
]
</script>

<template>
  <VTextField
    :prepend-inner-icon="props.prependInnerIcon"
    :label="props.label"
    :rules="rules"
    :bg-color="bgColor"
    hide-details="auto"
  />
</template>

