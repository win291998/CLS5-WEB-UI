<script lang="ts" setup>
import CpHeaderAction from './CpHeaderAction.vue'
import DateUtil from '@/utils/DateUtil'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'

import { useCourseGroupStore } from '@/stores/admin/group-user/cpCourse'

const CpMdAddCourse = defineAsyncComponent(() => import('./Modal/CpMdAddCourse.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

const { t } = window.i18n()

const TITLE = Object.freeze({
  BUTTON_EXCEL: t('export-excel'),
  TITLE_PAGE: t('Danh sách khóa học'),
  BUTTON_ADD: t('common.add'),
  BUTTON_MOVE: t('Chuyển nhóm'),
  BUTTON_DELETE: t('Xóa người dùng'),
})

// Danh sách người dùng
const headers = [
  { text: '', value: 'checkbox', with: 50 },
  { text: t('common.user-name'), value: 'name', type: 'custom' },
  { text: t('common.title'), value: 'titleName' },
  { text: '', value: 'actions', width: 150 },
]

// Cài đặt show custom info
const isShowInfo = {
  isShowEmail: false,
  isShowAvatar: false,
  isFullName: false,
  labelCode: 'code',
}

const isShow = ref(false)
const store = useCourseGroupStore()
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
        <CpCustomInfo
          v-bind="isShowInfo"
          :context="context"
        />
      </div>
      <span v-if="col === 'topic'">
        <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
      </span>
    </template>
    <template #actions="{ data }">
      <!--
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
      -->
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

  <CpMdAddCourse
    v-model:is-show="isShow"
    title="Danh sách khóa học"
  />
</template>

