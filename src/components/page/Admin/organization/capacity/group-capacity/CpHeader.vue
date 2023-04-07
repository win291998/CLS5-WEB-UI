<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'

const props = withDefaults(defineProps<Prop>(), ({
  isDisableDelete: false,
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const titlePage = {
  titleList: t('list-group-capacity'),
  titleAdd: t('common.add'),
}

interface Prop {
  isDisableDelete: boolean
}

interface Emit {
  (e: 'confirm', value: boolean): void
  (e: 'showAdd'): void
  (e: 'deleteMultiple'): void
}
console.log(props.isDisableDelete)
watch(() => props.isDisableDelete, val => {
  console.log(props.isDisableDelete)
})
</script>

<template>
  <VRow class="justify-space-between w-100 ma-3">
    <div>
      <h3>{{ titlePage.titleList }}</h3>
    </div>
    <CmButton
      :title="titlePage.titleAdd"
      color="primary"
      class="mr-4"
      @click="emit('showAdd')"
    />
  </VRow>
  <VRow class="ma-3">
    <CpHeaderAction
      is-delete
      :is-fillter="false"
      :disabled-delete="props.isDisableDelete"
      @delete-multiple="emit('deleteMultiple')"
    />
  </VRow>
</template>
