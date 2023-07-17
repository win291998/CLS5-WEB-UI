<script lang="ts" setup>
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
interface Emit {
  (e: 'update:keySearch', key: string): void
}

interface Props {
  keySearch?: string
}

const handleSearch = window._.debounce((val: any) => {
  console.log(val)

  emit('update:keySearch', val)
}, 500)
</script>

<template>
  <CmTextField
    style="width: 100%"
    class="header-action-field"
    placeholder="Tìm kiếm"
    prepend-inner-icon="tabler-search"
    @update:model-value="handleSearch"
  />
</template>
