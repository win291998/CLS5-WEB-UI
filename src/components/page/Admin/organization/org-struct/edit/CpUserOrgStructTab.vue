<script setup lang="ts">
const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** data */
const queryParams = reactive({
  pageNumber: 1,
  pageSize: 10,
  search: '',
})
const dataComponent = reactive({
  totalRecord: 0,
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})
const disabledDelete = computed(() => !dataComponent.selectedRowsIds.length)
const isShowDialogAddUser = ref(false)
const isShowDialogNotiDelete = ref(false)

/** method */
const handlerActionHeader = (type: any) => {
  console.log(type)
  switch (type) {
    case 'handlerCustomButton':
      console.log(type)

      break

    default:
      break
  }
}

// search ở fillter header
const handleSearch = async (value: any) => {
  queryParams.pageNumber = 1
  queryParams.search = value
}
const handleAddUserOrg = async (value: any) => {
  isShowDialogAddUser.value = true
}
const handleDeleteMultiple = async (value: any) => {
  dataComponent.deleteIds = dataComponent.selectedRowsIds
  isShowDialogNotiDelete.value = true
}
</script>

<template>
  <div>
    <div>
      <CpActionHeaderPage
        :title="t('user-list')"
        bg-custom="bg-primary"
        :title-custom="t('add-user')"
        is-custom-btn
        @click="handlerActionHeader"
      />
    </div>
    <div class="my-6">
      <CpHeaderAction
        :is-fillter="false"
        is-delete
        :disabled-delete="disabledDelete"
        @search="handleSearch"
        @add-handler="handleAddUserOrg"
        @deleteMultiple="handleDeleteMultiple"
      />
    </div>
  </div>
</template>

