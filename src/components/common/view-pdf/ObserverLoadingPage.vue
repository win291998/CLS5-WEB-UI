<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  pageNumber: 0,
  width: 100,
  height: 50,
}))

const emit = defineEmits<Emit>()

// interface
interface Props {
  pageNumber: number
  width: number
  height: number
  rootId: string | undefined
}
interface Emit {
  (e: 'showPage', data: number): void
}

function onIntersect(isIntersecting: any) {
  if (isIntersecting)
    emit('showPage', props.pageNumber)
}
console.log(props.rootId)
const rootEl = document.getElementById(`${props.rootId}`)
</script>

<template>
  <div
    v-intersect.once="{
      handler: onIntersect,
      options: {
        root: rootEl,
        rootMargin: '200% 0px 200% 0px',
      },
    }"
    class="observer-loading-page"
    :style="`width: ${width}px; height: ${height}px`"
  >
    <VProgressCircular
      indeterminate
      color="primary"
    />
  </div>
</template>

<style lang="scss">
.observer-loading-page {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: #cdcdcd;
}
</style>
