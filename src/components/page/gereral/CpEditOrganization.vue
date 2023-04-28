<script setup lang="ts">
import ArraysUtil from '@/utils/ArrayUtil'
import ApiUser from '@/api/user/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringJwt from '@/utils/Jwt'

const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))
const { t } = window.i18n()
const config = reactive({
  roots: [] as any[],
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: true,
  editable: false,
  disabled: false,
  padding: 25,
})
const nodes = ref({})

const getRoleFeature = async () => {
  const res = await window.axios.get('/usertype/get-feature-permission-by-portal')
    .then((value: any) => value)
    .catch((error: any) => error)

  const result = ArraysUtil.formatTreeData(ArraysUtil.flatMapTree([res.data[0]], 'permissions'), config.roots, t)

  console.log('getRoleFeature:', ArraysUtil.flatMapTree([res.data[0]], 'permissions'))
  console.log(result)

  // nodes.value = reactive(result)
}
const getListOrgStruct = async () => {
  const params = {
    role: StringJwt.getRole(),
  }
  await MethodsUtil.requestApiCustom(ApiUser.GetOrganizationalStructure, TYPE_REQUEST.GET, params).then((value: any) => {
    // cấu hình dạng cây cho cơ cấu tổ chức
    const result = ArraysUtil.formatTreeData(ArraysUtil.unFlatMapTree(ArraysUtil.formatSelectTree(value.data, 'parentId', 'id')), config.roots, t, 'children')
    nodes.value = reactive(result)

    // Cấu hình node roots cho vue tree
    const filteredKeys = Object.keys(result).filter(key => result[key].parentId === 0)
    config.roots = filteredKeys
  })
}
getListOrgStruct()
getRoleFeature()
</script>

<template>
  <div class="page-containter-box">
    <CmTreeView
      :nodes="nodes"
      :config="config"
      custom-id="ids"
      :is-org="false"
      :type-flat-child="true"
    />
  </div>
</template>
