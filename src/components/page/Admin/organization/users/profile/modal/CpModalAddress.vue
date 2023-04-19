<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'

const props = withDefaults(defineProps<Props>(), ({
  isDialogVisible: false,
  dataEdit: () => ({
    countryId: null,
    districtId: null,
    provinceId: null,
    wardId: null,
    street: null,
    address: null,
  }),
}))

const emit = defineEmits<Emit>()

const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

/** ** Khởi tạo store */
const store = comboboxStore()
const { country, districts, provinces, wards } = storeToRefs(store)
const { fetchCountry, fetchDistricts, fetchProvinces, fetchWards } = store

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const dataInit = reactive<DataInit>({
  countries: [],
  districts: [],
  provinces: [],
  wards: [],
  street: null,
  address: null,
})

const myFormAddress = ref(null)

const DATA_LABEL = Object.freeze({
  TITLE: t('common.address'),
  COUNTRY: t('users.add-user.nation'),
  DISTRICT: t('users.add-user.district'),
  PROVINCEID: t('users.add-user.province-city'),
  WARDS: t('users.add-user.wards'),
  ADDRESS: t('users.add-user.street-name'),
})

/**
 * form
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm } = storeValidate

const schema = reactive<any>({
  companyName: schemaOption.requiredString,
  position: schemaOption.requiredString,
  dateStart: schemaOption.requiredString,
  dateFinish: schemaOption.requiredString,
})

const { values, setValues, resetForm } = useForm({
  validationSchema: schema,
  initialValues: ref(props.dataEdit),
})

/**
 *  method
 */
/** event dialog */
const onCancel = () => {
  emit('update:isDialogVisible', false)
}

const addAddress = () => {
  emit('update:address', values)
  emit('update:isDialogVisible', false)
}

const onConfirmation = () => {
  const form: any = myFormAddress.value
  if (form) {
    form.validate().then((success: any) => {
      console.log(success)
      if (success.valid) {
        console.log(success)
        addAddress()
      }

      console.log(values)
    })
  }
}

// interface
interface Props {
  isDialogVisible: boolean
  dataEdit: DataEdit
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:address', value: object): void
}
interface combobox {
  key: number
  value: string
}
interface DataInit {
  countries: combobox[]
  provinces: combobox[]
  districts: combobox[]
  wards: Array<any>
  street: any
  address: any
}
interface DataEdit {
  countryId: any
  provinceId: any
  districtId: any
  wardId: any
  street: any
  address: any
}

const handleChangeCountry = async (countryId: any) => {
  console.log(countryId)
  await fetchProvinces(countryId)
  dataInit.provinces = provinces.value
  dataInit.districts = []
  dataInit.wards = []
  values.provinceId = null
  values.districtId = null
  values.wardId = null
  values.street = null
}

const handleChangeProvinces = async (provinceId: any) => {
  console.log(provinceId)
  await fetchDistricts(values.provinceId)

  dataInit.districts = districts.value
  dataInit.wards = []
  values.districtId = null
  values.wardId = null
  values.street = null
}

const handleChangeDistrict = async (districtId: any) => {
  console.log(districtId)
  await fetchWards(districtId)

  dataInit.wards = wards.value
  values.wardId = null
  values.street = null
}

onMounted(async () => {
  if (window._.isEmpty(country.value))
    await fetchCountry()

  dataInit.countries = country.value
})
</script>

<template>
  <CmDialogs
    :is-dialog-visible="isDialogVisible"
    :title="DATA_LABEL.TITLE"
    persistent
    @cancel="onCancel"
    @confirm="onConfirmation"
  >
    <Form ref="myFormAddress">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Quốc gia -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.countryId"
              name="countryId"
            >
              <CmSelect
                :field="field"
                :model-value="values.countryId"
                :text="DATA_LABEL.COUNTRY"
                :placeholder="DATA_LABEL.COUNTRY"
                :items="dataInit.countries"
                item-value="key"
                custom-key="value"
                @update:modelValue="handleChangeCountry"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Tỉnh thành phố -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.provinceId"
              name="provinceId"
            >
              <CmSelect
                :field="field"
                :model-value="values.provinceId"
                :text="DATA_LABEL.PROVINCEID"
                :placeholder="DATA_LABEL.PROVINCEID"
                :items="dataInit.provinces"
                item-value="key"
                custom-key="value"
                @update:modelValue="handleChangeProvinces"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Quận huyện -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.districtId"
              name="districtId"
            >
              <CmSelect
                :field="field"
                :model-value="values.districtId"
                :text="DATA_LABEL.DISTRICT"
                :placeholder="DATA_LABEL.DISTRICT"
                :items="dataInit.districts"
                item-value="key"
                custom-key="value"
                @update:modelValue="handleChangeDistrict"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- Phường/xã -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.wardId"
              name="wardId"
            >
              <CmSelect
                :field="field"
                :model-value="values.wardId"
                :text="DATA_LABEL.WARDS"
                :placeholder="DATA_LABEL.WARDS"
                :items="dataInit.wards"
                item-value="key"
                custom-key="value"
              />
            </Field>
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <!-- tên đường -->
          <div>
            <Field
              v-slot="{ field }"
              v-model="values.street"
              name="street"
            >
              <CmTextField
                :field="field"
                :text="DATA_LABEL.ADDRESS"
                :placeholder="DATA_LABEL.ADDRESS"
              />
            </Field>
          </div>
        </VCol>
      </VRow>
    </Form>
  </CmDialogs>
</template>
