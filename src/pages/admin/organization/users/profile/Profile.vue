<script setup lang="ts">
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmRadioGroup = defineAsyncComponent(() => import('@/components/common/CmRadioGroup.vue'))
const CpUserProfileAvatarEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpUserProfileAvatarEdit.vue'))
const CpFormModifyUserInfor = defineAsyncComponent(() => import('@/components/page/Admin/organization/users/profile/CpFormModifyUserInfor.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const src = ref('https://sfv4.cloudlms.top/DataFile/2023/4/3/kinhdoanh/6509/Image/fol-sfv4-kssjt7OiJC/origin.png')

const dataForm: any = ref({})

const optionSex = ref([
  { label: 'nam', value: 0 },
  { label: 'nữ', value: 1 },
])
</script>

<template>
  <div>
    User profile
  </div>

  <VForm v-model="dataForm">
    <VRow class="my-3">
      <VCol
        cols="12"
        md="2"
      >
        <CpUserProfileAvatarEdit
          v-model:src="src"
          :tooltip="t('system-management.100x100')"
        />
      </VCol>
      <VCol
        cols="12"
        md="10"
        class="d-flex align-center"
      >
        <CmRadioGroup :option="optionSex" />
      </VCol>
    </VRow>
    <VRow class="my-3">
      <CpFormModifyUserInfor />
    </VRow>
  </VForm>
</template>

