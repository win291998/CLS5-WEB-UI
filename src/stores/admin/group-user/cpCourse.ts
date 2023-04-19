import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/group-user/index'
import type { Params } from '@/typescript/interface/params'

export const useCourseGroupStore = defineStore('useCourseGroupStore', () => {
  const route = useRoute()
  interface QueryParams extends Params {
    id: number
  }
  const queryParams = reactive<QueryParams>({
    search: '',
    pageNumber: 1,
    pageSize: 10,
    id: Number(route.params.id),
  })

  const listUserInGroup = ref([])
  const totalRecord = ref(0)
  const getListUser = async () => {
    const { data } = await MethodsUtil.requestApiCustom(ApiGroupUser.ListCourse, TYPE_REQUEST.GET, queryParams)
    listUserInGroup.value = data.pageLists
    totalRecord.value = data.totalRecord
  }
  if (!listUserInGroup.value.length)
    getListUser()

  const excludeIds = computed(() => {
    return listUserInGroup.value.map((e: any) => e.userId)
  })
  const moveUser = (val: any) => {
    //
  }

  const deleteItem = (val: any) => {
    //
  }

  return { queryParams, listUserInGroup, totalRecord, getListUser, moveUser, deleteItem, excludeIds }
})
