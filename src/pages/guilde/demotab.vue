<script lang="ts" setup>
import CmButton from '@/components/common/CmButton.vue'

interface Emit {
  (e: 'hello'): void
}
interface Props {
  emit?: any
}
const props = withDefaults(defineProps<Props>(), ({}))

const abc = ref('hello')
const { emitEvent } = props.emit()
</script>

<template>
  <CmButton
    title="win1"
    @click="emitEvent('hello', abc)"
  >
    hello
  </CmButton>
</template>

