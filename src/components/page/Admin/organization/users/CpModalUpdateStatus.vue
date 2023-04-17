<script setup lang="ts">
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { comboboxStore } from '@/stores/combobox'

interface Props {
  isDialogVisible: boolean
}

const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean, data: any): void
}
const store = comboboxStore()
const { statuses } = storeToRefs(store)
const { fetchStatusUsersCombobox } = store
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const LABEL = Object.freeze({
  TEXT: 'Trạng thái',
  PLACEHOLDER: 'Chọn trạng thái',
})

const statusList = ref(null)

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = (event: boolean) => {
  emit('confirm', event, statusList.value)
}

if (window._.isEmpty(statuses.value))
  fetchStatusUsersCombobox()
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isDialogVisible"
    :title="t('common.action-table.changes-status')"
    close-on-back
    @update:isDialogVisible="updateModelValue"
    @confirm="onConfirmation"
  >
    <template #content>
      <div>
        <CmSelect
          v-model="statusList"
          item-value="key"
          custom-key="value"
          :text="LABEL.TEXT"
          :placeholder="LABEL.PLACEHOLDER"
          :items="statuses"
        />
      </div>
    </template>
  </CmDialogs>
</template>

