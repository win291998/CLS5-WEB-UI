<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), ({
  title: '',
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))
const CmButtonGroup = defineAsyncComponent(() => import('@/components/common/CmButtonGroup.vue'))
interface Props {
  title: string
}

interface Emit {
  (e: 'click', type: string): void
  (e: 'search', type: any): void
}

const router = useRouter()

const action = [{
  title: 'Xem chi tiết',
  icon: 'eye',

  // action: handleItem1,
  prependItem: {
    value: true,
  },
},
{
  title: 'Tải file',
  icon: 'download',

  // action: handleItem2,
  prependItem: {
    value: true,
    action: () => {
      //
    },
  },
},
{
  title: 'Tải file',
  icon: 'download',

  // action: handleItem2,
  prependItem: {
    value: true,
    action: () => { console.log(action) },
  },
},
{
  title: 'Chỉnh sửa',
  icon: 'edit',

  // action: showToast,
  prependItem: {
    value: true,
  },
}]

const handlerPreButton = () => {
  router.push({ name: 'admin-organization-users-profile-add', params: { tab: 'infor' } })
}
</script>

<template>
  <div class="d-flex justify-space-between my-8">
    <div class="text-medium-lg">
      Danh sách người dùng
    </div>
    <div class="d-flex">
      <div
        cols="12"
        md="3"
        class="d-flex justify-end pr-0"
      >
        <CmButton
          class="ml-3"
          variant="outlined"
          bg-color="bg-white"
          color="color-dark-300"
          text-color="color-dark"
        >
          {{ t('show-filter') }}
        </CmButton>
      </div>
      <div
        cols="12"
        md="3"
        class="d-flex justify-end pr-0"
      >
        <CmButton
          class="ml-3"
          variant="outlined"
          bg-color="bg-white"
          color="color-dark-300"
          text-color="color-dark"
        >
          {{ t('show-filter') }}
        </CmButton>
      </div>
      <div
        cols="12"
        md="3"
        class="d-flex justify-end  mr-2"
      >
        <CmButton
          class="ml-3"
          variant="outlined"
          bg-color="bg-white"
          color="color-dark-300"
          text-color="color-dark"
        >
          {{ t('show-filter') }}
        </CmButton>
      </div>
      <div
        cols="12"
        md="3"
        class="d-flex justify-end"
      >
        <CmButtonGroup
          is-load
          :list-item="action"
          :title="t('Add')"
          @click-prepend="handlerPreButton"
        >
          {{ t('common.save') }}
        </CmButtonGroup>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables/common/input.cm" as *;
@use "/src/styles/style-global" as *;

.header-action {
  &-field {
    inline-size: $input-min-width;
    max-inline-size: $input-min-width;

    // min-inline-size: $input-min-width;
  }
}
</style>
