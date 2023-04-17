import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { useUserGroupStore } from './userTab'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/group-user/index'
import type { Params } from '@/typescript/interface/params'
import toast from '@/plugins/toast'

export const useStoreAddUser = defineStore('useStoreAddUser', () => {
  const route = useRoute()
  const { t } = window.i18n()
  interface QueryParamsModal extends Params {
    keyword: string
    roleId: number | null
    titles: string[] | null
    userRole: number | null
    excludeIds: number[] | null
    categoryTitleId: number[] | null
    groupId: number[] | null
    organizationalStructureId: number[] | null
  }
  const storeUserTab = useUserGroupStore()

  const queryParams = reactive<QueryParamsModal>({
    keyword: '',
    roleId: null,
    titles: null,
    userRole: null,
    excludeIds: storeUserTab.excludeIds,
    categoryTitleId: null,
    groupId: null,
    organizationalStructureId: null,
    pageNumber: 1,
    pageSize: 10,
    search: '',
  })
  const listId = ref([])
  const getUsersByStruce = async () => {
    const { data } = await MethodsUtil.requestApiCustom(`user/get-list-user-id-by-structure?id=${route.params.id}&typeId=1`)
    listId.value = data
  }
  getUsersByStruce()
  const listUser = ref([])
  const totalRecord = ref(0)
  const fetchDataModal = async () => {
    queryParams.excludeIds = listId.value
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListUserAdd, TYPE_REQUEST.POST, queryParams)
    listUser.value = data.pageLists
    totalRecord.value = data.totalRecord
  }

  // getData header modal add user
  const dataHeader = reactive({
    listGroupUser: [] as any[],
    listCategoryTitle: [] as any[],
    listTitle: [] as any[],
  })

  const getGroupUser = async () => {
    const payload = {
      groupId: Number(route.params.id),
    }
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.GroupUserCombobox, TYPE_REQUEST.GET, payload)
    dataHeader.listGroupUser = data
  }
  getGroupUser()

  const getCategoryTitle = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.CategoryTitleCombobox, TYPE_REQUEST.GET)
    dataHeader.listCategoryTitle = data
  }

  getCategoryTitle()
  const getTitle = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.TitleCombobox, TYPE_REQUEST.GET)
    const list: any[] = []
    data.forEach((element: string) => {
      list.push({
        key: element,
        value: element,
      })
    })
    dataHeader.listTitle = list
  }
  getTitle()

  // Xử lý thêm người dùng vào nhóm người dùng
  const dataUser = reactive({
    isCourse: false,
    isTraining: false,
    listUser: [],
  })
  const handleAddUser = () => {
    const list: any[] = []

    dataUser.listUser.forEach((element: any) => {
      list.push({ userId: element.id })
    })

    const payload = {
      ...dataUser,
      groupId: Number(route.params.id),
      listUser: list,
    }

    MethodsUtil.requestApiCustom(ApiGroupUser.AddUserGroup, TYPE_REQUEST.POST, payload).then(res => {
      toast('SUCCESS', t('calendar.add-user-success'))
      storeUserTab.getListUser()
    }).catch(() => {
      toast('SUCCESS', t('calendar.add-user-failed'))
    })
  }

  return { dataHeader, fetchDataModal, queryParams, listUser, totalRecord }
})
