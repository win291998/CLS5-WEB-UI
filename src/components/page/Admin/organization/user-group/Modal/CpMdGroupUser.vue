<script lang="ts" setup>
import CpHeaderMdGroupUser from './CpHeaderMdGroupUser.vue'
import CmDialogs from '@/components/common/CmDialogs.vue'
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import { useStoreAddUser } from '@/stores/admin/group-user/addUser'

const props = withDefaults(defineProps<Props>(), ({}))

const emit = defineEmits<Emit>()

const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))

const { t } = window.i18n()
interface Props {
  isShow: boolean
  title: string
}
interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'update:dataUser', data: any): void
}

const store = useStoreAddUser()
const { dataHeader, listUser, totalRecord, queryParams } = storeToRefs(store)
const { fetchDataModal } = store
watch(queryParams.value, val => {
  fetchDataModal()
})
const hidden = (val: any) => {
  emit('update:isShow', false)
}

const dataUser = reactive<any>({
  isCourse: false,
  isExam: false,
  isTraining: false,
  listUser: [],
})

// const selectedAll = (e: any) => {
//   dataUser.listUser = props.items
// }

// const selectedRows = (val: any[]) => {
//   dataUser.listUser = val
// }

const listItem = ref<any>([])

const headers = [
  { text: '', value: 'checkbox' },
  { text: t('common.user-name'), value: 'name', type: 'custom' },
  { text: t('email'), value: 'email' },
  { text: '', value: 'actions', width: 150 },
]

const confirm = (val: any) => {
  emit('update:dataUser', dataUser)
}
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="title"
    size="xl"
    :disabled-ok="!dataUser.listUser.length"
    @update:is-dialog-visible="hidden"
    @confirm="confirm"
    @show="fetchDataModal"
  >
    <template #content>
      <CpHeaderMdGroupUser
        v-model:is-course="dataUser.isCourse"
        v-model:is-training="dataUser.isTraining"
        v-model:keyword="store.queryParams.keyword"
        v-model:exclude-ids="store.queryParams.excludeIds"
        v-model:category-title-id="store.queryParams.categoryTitleId"
        v-model:group-id="store.queryParams.groupId"
        v-model:organizational-structure-id="store.queryParams.organizationalStructureId"
        v-model:titles="store.queryParams.titles"
        v-model:page-number="store.queryParams.pageNumber"
        v-bind="dataHeader"
      />

      <CmTable
        v-model:page-number="store.queryParams.pageNumber"
        v-model:selected-rows="listItem"
        :headers="headers"
        :items="listUser"
        :return-object="true"
        :total-record="totalRecord"
      >
        <!--
          @selectedRows="selectedRows"
          @checked-all="selectedAll"
        -->
        <template #rowItem="{ col, context }">
          <div v-if="col === 'name'">
            <CpCustomInfo
              :context="context"
              :is-show-code="false"
              :is-show-email="false"
            />
          </div>
        </template>
      </CmTable>
    </template>
  </CmDialogs>
</template>
