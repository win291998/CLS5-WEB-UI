import { defineStore } from 'pinia'
import readXlsxFile from 'read-excel-file'
import type { Config } from '@/typescript/interface/import'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ObjectUtil from '@/utils/ObjectUtil'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

export const comboboxStore = defineStore('combobox', () => {
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

  const statuses = ref([])
  const organizations = ref([])
  const userType = ref([])
  const country = ref([])
  const provinces = ref([])
  const districts = ref([])
  const wards = ref([])

  /** method */
  // Lấy danh sách trạng thái người dùng
  const fetchStatusUsersCombobox = async () => {
    const params = { statusList: [1, 2, 3, 5] }
    const res = await MethodsUtil.requestApiCustom(ComboboxService.StatusUser, TYPE_REQUEST.POST, params).then((value: any) => value)

    if (res.code === 200) {
      statuses.value = res?.data?.map((item: any) => {
        return {
          ...item,
          value: t(item.value),
        }
      })
    }
  }

  // Lấy danh sách kiểu người dùng
  const fetchTypeUsersCombobox = async () => {
    const res = await MethodsUtil.requestApiCustom(ComboboxService.TypeUsers, TYPE_REQUEST.GET).then((value: any) => value)
    if (res.code === 200)
      userType.value = res?.data || []
  }

  // Lấy danh sách cơ cấu tổ chức
  const fetchTOrgStructCombobox = async () => {
    const res = await MethodsUtil.requestApiCustom(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)

    // const res = await fetchData(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)
    if (res.code === 200 && res.data)
      organizations.value = res?.data || []
  }

  // get country'
  const fetchCountry = async () => {
    await MethodsUtil.requestApiCustom(ComboboxService.Country, TYPE_REQUEST.GET).then((value: any) => {
      country.value = value.data
    })
  }

  // get provinces'
  const fetchProvinces = async (countryId: any) => {
    if (countryId === null) {
      provinces.value = []
    }
    else {
      const params = {
        countryId,
      }

      await MethodsUtil.requestApiCustom(ComboboxService.Provinces, TYPE_REQUEST.GET, params).then((value: any) => {
        provinces.value = value.data
      })
    }
  }

  // get districts'
  const fetchDistricts = async (provinceId: any) => {
    const params = {
      provinceId,
    }

    if (provinceId === null) { districts.value = [] }
    else {
      await MethodsUtil.requestApiCustom(ComboboxService.Districts, TYPE_REQUEST.GET, params).then((value: any) => {
        districts.value = value.data
      })
    }
  }

  // get wards'
  const fetchWards = async (districtId: any) => {
    const params = {
      districtId,
    }

    if (districtId === null) { wards.value = [] }
    else {
      await MethodsUtil.requestApiCustom(ComboboxService.Wards, TYPE_REQUEST.GET, params).then((value: any) => {
        wards.value = value.data
      })
    }
  }

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    organizations.value = []
  })

  const listTopicCourse = ref([])
  const getListTopicCourse = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ComboboxService.topicCourse, TYPE_REQUEST.GET)
    listTopicCourse.value = data
  }
  return {
    organizations,
    statuses,
    userType,
    country,
    provinces,
    districts,
    wards,
    fetchStatusUsersCombobox,
    fetchTypeUsersCombobox,
    fetchTOrgStructCombobox,
    fetchCountry,
    fetchDistricts,
    fetchProvinces,
    fetchWards,
    listTopicCourse,
    getListTopicCourse,
  }
})
