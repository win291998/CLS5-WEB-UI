<script setup lang="ts">
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmSelect from '@/components/common/CmSelect.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
</script>

<template>
  <CmDialogs
    :is-dialog-visible="false"
    :title="t('common.action-table.changes-status')"
  >
    <template #content>
      <div>
        <CmSelect
          text="trạng thái"
          placeholder="Chọn trạng thái"
        />
      </div>
    </template>
  </CmDialogs>
</template>

<style scoped>

</style>
