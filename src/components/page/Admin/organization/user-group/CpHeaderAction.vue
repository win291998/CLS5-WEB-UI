<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({}))
const emit = defineEmits<Emit>()
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
interface Props {
  titlePage: string
  buttonAdd: string
  buttonExcel: string
}
interface Emit {
  (e: 'update:keySearch', key: string): void
}

const listItemButtonGroup = [
  {
    title: 'Thêm từ tập tin',
    icon: 'file-plus',
    key: 'importFile',
  },
  {
    title: 'Thêm người dùng từ tập tin',
    icon: 'file-plus',
    key: 'importFileUser',
  },
]

const router = useRouter()

const showAddGroup = () => {
  router.push({ name: 'admin-organization-user-groups-add' })
}

// Tìm kiếm
const timer = ref<any>(null)

const handleSearch = (val: string) => {
  if (timer) {
    clearTimeout(timer.value)
    timer.value = null
  }
  timer.value = setTimeout(() => {
    console.log('setTimeout')
    emit('update:keySearch', val)
  }, 500)
}
</script>

<template>
  <VRow>
    <VCol>
      <h3>{{ props.titlePage }}</h3>
    </VCol>
    <VCol class="d-flex justify-end">
      <CmButton
        :title="props.buttonExcel"
        icon="tabler:download"
        variant="text"
        color="primary"
      />
      <CmButtonGroup
        :title="props.buttonAdd"
        color="primary"
        class="ml-1"
        :list-item="listItemButtonGroup"
        @click-prepend="showAddGroup"
      />
    </VCol>
  </VRow>

  <VRow class="mr-1">
    <VCol>
      <CmButton
        icon="tabler:trash"
        color="error"
        size="40"
        :size-icon="18"
        class="d-flex align-middle justify-center"
      />
    </VCol>
    <VCol class="d-flex justify-end pr-0">
      <CmTextField
        label="Tìm kiếm"
        class="header-action-field"
        placeholder="Tìm kiếm"
        prepend-inner-icon="tabler-search"
        @update:model-value="handleSearch"
      />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@/styles/variables/common/input.cm" as *;

.header-action {
  &-field {
    inline-size: $input-min-width;
    max-inline-size: $input-min-width;

    // min-inline-size: $input-min-width;
  }
}
</style>
