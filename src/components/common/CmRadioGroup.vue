<script setup lang="ts">
interface radio {
  label: string
  value: any
}
interface Props {
  option?: radio[]
  color?: string
  label?: string
}

interface Emit {
  (e: 'update:model-value', value: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  option: () => ([]),
  color: 'primary',
}))

const emit = defineEmits<Emit>()
const valueCurrent = ref()

const updateValue = (value: any) => {
  emit('update:model-value', value)
}
</script>

<template>
  <VRadioGroup
    v-model="valueCurrent"
    :label="label"
    inline
    @update:model-value="updateValue"
  >
    <VRadio
      v-for="(item, index) in option"
      :key="index"
      :label="item.label"
      :value="item.value"
      :color="color"
      true-icon="mdi-radiobox-marked"
      false-icon="mdi-radiobox-blank"
    />
  </VRadioGroup>
</template>
