<script setup lang="ts">
interface Props {
  isSave?: any
}

const props = withDefaults(defineProps<Props>(), ({
  isSave: true,
}))

const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const action = [{
  title: 'Xem chi tiết',
  icon: 'eye',

  // action: handleItem1,
  prependItem: {
    value: true,
  },
},
{
  title: 'Tải file',
  icon: 'download',

  // action: handleItem2,
  prependItem: {
    value: true,
    action: () => { console.log(action) },
  },
},
{
  title: 'Tải file',
  icon: 'download',

  // action: handleItem2,
  prependItem: {
    value: true,
    action: () => { console.log(action) },
  },
},
{
  title: 'Chỉnh sửa',
  icon: 'edit',

  // action: showToast,
  prependItem: {
    value: true,
  },
}]

interface Emit {
  (e: 'onCancel'): void
  (e: 'onSave', event): void
}

const onCancel = () => {
  console.log('onCancel')

  emit('onCancel')
}

const handlerPreButton = event => {
  console.log('onSave')
  emit('onSave', event)
}
</script>

<template>
  <div class="d-flex justify-end">
    <div class="mr-3">
      <CmButton
        variant="outlined"
        bg-color="bg-white"
        color="dark"
        text-color="color-dark"
        @click="onCancel"
      >
        {{ t('common.cancel-title') }}
      </CmButton>
    </div>
    <div>
      <CmButtonGroup
        v-if="props.isSave"
        is-load
        :list-item="action"
        title="hello"
        @click-prepend="handlerPreButton($event)"
      >
        {{ t('common.save') }}
      </CmButtonGroup>
    </div>
  </div>
</template>

<style scoped>

</style>
