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

  const combobox = reactive({
    statuses: [],
    organizations: [],
    userType: [],
  })

  /** method */
  // Lấy danh sách trạng thái người dùng
  const fetchStatusUsersCombobox = async () => {
    const params = { statusList: [1, 2, 3, 5] }
    const res = await MethodsUtil.requestApiCustom(ComboboxService.StatusUser, TYPE_REQUEST.POST, params).then((value: any) => value)

    if (res.code === 200) {
      combobox.statuses = res?.data?.map((item: any) => {
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
      combobox.userType = res?.data || []
  }

  // Lấy danh sách cơ cấu tổ chức
  const fetchTOrgStructCombobox = async () => {
    const res = await MethodsUtil.requestApiCustom(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)

    // const res = await fetchData(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)
    if (res.code === 200 && res.data)
      combobox.organizations = res?.data || []
    console.log(combobox)
  }

  return { combobox, fetchStatusUsersCombobox, fetchTypeUsersCombobox, fetchTOrgStructCombobox }
})