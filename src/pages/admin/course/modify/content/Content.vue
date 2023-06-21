<script setup lang="ts">
const CpVideoContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/video/CpVideoContent.vue'))

const CpContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/type/CpContent.vue'))

const component = ref(CpContent)
const route = useRoute()
onMounted(() => {
  switch (route.params?.type) {
    case 'content':
      component.value = CpContent
      break
    case 'video':
      component.value = CpVideoContent
      break

    default:
      break
  }
})
</script>

<template>
  <div>
    <Component
      :is="component"
    />
  </div>
</template>
