<script setup lang="ts">
interface Props {
  prependIcon: string | (new () => any)
}
interface Emit {
  (e: 'click', value: any): void
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  prependIcon: undefined,
}))

const emit = defineEmits<Emit>()

const handleClickBtn = (e: any) => {
  emit('click', e)
}
</script>

<template>
  <VBtn
    variant="outlined"
    color="primary"
    :prepend-icon="props.prependIcon"
    @click="handleClickBtn"
  >
    <slot />
  </VBtn>
</template>

<style scoped>

</style>
