<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  headers: _ => [],
  items: _ => [],
  totalRecord: _ => 0,
  listId: _ => [],
  dataDetail: null,
  tootlipEdit: '',
  tootlipDelete: '',
  tootlipReport: '',
}))

const emit = defineEmits<Emit>()
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
interface Props {
  headers: any[]
  items: any[]
  totalRecord: number
  pageNumber: number
  listId: any[]
  dataDetail: any
  tootlipEdit: string
  tootlipDelete: string
  tootlipReport: string
}

interface Emit {
  (e: 'update:dataDetail', data: any): void
  (e: 'update:listId', data: any): void
  (e: 'update:pageNumber', data: any): void
}

const getDetail = (val: any) => {
  emit('update:dataDetail', val)
}

const deleteItem = (val: any) => {
  emit('update:dataDetail', val)
}

const selectedRows = (e: any) => {
  emit('update:listId', e)
}

const selectedAll = (e: any) => {
  const listId = props.items.map((e: any) => e.id)

  emit('update:listId', listId)
}

const handlePageClick = (e: any) => {
  emit('update:pageNumber', e)
}
</script>

<template>
  <CmTable
    :headers="headers"
    :items="items"
    :total-record="totalRecord"
    @selectedRows="selectedRows"
    @checked-all="selectedAll"
    @handlePageClick="handlePageClick"
  >
    <template #rowItem="{ col, context }">
      <span v-if="col === 'name'">
        <span
          v-if="context.code"
          class="text-primary mr-1"
        >{{ context.code }}</span>
        <span>{{ context.name }}</span>
      </span>
    </template>
    <template #actions="{ data }">
      <div
        class="px-2 "
      >
        <VIcon
          icon="tabler:chart-pie-2"
          :size="18"
          class="align-middle color-success"
          @click="getDetail(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ props.tootlipReport }}
        </VTooltip>
      </div>
      <div
        class="px-2 "
      >
        <VIcon
          icon="mdi-pencil"
          :size="18"
          class="align-middle color-primary"
          @click="getDetail(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ props.tootlipEdit }}
        </VTooltip>
      </div>
      <div
        class="px-2 "
      >
        <VIcon
          icon="fe:trash"
          :size="18"
          class="align-middle color-error"
          @click="deleteItem(data)"
        />
        <VTooltip
          activator="parent"
          location="top"
        >
          {{ props.tootlipDelete }}
        </VTooltip>
      </div>
    </template>
  </CmTable>
</template>
