<script lang="ts" setup>
import type { Header, Item } from 'vue3-easy-data-table'
import CpTablePermission from '@/components/page/Admin/organization/permission/CpTablePermission.vue'
import type { Params } from '@/typescript/interface/params'
import CpHeaderAction from '@/components/page/Admin/organization/user-group/CpHeaderAction.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
interface HeaderPermission extends Header {
  type?: string
}
interface ParamsPermission extends Params {
  keyword: string
}
const params = ref<ParamsPermission>({
  pageNumber: 1,
  pageSize: 10,
  keyword: '',
})
const headers = ref<HeaderPermission[]>([
  { text: '', value: 'checkbox' },
  { text: t('userTypeName'), value: 'userTypeName' },
  { text: t('Administrator'), value: 'administrator', type: 'custom' },
  { text: t('Teacher'), value: 'teacher', type: 'custom' },
  { text: t('Learner'), value: 'learner', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const router = useRouter()
const items = reactive<Item[]>([
  {
    id: 3,
    roleValue: 7,
    userTypeName: 'Administrator',
  },
  {
    id: 3,
    roleValue: 3,
    userTypeName: 'Administrator',
  },
  {
    id: 3,
    roleValue: 5,
    userTypeName: 'Administrator',
  },
  {
    id: 3,
    roleValue: 6,
    userTypeName: 'Administrator',
  },
])
const totalRecord = ref<number>(0)

// Chuyển trang thêm quyền
const addPermission = () => {
  console.log(123)

  router.push({ name: 'admin-organization-permission-add' })
}
</script>

<template>
  <CpHeaderAction
    title-page="Danh sách kiểu người dùng"
    :is-show-move="false"
    :is-show-add-group="false"
    button-add="Thêm mới"
    button-prepend="Xuất excel"
    @click-add="addPermission"
  />
  <CpTablePermission
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
  />
</template>

