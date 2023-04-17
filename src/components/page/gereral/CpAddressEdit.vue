<script setup lang="ts">
import { ActionType } from '@/constant/data/actionType.json'
import { comboboxStore } from '@/stores/combobox'
import { profileUserManagerStore } from '@/stores/admin/users/profile/profile'

// interface
interface Props {
  isDialogVisible: boolean
}

const props = withDefaults(defineProps<Props>(), ({
  isDialogVisible: false,
}))

const store = comboboxStore()
const { country, districts, provinces, wards } = storeToRefs(store)
const { fetchCountry, fetchDistricts, fetchProvinces, fetchWards } = store
const storeProfileUserManager = profileUserManagerStore()
const { accountInformation } = storeToRefs(storeProfileUserManager)
const CpModalAddress = defineAsyncComponent(() => import('../Admin/organization/users/profile/modal/CpModalAddress.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/**
 * data
 */
interface combobox {
  key: number
  value: string
}
interface Data {
  countries: combobox[]
  districts: combobox[]
  provinces: combobox[]
  wards: Array<any>
  address: any
  isShowModalAddress: boolean
}

const data = reactive<Data>({
  countries: [],
  districts: [],
  provinces: [],
  wards: [],
  address: reactive({
    countryName: '',
    districtName: '',
    provinceName: '',
    street: '',
    wardName: '',
    isShow: false,
  }),
  isShowModalAddress: false,
})

const actionItemEdit = (dataAction: any, index: any, dataResend?: any) => {
  console.log('edit', dataAction, index, dataResend)
}

const actionItemDelete = (dataAction: any, index: any, dataResend?: any) => {
  console.log('actionItemDelete', dataAction, index)
}

const addressName = (data: any) => {
  let countryName = null
  let provinceName = null
  let districtName = null
  let wardName = null
  const countries = dataInit.countries.filter(x => x.key === values.countryId)
  if (countries.length > 0)
    countryName = countries[0].value
  const province = dataInit.provinces.filter(x => x.key === values.provinceId)
  if (province.length > 0)
    provinceName = province[0].value
  const district = dataInit.districts.filter(x => x.key === values.districtId)
  if (district.length > 0)
    districtName = district[0].value
  const ward = dataInit.wards.filter(x => x.key === values.wardId)
  if (ward.length > 0)
    wardName = ward[0].value
  console.log(values)

  dataInit.address = {
    countryName,
    provinceName,
    districtName,
    wardName,
    street: values.street,
    isShow: true,
  }
  console.log(dataInit)
}

const action = [
  {
    title: t('common.action-table.update'),
    icon: ActionType[0].icon,
    action: actionItemEdit,
  },
  {
    title: t('common.delete'),
    icon: ActionType[1].icon,
    action: actionItemDelete,
  },
]

if (accountInformation.value.countryId != null) {
  await fetchCountry()
  if (accountInformation.value.provinceId != null) {
    await fetchProvinces(accountInformation.value.countryId)
    await fetchDistricts(accountInformation.value.provinceId)
    if (accountInformation.value.districtId) {
      await fetchDistricts(accountInformation.value.provinceId)
      await fetchWards(accountInformation.value.districtId)
    }
  }
}
addressName()
</script>

<template>
  <div>
    <VRow v-if="data.address && data.address?.isShow">
      <VCol
        cols="10"
      >
        <div class="addressStyle">
          {{ data?.address?.street }}
        </div>
      </VCol>
      <VCol
        cols="2"
      >
        <CmDropDown
          :list-item="action"
          custom-key="title"
          :type="1"
        />
      </VCol>
    </VRow>
    <BLink
      v-else
      class="cursor-pointer"
      @click="data.isShowModalAddress = true"
    >
      <VIcon
        icon="tabler:plus"
        size="16"
        class="color-primary mr-2"
      />
      <span class="color-primary  align-center">{{ $t('common.add') }}</span>
    </BLink>
    <CpModalAddress
      v-model:address="data.address"
      v-model:isDialogVisible="data.isShowModalAddress"
      :data-edit="data"
    />
  </div>
</template>

