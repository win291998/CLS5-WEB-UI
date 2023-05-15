<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'

window.showAllPageLoading('COMPONENT')

const CpApproveFilter = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/approve/CpApproveFilter.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * data
 */

const data = reactive({
  deleteIds: <any>[], // list id các row table muốn xóa
  listId: [], // list id các row table được chọn
})
let queryParam = reactive({
  keyword: '',
  pageNumber: 1,
  pageSize: 10,
  startDate: null,
  endDate: null,
})
const isShowFilter = ref(true)
const disabledDelete = computed(() => !data.listId.length)
const disabledApprove = computed(() => !data.listId.length)
const modalContent = ref('')
const isShowDialogNoti = ref(false)
const headers = reactive([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('full-name'), value: 'fullName', width: 250 },
  { text: t('email'), value: 'email', width: 250 },
  { text: t('userName'), value: 'userName', width: 150 },
  { text: t('phone-number'), value: 'phoneNumber', width: 100 },
  { text: t('status-name'), value: 'statusId', type: 'custom', width: 150 },
  { text: '', value: 'actions', width: 150 },
])
const items = ref ([])
const totalRecord = ref(0)
const configRegister = ref()

/**
 * method
 */
// filter
const handleFilter = async (dataFilter: any) => {
  queryParam = {
    ...queryParam,
    ...dataFilter,
  }
  await fectchListUsers()
}

// cập nhật trạng thái dialog
const updateDialogVisible = (event: any) => {
  isShowDialogNoti.value = event
}

// Function to handle when click button Delete
const deleteItem = (id: number) => {
  data.deleteIds = [id as never]
  modalContent.value = t('delete')
  isShowDialogNoti.value = true
}

// click  multi delete btn to show modal confirm
const deleteItems = () => {
  data.deleteIds = data.listId
  modalContent.value = t('delete')
  isShowDialogNoti.value = true
}

// delete action
const deleteAction = async () => {
  const params = {
    ids: data.deleteIds,
  }

  await MethodsUtil.requestApiCustom(ApiUser.deleteCustomer, TYPE_REQUEST.DELETE, params)
    .then(async (value: any) => {
      toast('SUCCESS', value?.message)
      queryParam.pageNumber = 1
      await fectchListUsers()
      data.deleteIds = []
      data.listId = []
    })
    .catch(() => {
      toast('ERROR', t('USR_DeleteFail'))
    })
}
const approveItems = async(id?: any) => {
  console.log('approve')
  if (id)
    data.deleteIds = [id]

  else
    data.deleteIds = data.listId
    await MethodsUtil.requestApiCustom(ApiUser.GetRegisterConfig, TYPE_REQUEST.GET).then((value) => {
      configRegister.value = data
    })
  
}

// hành động của dialog
const confirmDialog = (event: any) => {
  if (event)
    deleteAction()
}

// hàm trả về các loại action từ header filter
const handleClickBtn = (type: string) => {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    case 'approve':
      approveItems()
      break
    case 'delete':
      deleteItems()
      break

    default:
      break
  }
}

// search ở fillter header
const handleSearch = async (value: any) => {
  queryParam.pageNumber = 1
  queryParam.keyword = value
  await fectchListUsers()
}
const selectedRows = (e: any) => {
  data.listId = e
}

// click pagination
const handlePageClick = async (page: any) => {
  queryParam.pageNumber = page
  await fectchListUsers()
}

// hàm trả về các loại action khi click
const actionItem = (type: any) => {
  switch (type[0]?.name) {
    case 'ActionDelete':
      deleteItem(type[1].id)
      break

    default:
      break
  }
}

// Get list Users
async function fectchListUsers() {
  // await fetchData(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam)
  await MethodsUtil.requestApiCustom(ApiUser.GetListCustomerRequest, TYPE_REQUEST.GET, queryParam)
    .then((value: any) => {
      if (value.data)
        totalRecord.value = value.data?.totalRecord
      items.value = value.data?.pageLists
      value.data.pageLists.forEach((item: any) => {
        item.actions = [
          {
            id: 2,
            name: 'ActionDelete',
          },
          {
            id: 9,
            name: 'ActionAgree',
          },
          {
            id: 17,
            name: 'ActionDeclined',
          },
        ]
        item.actions = item.actions.map((el: any) => {
          return MethodsUtil.checkActionType(el, actionItem)
        })
      })
    })
    .catch(() => {
      toast('ERROR', t('USR_GetFailed'))
    })
}

// created
fectchListUsers()
window.hideAllPageLoading()
</script>

<template>
  <div class="text-medium-lg mb-6">
    {{ t('user-list') }}
  </div>
  <div
    v-if="isShowFilter"
    class="filter-action"
  >
    <CpApproveFilter @update="handleFilter" />
  </div>
  <div>
    <CpHeaderAction
      is-delete
      is-fillter
      is-approve
      :disabled-delete="disabledDelete"
      :disabled-approve="disabledApprove"
      @click="handleClickBtn"
      @search="handleSearch"
    />
  </div>
  <div>
    <CmTable
      ref="refTableUserList"
      :headers="headers"
      :items="items"
      :total-record="totalRecord"
      @handlePageClick="handlePageClick"
      @update:selected="selectedRows"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'statusId'">
          <VChip
            class="ma-2"
            :class="MethodsUtil.checkStatusTypeUser(context.statusId)?.color"
          >
            <VIcon
              start
              icon="carbon:dot-mark"
              size="12"
            />
            <span>{{ t(MethodsUtil.checkStatusTypeUser(context.statusId)?.name) }}</span>
          </VChip>
        </div>
      </template>
    </CmTable>
  </div>
  <CpConfirmDialog
    :type="2"
    variant="outlined"
    :max-width="400"
    :confirmation-msg-sub-title="t('delete')"
    :confirmation-msg="t('deleteUser')"
    :is-dialog-visible="isShowDialogNoti"
    @update:isDialogVisible="updateDialogVisible"
    @confirm="confirmDialog"
  />
</template>

