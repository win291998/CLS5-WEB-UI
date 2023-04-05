<script setup lang="ts">
import CmDialogsVue from '@/components/common/CmDialogs.vue'

interface Props {
  isShow: boolean
}

const props = withDefaults(defineProps<Props>(), ({
  isShow: false,
}))
</script>

<template>
  <CmDialogsVue :is-dialog-visible="isShow">
    <h1>hello</h1>
  </CmDialogsVue>
</template>
