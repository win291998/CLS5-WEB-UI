<script lang="ts" setup>
import CpHeaderAction from './CpHeaderAction.vue'
import CpMdAddUser from './Modal/CpMdAddUser.vue'
import DateUtil from '@/utils/DateUtil'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import { useUserGroupStore } from '@/stores/admin/group-user/cpUser'

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const { t } = window.i18n()

const TITLE = Object.freeze({
  BUTTON_EXCEL: t('export-excel'),
  TITLE_PAGE: t('Danh sách nhóm người dùng'),
  BUTTON_ADD: t('common.add'),
  BUTTON_MOVE: t('Chuyển nhóm'),
  BUTTON_DELETE: t('Xóa người dùng'),
})

// Danh sách người dùng
const headers = [
  { text: '', value: 'checkbox' },
  { text: t('common.user-name'), value: 'name', type: 'custom' },
  { text: t('report.org-struct'), value: 'orgName' },
  { text: t('common.title'), value: 'titleName' },
  { text: t('calendar.register-date'), value: 'registerDate', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
]

const isShow = ref(false)
const store = useUserGroupStore()
const { listUserInGroup, totalRecord, queryParams } = storeToRefs(store)
const { moveUser, deleteItem, getListUser } = store

// Tìm kiếm người dùng
const handleSearch = (val: string) => {
  store.queryParams.search = val
  store.queryParams.pageNumber = 1
}
watch(queryParams.value, val => {
  getListUser()
})

const showModalAdd = () => {
  isShow.value = true
}

onBeforeUnmount(() => {
  store.$dispose()
})

onDeactivated(() => {
  store.$dispose()
})
</script>

<template>
  <CpHeaderAction
    :button-prepend="TITLE.BUTTON_EXCEL"
    :title-page="TITLE.TITLE_PAGE"
    :button-add="TITLE.BUTTON_ADD"
    :is-show-add-group="false"
    @update:key-search="handleSearch"
    @click-add="showModalAdd"
  />
  <CmTable
    v-model:page-number="store.queryParams.pageNumber"
    :headers="headers"
    :items="listUserInGroup"
    :total-record="totalRecord"
  >
    <template #rowItem="{ col, context }">
      <div v-if="col === 'name'">
        <CpCustomInfo :context="context" />
      </div>
      <span v-if="col === 'registerDate'">
        <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
      </span>
    </template>
    <template #actions="{ data }">
      <div>
        <VIcon
          icon="simple-line-icons:cursor-move"
          :size="18"
          class="align-middle color-success"
          @click="moveUser(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ TITLE.BUTTON_MOVE }}
        </VTooltip>
      </div>
      <div>
        <VIcon
          icon="fe:trash"
          :size="18"
          class="align-middle color-error ml-2"
          @click="deleteItem(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ TITLE.BUTTON_DELETE }}
        </VTooltip>
      </div>
    </template>
  </CmTable>

  <CpMdAddUser
    v-model:is-show="isShow"
    title="Thêm mới nhóm người dùng"
    @update:data-user=""
  />
</template>

