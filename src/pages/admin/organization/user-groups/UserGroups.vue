<script setup lang="ts">
import ApiGroupUser from '@/api/group-user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import type { Params } from '@/typescript/interface/params'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CpContent from '@/components/page/Admin/organization/user-group/CpContent.vue'

const CpHeaderACtion = defineAsyncComponent(() => import('@/components/page/Admin/organization/user-group/CpHeaderAction.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * Lấy dữ liệu bảng
 * */
const TABLE = Object.freeze({
  TOOLTIP_EDIT: t('Chỉnh sửa nhóm người dùng'),
  TOOLTIP_DELETE: t('Xóa nhóm người dùng'),
  TOOLTIP_REPORT: t('Xem báo cáo'),
})

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('common.name'), value: 'name', type: 'custom' },
  { text: t('report.number-user-in-group'), value: 'numberUser' },
  { text: t('common.number-course-group'), value: 'numberCourse' },
  { text: t('common.description'), value: 'description' },
  { text: '', value: 'actions', width: 150 },
])

const items = ref([])
const totalRecord = ref<number>()

const params = ref<Params>({
  search: '',
  pageNumber: 1,
  pageSize: 10,
})

const fetchData = async () => {
  const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListGroup, TYPE_REQUEST.GET, params.value)

  items.value = data.listData
  totalRecord.value = data.totalRecord
}

fetchData()

const searchGroupUser = (val: any) => {
  params.value.search = val
  params.value.pageNumber = 1
  fetchData()
}

/**
 * Xử lý header
 * CpHeaderACtion
 * */
const HEADER = Object.freeze({
  TITLE_PAGE: t('list-group-user'),
  BUTTON_EXCEL: t('export-excel'),
  BUTTON_ADD: t('common.add'),
})
</script>

<template>
  <div class="w-100">
    <CpHeaderACtion
      :title-page="HEADER.TITLE_PAGE"
      :button-add="HEADER.BUTTON_ADD"
      :button-excel="HEADER.BUTTON_EXCEL"
      @update:key-search="searchGroupUser"
    />
  </div>
  <div class="w-100 mt-3">
    <CpContent
      v-model:pageNumber="params.pageNumber"
      :headers="headers"
      :items="items"
      :total-record="totalRecord"
      :tootlip-report="TABLE.TOOLTIP_REPORT"
      :tootlip-delete="TABLE.TOOLTIP_DELETE"
      :tootlip-edit="TABLE.TOOLTIP_EDIT"
    />
    <!-- @change:page-number="fetchData" -->
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
</style>
