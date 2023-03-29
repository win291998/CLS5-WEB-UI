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

const formFilter = reactive({
  search: null,
})

/** Method */
const handleChangeText = () => {
  console.log(formFilter)
}
</script>

<template>
  <VTextField
    v-model="formFilter.search"
    :prepend-inner-icon="props.prependInnerIcon"
    :label="props.label"
    :bg-color="bgColor"
    hide-details="auto"
    @update:modelValue="handleChangeText"
  />
</template>

