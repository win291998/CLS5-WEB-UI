<script lang="ts" setup>
import CpCustomInfo from '@/components/page/gereral/CpCustomInfo.vue'
import { useStoreAddCourse } from '@/stores/admin/group-user/modal'

const props = withDefaults(defineProps<Props>(), ({}))

const emit = defineEmits<Emit>()
const store = useStoreAddCourse()
const { t } = window.i18n()
const { listCourse, totalRecord, queryParams } = storeToRefs(store)
const { fetchData, handleAddCourse } = store
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
console.log(listCourse)

interface Emit {
  (e: 'update:isShow', data: boolean): void
  (e: 'update:dataCourse', data: any): void
}
interface Props {
  isShow: boolean
  title: string
}
const hidden = (val: any) => {
  emit('update:isShow', false)
}
const confirm = () => {
  //
}

const headers = [
  { text: '', value: 'checkbox' },
  { text: t('common.course-name'), value: 'name', type: 'custom' },
  { text: t('topic'), value: 'email' },
]
</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="title"
    size="xl"
    @cancel="hidden"
    @confirm="confirm"
    @show="fetchData"
  >
    <CmTable
      v-model:page-number="store.queryParams.pageNumber"
      v-model:selected="store.dataCourse.listCourse"
      :headers="headers"
      :items="listCourse"
      :return-object="true"
      :total-record="totalRecord"
    >
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
  </CmDialogs>
</template>

