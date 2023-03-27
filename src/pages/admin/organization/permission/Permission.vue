<script setup lang="ts">
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringUtil from '@/utils/StringUtil'

// mock api

import { fetchData } from '@/mock/users/index'

const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CpPermisstionFilter = defineAsyncComponent(() => import('@/components/page/Admin/organization/permission/CpPermisstionFilter.vue'))
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmAccodion = defineAsyncComponent(() => import('@/components/common/CmAccodion.vue'))

/** params */
const disabledDelete = ref(true)
const isShowFilter = ref(true)
const route = useRoute()
const TablePer = ref(null)

const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: 'Họ và tên', value: 'fullName' },
  { text: 'Vai trò', value: 'userTypeName' },
  { text: 'Trạng thái', value: 'statusName' },
  { text: 'Ngày tham gia', value: 'registeredDate' },
  { text: 'Tổ chức', value: 'organization', type: 'menu', width: 300 },
  { text: '', value: 'actions', width: 150 },
])

const orgModels = {
  value: 1,
  label: 'Cơ cấu tổ chức',
  icon: 'tabler-briefcase',
  colorClass: 'color-error',
  content: [],
}

onMounted(() => {
  TablePer.value.loadTable()

  setTimeout(() => {
    TablePer.value.unLoadTable()
  }, 5000)
})

const actionItemView = () => {
  console.log('view')
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

// hàm trả về các loại action khi click
const actionItem = type => {
  // console.log(type)
}

const items = ref ([])
const totalRecord = ref (0)

const queryParam = reactive({})

/** Method */
// Get list Users
const fectchListUsers = async (queryParam: any) => {
  // const res = await MethodsUtil.requestApiCustom(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam).then((value: any) => value)
  const res = await fetchData(ApiUser.UsersList, TYPE_REQUEST.POST, queryParam).then((value: any) => value)

  if (res?.code === 200 && res?.data?.pageLists.length) {
    res.data.pageLists.forEach(item => {
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

const handleClickBtn = (type: string) => {
  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break

    default:
      break
  }
}

// watch
watch(() => route.path, value => {
  // console.log(value)
}, { immediate: true })

// created
fectchListUsers(queryParam)
</script>

<template>
  <div
    v-if="isShowFilter"
    class="filter-action"
  >
    <CpPermisstionFilter />
  </div>
  <div>
    <CpHeaderAction
      is-delete
      :disabled-delete="disabledDelete"
      is-fillter
      @click="handleClickBtn"
    />
  </div>
  <div>
    <CmTable
      ref="TablePer"
      :headers="headers"
      :items="items"
      :total-record="totalRecord"
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
      </template>
    </CmTable>
  </div>
</template>

