<script lang="ts" setup>
import CmSelect from '@/components/common/CmSelect.vue'

const props = withDefaults(defineProps<Props>(), ({}))
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShow: boolean
  title: string
}
interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'update:dataUser', data: any): void
}
const hidden = (val: any) => {
  emit('update:isShow', false)
}
const confirm = (val: any) => {
  emit('update:isShow', false)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="title"
    size="sm"
    @cancel="hidden"
    @confirm="confirm"
  >
    <span>Chọn nhóm người dùng</span>

    <CmSelect />
  </CmDialogs>
</template>
