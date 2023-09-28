<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import { useStoreAddUser } from '@/stores/admin/group-user/modalEditGroupUser'
import StringJwt from '@/utils/Jwt'
import CpSearch from '@/components/page/gereral/CpSearch.vue'

const props = withDefaults(defineProps<Props>(), ({
  customKey: 'listUserId',
  title: 'group-add',
  api: '',
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

const storeUser = useStoreAddUser()
const { dataHeader } = storeToRefs(storeUser)
interface Props {
  isShow: boolean
  title: string
  returnObject: boolean
  customKey: string
  api: string
  method: string
  params?: any
  payload?: any
}
interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'confirm', data: any): void
}

const route = useRoute()

const queryParams = reactive<any>({
  keyword: '',
  roleId: null,
  titles: '',
  userRole: StringJwt.getRole(),
  excludeIds: [],
  categoryTitleId: null,
  groupId: null,
  organizationalStructureId: null,
  pageNumber: 1,
  pageSize: 10,
  id: Number(route.params.id),
})
const listUser = ref<Any[]>([])
const totalRecord = ref<number>(0)
async function fetchDataModal() {
  let params
  if (!window._.isEmpty(props.payload)) {
    params = {
      ...props.payload,
      pageNumber: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      keyword: queryParams.keyword,
      excludeIds: queryParams.excludeIds,
      userRole: queryParams.userRole,
    }
  }
  else {
    params = {
      ...queryParams,
      ...props.params,
    }
  }
  const { data } = await MethodsUtil.requestApiCustom(props.api, props.method, params)
  listUser.value = data.pageLists
  totalRecord.value = data.totalRecord
}
watch(queryParams, val => {
  fetchDataModal()
})
function hidden() {
  emit('update:isShow', false)
}

const listItem = ref<any>([])
const headers = [
  { text: '', value: 'checkbox' },
  { text: t('user-group-name'), value: 'name' },
  { text: t('description'), value: 'description' },
]

async function confirm() {
  if (props.returnObject) {
    emit('confirm', { [props.customKey]: listItem.value })
  }
  else {
    const listId = listItem.value.map((item: Any) => item.id)
    emit('confirm', { [props.customKey]: listId })
  }
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="t(title)"
    size="lg"
    :disabled-ok="!listItem.length"
    @cancel="hidden"
    @confirm="confirm"
    @show="fetchDataModal"
  >
    <div class="d-flex justify-end mb-6">
      <div class="w-50 d-flex justify-end mb-6">
        <CpSearch
          v-model:key-search="queryParams.keyword"
        />
      </div>
    </div>
    <CmTable
      v-model:page-number="queryParams.pageNumber"
      v-model:selected="listItem"
      is-update-row-force
      :headers="headers"
      :items="listUser"
      :return-object="true"
      :total-record="totalRecord"
    />
  </CmDialogs>
</template>
