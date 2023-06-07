<script setup lang="ts">
import toast from '@/plugins/toast'

const props = withDefaults(defineProps<Props>(), {
  isShowModalAddCapacity: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))

interface Props {
  isShowModalAddCapacity: boolean
  excludeIds?: any
}
interface Emit {
  (e: 'update:isShowModalAddCapacity', value: any): void
  (e: 'saveChange', value: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/** state */
const LABEL = Object.freeze({
  TITLE: t('add-teacher'),
})
const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

/** method */
async function onCancel() {
  emit('update:isShowModalAddCapacity', false)
}
async function onConfirm() {
  if (data.selectedRowsIds.length === 0) {
    toast('WARNING', t('please-choose-at-least') + t('proficiency').toLowerCase())
    return
  }
  emit('saveChange', data.selectedRowsIds)
  nextTick(() => {
    emit('update:isShowModalAddCapacity', false)
  })
}
</script>

<template>
  <div>
    <CmDialogs
      :title="LABEL.TITLE"
      :is-dialog-visible="isShowModalAddCapacity"
      :button-ok-name="t('save')"
      close-on-back
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <!--
        <div class="d-flex justify-end mb-6">
        <div class="w-50">
        <CpSearch
        v-model:key-search="queryParams.keyword"
        @update:key-search="handleSearch"
        />
        </div>
        </div>
        <CmTable
        v-model:pageSize="queryParams.pageSize"
        :headers="headers"
        :items="items"
        :total-record="totalRecord"
        :page-number="queryParams.pageNumber"
        return-object
        :type-pagination="2"
        @handlePageClick="handlePageClick"
        @update:selected="selectedRows"
        >
        <template #rowItem="{ col, context }">
        <div v-if="col === 'fullName'">
        <CpCustomInfo
        :context="context"
        />
        </div>
        </template>
        </CmTable>
      -->
    </CmDialogs>
  </div>
</template>

<style scoped>

</style>
