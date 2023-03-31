<script setup lang="ts">
import type { JSXComponent, PropType } from 'vue'

type IconValue = string | JSXComponent

/** ** Interface */

interface Props {
  prependInnerIcon?: IconValue
  label?: string
  bgColor?: string
}
interface Emit {
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  prependInnerIcon: '',
  label: '',
  bgColor: 'white',
}))

const emit = defineEmits<Emit>()

const formFilter = reactive({
  search: null,
})

/** Method */
const handleChangeText = () => {
  emit('change', formFilter)
}

const handleUpdateText = () => {
  emit('update:modelValue', formFilter)
}
</script>

<template>
  <VTextField
    v-model="formFilter.search"
    :prepend-inner-icon="props.prependInnerIcon"
    :label="props.label"
    :bg-color="bgColor"
    hide-details="auto"
    @change="handleChangeText"
    @update:modelValue="handleUpdateText"
  />
</template>

