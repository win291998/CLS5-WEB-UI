<script setup lang="ts">
import CpHeader from './CpHeader.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { list } from '@/mock/capacity/index'

const CpAddGroup = defineAsyncComponent(() => import('./modal/CpAddGroup.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

// Khởi tạo
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

// table
const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('group-capacity-name'), value: 'groupCapacity' },
  { text: t('common.description'), value: 'description' },
  { text: '', value: 'actions', width: 150 },
])

const actionItem = () => {
  //
}

const items = ref<any>()
const totalRecord = ref<number>(0)

const getDataTable = () => {
  items.value = list.data.pageLists
  totalRecord.value = list.data.totalRecord
  items.value?.forEach((item: any) => {
    item.actions = item?.actions.map((el: any) => {
      return MethodsUtil.checkActionType(el, actionItem)
    })
  })
}

getDataTable()

const isShow = ref(false)

const showModalAdd = () => {
  isShow.value = true
}
</script>

<template>
  <div class="mt-3">
    <CpHeader
      @showAdd="showModalAdd"
    />
  </div>
  <div class="mt-3">
    <CmTable
      :headers="headers"
      :items="items"
      :total-record="totalRecord"
    />
  </div>
  <CpAddGroup :is-show="isShow" />
</template>
