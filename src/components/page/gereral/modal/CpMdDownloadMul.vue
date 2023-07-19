<script setup lang="ts">
import CpSearch from '@/components/page/gereral/CpSearch.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  listItem: () => ([]),
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmItemFileUpload = defineAsyncComponent(() => import('@/components/common/CmItemFileUpload.vue'))
interface Props {
  isShowModal: boolean
  listItem: Array<any>
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const LABEL = Object.freeze({
  TITLE: t('feedback-management'),
})

const fileUpload = ref(props.listItem)

const keyword = ref<any>(null)
async function onCancel() {
  emit('update:isShowModal', false)
}
async function handleSearch(e) {
  console.log(e)
}

watch(() => props.listItem, val => {
  console.log(val)
  fileUpload.value = val
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      close-on-back
      :is-ok="false"
      :title="t('download-file-course')"
      :is-div-space="false"
      size="sm"
      @cancel="onCancel"
    >
      <div class="mb-6 px-3">
        <CpSearch
          v-model:key-search="keyword"
          @update:key-search="handleSearch"
        />
      </div>
      <div>
        <CmItemFileUpload
          icon-status
          :files="fileUpload"
        />
      </div>
    </CmDialogs>
  </div>
</template>
