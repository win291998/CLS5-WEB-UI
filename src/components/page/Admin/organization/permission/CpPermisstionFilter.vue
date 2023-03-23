<script setup lang="ts">
import CmSelect from '@/components/common/CmSelect.vue'

const LABEL = Object.freeze({
  FILLTER1: 'Tình trạng hoạt động',
  FILLTER2: 'Vai trò người dùng',
  FILLTER3: 'Từ ngày đến ngày',
  FILLTER4: 'Được thêm từ',
})
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="3"
      sm="4"
    >
      <CmSelect
        :text="LABEL.FILLTER1"
        :placeholder="LABEL.FILLTER1"
      />
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="4"
    >
      <CmSelect
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
      />
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="4"
    >
      <CmSelect
        :text="LABEL.FILLTER3"
        :placeholder="LABEL.FILLTER3"
      />
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="4"
    >
      <CmSelect
        :text="LABEL.FILLTER4"
        :placeholder="LABEL.FILLTER4"
      />
    </VCol>
  </VRow>
</template>
