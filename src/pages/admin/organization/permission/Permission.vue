<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import DateUtil from '@/utils/DateUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringUtil from '@/utils/StringUtil'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'
import CpModalUpdateStatus from '@/components/page/Admin/organization/users/CpModalUpdateStatus.vue'
import toast from '@/plugins/toast'

// mock api

import { fetchData } from '@/mock/users/index'

const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpUserFilter = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/CpUserFilter.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmAccodion = defineAsyncComponent(() => import('@/components/common/CmAccodion.vue'))

/** params */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const disabledDelete = ref(false)
const isShowFilter = ref(true)
const route = useRoute()

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('common.surname-name'), value: 'fullName' },
  { text: t('common.role'), value: 'userTypeName' },
  { text: t('common.status-name'), value: 'statusName', type: 'custom' },
  { text: t('report.join-date'), value: 'registeredDate', type: 'custom' },
  { text: t('common.organization'), value: 'organization', type: 'menu', width: 300 },
  { text: '', value: 'actions', width: 150 },
])

const orgModels = {
  value: 1,
  label: 'Cơ cấu tổ chức',
  icon: 'tabler-briefcase',
  colorClass: 'color-error',
  content: [],
}

const actionItemView = () => {
  //
}

const groupModels = {
  value: 1,
  label: 'Nhóm người dùng',
  icon: 'lucide:users',
  colorClass: 'color-warning',
  content: [],
}

const titleModels = {
  value: 1,
  label: 'Chức danh',
  icon: 'prime-check-circle',
  colorClass: 'color-success',
  content: [],
}

const items = ref ([])
const totalRecord = ref(0)
const modalContent = ref('')
const isShowDialogNoti = ref(false)

const data = reactive({
  deleteIds: [], // list id các row table muốn xóa
  listId: [], // list id các row table được chọn
  showPassword: false,
  isShowDialogPasword: false,
  typeDialogRessetPass: 1,
  selectedItemId: 0,
  testingCode: '',
})

const queryParam = reactive({
  groupUser: [],
  keyword: '',
  modeAdd: null,
  orStructure: [],
  pageNumber: 1,
  pageSize: 10,
  role: 1,
  sort: ['-createdDate'],
  statusList: null,
  timeFrom: '',
  timeTo: '',
  titleList: [],
  userTypeList: null,
})

/** ***************************** Method *****************************/
// Function to handle when click button Delete
const deleteItem = (id: number) => {
  data.deleteIds = [id as never]
  modalContent.value = t('users.user.action-modal.delete')
  isShowDialogNoti.value = true
}

// click  multi delete btn to show modal confirm
const deleteItems = () => {
  data.deleteIds = data.listId
  modalContent.value = t('users.user.action-modal.delete')
  isShowDialogNoti.value = true
}

// hàm trả về các loại action khi click
const actionItem = (type: any) => {
  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break
    case 'issuePasswords':
      data.showPassword = false
      data.selectedItemId = type[1].id
      data.isShowDialogPasword = true
      break

    default:
      break
  }
}

// Get list Users
const fectchListUsers = async () => {
  const res = await MethodsUtil.requestApiCustom(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam).then((value: any) => value)

  // const res = await fetchData(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam).then((value: any) => value)

  if (res?.code === 200 && res?.data?.pageLists.length) {
    res.data.pageLists.forEach((item: any) => {
      const titleData = window._.clone(item.orgModels)

      item.orgModels = {
        ...orgModels,
        content: window._.clone(item.orgModels),
      }
      item.groupModels = {
        ...groupModels,
        content: window._.clone(item.groupModels),
      }
      item.titleModels = {
        ...titleModels,
        content: titleData,
      }
      item.actions = item.actions.map((el: any) => {
        return MethodsUtil.checkActionType(el, actionItem)
      })
    })
  }
  items.value = res.data.pageLists
  totalRecord.value = res?.data?.totalRecord
}

// delete action
const deleteAction = async () => {
  const params = {
    listId: data.deleteIds,
  }

  const res = await MethodsUtil.requestApiCustom(ApiUser.UsersDelete, TYPE_REQUEST.POST, params).then((value: any) => value)

  if (res.code === 200) {
    toast('SUCCESS', res?.message)
    await fectchListUsers()
  }
  else { toast('ERROR', res?.message) }
}

const selectedRows = (e: any) => {
  data.listId = e
  disabledDelete.value = e.length > 0
}

// click pagination
const handlePageClick = async (page: any) => {
  queryParam.pageNumber = page
  await fectchListUsers()
}

// search ở fillter header
const handleSearch = async (value: any) => {
  queryParam.pageNumber = 1
  queryParam.keyword = value.search
  await fectchListUsers()
}

//  fillter header
const handleFilterCombobox = (dataFilter: any) => {
  //
}

// hành động của dialog
const confirmDialog = (event: any) => {
  if (event)
    deleteAction()
}

// reset password
const handleRefresh = async () => {
  const params = {
    userId: data.selectedItemId,
  }

  const res = await MethodsUtil.requestApiCustom(ApiUser.ResetPassword, TYPE_REQUEST.POST, params).then((value: any) => value)
  if (res.code === 200) {
    data.testingCode = res?.data
    data.showPassword = true
    data.typeDialogRessetPass = 0
  }

  // this.testingCode = res.data
  // if (response.code === 200)
  //   this.showPassword = false
}

const confirmDialogResetPass = (event: any) => {
  if (event)
    handleRefresh()
}

// cập nhật trạng thái dialog
const updateDialogVisible = (event: any) => {
  isShowDialogNoti.value = event
}

const updateDialogVisibleResset = (event: any) => {
  if (data.showPassword)
    data.isShowDialogPasword = event
}

// hàm trả về các loại action từ header filter
const handleClickBtn = (type: string) => {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}

// coppy code
const copyTestingCode = () => {
  const testingCodeToCopy = document.querySelector('#testing-code') as HTMLInputElement

  testingCodeToCopy?.setAttribute('type', 'text')
  testingCodeToCopy?.select()
  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
  }
  catch (err) {}

  /* unselect the range */
  testingCodeToCopy?.setAttribute('type', 'hidden')
  window?.getSelection()?.removeAllRanges()
}

/** ***************************** end Method *****************************/
// watch
watch(() => route.path, value => {
  // console.log(value)
}, { immediate: true })

// created
fectchListUsers()
</script>

<template>
  <div
    v-if="isShowFilter"
    class="filter-action"
  >
    <CpUserFilter @update="handleFilterCombobox" />
  </div>
  <div>
    <CpHeaderAction
      is-delete
      :disabled-delete="disabledDelete"
      is-fillter
      @click="handleClickBtn"
      @search="handleSearch"
    />
  </div>
  <div>
    <CmTable
      :headers="headers"
      :items="items"
      :total-record="totalRecord"
      @handlePageClick="handlePageClick"
      @selectedRows="selectedRows"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'fullName'">
          {{ StringUtil.formatFullName(context.firstName, context.lastName) }}
        </div>
        <div v-if="col === 'organization'">
          <CmAccodion
            v-if="context.orgModels?.content?.length"
            :data="[context.orgModels]"
            custom-key="name"
            is-open
          />
          <CmAccodion
            v-if="context.groupModels?.content?.length"
            :data="[context.groupModels]"
            custom-key="name"
            is-open
          />

          <CmAccodion
            v-if="context.titleModels?.content?.length"
            :data="[context.titleModels]"
            custom-key="titleName"
            is-open
          />
        </div>
        <div v-if="col === 'registeredDate'">
          <span>{{ DateUtil.formatDateToDDMM(context.registeredDate) }}</span>
        </div>
        <div v-if="col === 'statusName'">
          <VChip
            class="ma-2"
            :class="MethodsUtil.checkStatusTypeUser(context.statusName)?.color"
          >
            <VIcon
              start
              icon="carbon:dot-mark"
              size="12"
            />
            <span>{{ t(MethodsUtil.checkStatusTypeUser(context.statusName)?.name) }}</span>
          </VChip>
        </div>
      </template>
    </CmTable>
  </div>
  <CpConfirmDialog
    :type="2"
    variant="outlined"
    :confirmation-msg-sub-title="t('users.user.action-modal.delete')"
    :confirmation-msg="t('users.branch.deleteUser')"
    :is-dialog-visible="isShowDialogNoti"
    @update:isDialogVisible="updateDialogVisible"
    @confirm="confirmDialog"
  />
  <CpConfirmDialog
    :is-dialog-visible="data.isShowDialogPasword"
    :type="data.typeDialogRessetPass"
    :confirmation-msg="data.showPassword === true ? t('users.user.action-modal.new-passworded') : t('common.confirm-modal.title')"
    :confirmation-msg-sub-title="!data.showPassword === true ? t('users.user.action-modal.waning-password') : ''"
    :is-hide-footer="data.showPassword"
    @confirm="confirmDialogResetPass"
    @update:isDialogVisible="updateDialogVisibleResset"
  >
    <template
      v-if="data.showPassword"
      #sub-title
    >
      <div>{{ t('users.user.action-modal.new-password') }}</div>
      <div class="value-coppy">
        <span class="text-red">{{ data.testingCode }}</span>
        <span
          :title="$t('users.user.action-modal.coppy')"
          class="icon-coppy"
          @click.stop.prevent="copyTestingCode"
        >
          <VIcon icon="tabler:copy" />
        </span>
        <input
          id="testing-code"
          type="hidden"
          :value="data.testingCode"
        >
      </div>
    </template>
  </CpConfirmDialog>
  <CpModalUpdateStatus :is-dialog-visible="false" />
</template>

<style lang="scss">
.value-coppy {
  margin: 15px;
  text-align: center;

  .text-red {
    padding: 10px;
    border: 1px solid #d6d8de;
    border-radius: 6px;
  }

  .icon-coppy {
    cursor: pointer;
    margin-inline-start: 15px;
  }
}
</style>
