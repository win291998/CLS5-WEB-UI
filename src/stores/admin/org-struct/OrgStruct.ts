import { defineStore } from 'pinia'
import MethodsUtil from '@/utils/MethodsUtil'
import { validatorStore } from '@/stores/validatator'
import { comboboxStore } from '@/stores/combobox'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'

export const orgStructManagerStore = defineStore('orgStructManager', () => {
  /**
   * store
   */
  const storeCombobox = comboboxStore()
  const { ownerCombobox } = storeToRefs(storeCombobox)
  const { getComboboxOwner } = storeCombobox

  /**
 * lib
 */
  const route = useRoute()
  const router = useRouter()
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  /**
   * data
   */
  const initValue = ref({
    id: undefined,
    code: null,
    name: null,
    ownerId: null,
    managementId: 1,
    parentId: null as null | number,
    description: '',
  })
  const organization = ref({
    id: undefined,
    code: null,
    name: null,
    ownerId: null,
    managementId: 1,
    parentId: null as null | number,
    description: '',
  })
  const vSelectOwner = ref<any>({
    listCombobox: [],
    totalRecord: 0,
    pageNumber: 1,
    pageSize: 30,
    search: '',
    excludeList: [],
    itemSelected: {} as any,
  })
  const myFormAddInforOrg = ref()
  const isEdit = ref(false)
  const idOrg = ref()
  const resetForm = () => {
    idOrg.value = null
    isEdit.value = false
    console.log(myFormAddInforOrg.value)

    if (myFormAddInforOrg.value)
      myFormAddInforOrg.value.resetForm()
    organization.value = window._.cloneDeep(initValue.value)
  }
  const getComboboxOwnerInf = async (loadMore?: any) => {
    console.log(loadMore)

    // loadMore dùng khi infinity scroll
    console.log(vSelectOwner.value)

    if (vSelectOwner.value) {
      await getComboboxOwner(vSelectOwner.value).then((value: any) => {
        if (ownerCombobox.value.data?.length) {
          vSelectOwner.value.totalRecord = ownerCombobox.value.totalRecord
          if (loadMore)
            vSelectOwner.value.listCombobox = vSelectOwner.value.listCombobox.concat(ownerCombobox.value.data)

          else
            vSelectOwner.value.listCombobox = ownerCombobox.value?.data

          if (vSelectOwner.value.itemSelected?.id && !loadMore) {
            const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item?.id === vSelectOwner.value.itemSelected.id)
            if (indexOwner === -1) {
              vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value?.itemSelected)
              vSelectOwner.value.excludeList = [vSelectOwner.value?.itemSelected.id]
            }
          }
        }

        else {
          vSelectOwner.value.listCombobox = []
          vSelectOwner.value.totalRecord = 0
        }
      })
    }
  }
  const getInforOrgById = async () => {
    const params = {
      organizationalStructureId: idOrg.value,
    }
    await MethodsUtil.requestApiCustom(ApiUser.GetOrgById, TYPE_REQUEST.GET, params).then(async (value: any) => {
      console.log(value)
      if (value.data.parentId === 0)
        value.data.parentId = null
      if (value.data?.ownerId) {
        vSelectOwner.value.excludeList = [value.data?.ownerId]
        console.log([value.data?.ownerId])

        await MethodsUtil.searchUserInfoByIds([value.data?.ownerId]).then((users: any) => {
          if (users?.pageLists.length) {
            const indexOwner = vSelectOwner.value.listCombobox.findIndex((item: any) => item.id === vSelectOwner.value.itemSelected.id)
            if (indexOwner === -1)
              vSelectOwner.value.listCombobox.splice(0, 0, vSelectOwner.value.itemSelected)
          }
          else {
            vSelectOwner.value.itemSelected.id = null
            value.data.ownerId = null
          }
        })
      }
      console.log(value.data)

      organization.value = value.data
    })
  }

  // thêm mới
  const addOrganizational = async (isUpdate: any) => {
    const params = (({ code, name, parentId, ownerId, description }) => ({
      code, name, parentId, ownerId, description,
    }))(organization.value)
    if (params.parentId === null)
      params.parentId = 0
    console.log(params, isUpdate)

    await MethodsUtil.requestApiCustom(ApiUser.PostOrgCreate, TYPE_REQUEST.POST, organization.value)
      .then(async (value: any) => {
        if (value.code === 200) {
          console.log(value)
          if (isUpdate === false) { router.push({ name: 'admin-organization-org-struct-list', query: { navigateFrom: value.data } }) }
          else {
            window.showAllPageLoading('COMPONENT')
            router.push({ name: 'admin-organization-org-struct-edit', params: { tab: 'infor', id: value.data } })
            isEdit.value = true
            idOrg.value = value.data
            await getInforOrgById()
            window.hideAllPageLoading()
          }
          toast('SUCCESS', t('add-success'))
          resetForm()
        }
      })
      .catch((error: any) => {
        console.log(error)

        toast('ERROR', t(error.message))
      })
  }

  // Cập nhật cơ cấu tổ chức
  const updateOrganizational = async () => {
    const params = (({
      code, id, name, parentId, ownerId, description,
    }) => ({
      code, id, name, parentId, ownerId, description,
    }))(organization.value)
    if (params.parentId === null)
      params.parentId = 0

    await MethodsUtil.requestApiCustom(ApiUser.PostOrgUpdate, TYPE_REQUEST.POST, params).then((value: any) => {
      if (value.code === 200) {
        window.showAllPageLoading('COMPONENT')
        router.push({ name: 'admin-organization-org-struct-list', query: { navigateFrom: organization.value.id } })
        window.hideAllPageLoading()
      }
      toast('SUCCESS', t('USR_UpdateSuccess'))
    })
      .catch((error: any) => {
        toast('ERROR', t(error.message))
      })
  }
  return {
    idOrg,
    organization,
    myFormAddInforOrg,
    vSelectOwner,
    isEdit,
    getComboboxOwnerInf,
    getInforOrgById,
    addOrganizational,
    updateOrganizational,
    resetForm,
  }
})
