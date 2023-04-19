import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/group-user/index'
import type { Params } from '@/typescript/interface/params'
import toast from '@/plugins/toast'

export const useUserGroupStore = defineStore('useUserGroupStore', () => {
  const route = useRoute()
  const { t } = window.i18n()
  interface QueryParams extends Params {
    groupId: number
  }
  const queryParams = reactive<QueryParams>({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    groupId: Number(route.params.id),
  })

  const listUserInGroup = ref([])
  const totalRecord = ref(0)
  const getListUser = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListUser, TYPE_REQUEST.GET, queryParams)
    listUserInGroup.value = data.pageLists
    totalRecord.value = data.totalRecord
  }

  getListUser()
  const excludeIds = computed(() => {
    return listUserInGroup.value.map((e: any) => e.userId)
  })

  // Chuyển người dùng sang nhóm khác
  interface DataMove {
    currentGroup: number | null
    isTotal: boolean | null
    newGroup: number | null
    userIds: number[]
  }
  const dataMove = reactive<DataMove>({
    currentGroup: null,
    isTotal: null,
    newGroup: null,
    userIds: [],
  })
  const moveUser = (val: any) => {
    let status = false
    MethodsUtil.requestApiCustom(ApiGroupUser.MoveUser, TYPE_REQUEST.PUT).then((res: any) => {
      toast('SUCCESS', t('calendar.add-user-success'))
    }).catch((e: any) => {
      toast('SUCCESS', t('calendar.add-user-failed'))
      status = true
    })
    return status
  }

  const deleteItem = (val: any) => {
    //
  }

  return { queryParams, listUserInGroup, totalRecord, getListUser, moveUser, deleteItem, excludeIds, dataMove }
})
