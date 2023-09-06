<script setup lang="ts">
const propsValue = withDefaults(defineProps<Props>(), ({
  src: '',
  height: '',
  cover: false,
}))

interface Props {
  src: string | null // đường dẫn
  height?: string // chiều cao
  cover?: boolean // độ phủ
}
</script>

<template>
  <div>
    <VImg
      v-if="src"
      :src="src"
      :height="height"
      :cover="cover"
    />
  </div>
</template>
