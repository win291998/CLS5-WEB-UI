<script setup lang="ts">
import CmSelect from '@/components/common/CmSelect.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'

/** ** Interface */
interface Emit {
  (e: 'update', value: any): void
}
const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const LABEL = Object.freeze({
  FILLTER1: 'Tình trạng hoạt động',
  FILLTER2: 'Cơ cấu tổ chức',
  FILLTER3: 'Vai trò người dùng',
  FILLTER4: 'Từ ngày đến ngày',
  FILLTER5: 'Được thêm từ',
})

const formFilter = reactive({
  statusList: null,
  structures: null,
  userTypeList: null,
})

const comboboxFilter = reactive({
  statuses: [],
  organizations: [],
  userType: [],
})

// method
// Lấy danh sách trạng thái người dùng
const fetchStatusUsers = async () => {
  const params = { statusList: [1, 2, 3, 5] }
  const res = await MethodsUtil.requestApiCustom(ComboboxService.StatusUser, TYPE_REQUEST.POST, params).then((value: any) => value)

  if (res.code === 200) {
    comboboxFilter.statuses = res?.data?.map(item => {
      return {
        ...item,
        value: t(item.value),
      }
    })
  }
  console.log(comboboxFilter)
}

// Lấy danh sách kiểu người dùng
const fetchTypeUsers = async () => {
  const res = await MethodsUtil.requestApiCustom(ComboboxService.TypeUsers, TYPE_REQUEST.GET).then((value: any) => value)
  if (res.code === 200)
    comboboxFilter.userType = res?.data || []
  console.log(res)
}

const change = () => {
  console.log(formFilter)
  emit('update', formFilter)
}

// created
fetchStatusUsers()
fetchTypeUsers()
</script>

<template>
  <VRow class="mb-3">
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.statusList"
        :items="comboboxFilter?.statuses"
        multiple
        item-value="key"
        custom-key="value"
        :text="LABEL.FILLTER1"
        :placeholder="LABEL.FILLTER1"
        @update:model-value="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CpOrganizationSelect
        v-model="formFilter.structures"
        :items="comboboxFilter?.statuses"
        :text="LABEL.FILLTER2"
        :placeholder="LABEL.FILLTER2"
        @update:modelValue="change"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="4"
    >
      <CmSelect
        v-model="formFilter.userTypeList"
        :items="comboboxFilter?.userType"
        :text="LABEL.FILLTER3"
        item-value="id"
        multiple
        custom-key="userTypeName"
        :placeholder="LABEL.FILLTER3"
        @update:model-value="change"
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
