<script setup lang="ts">
import ArraysUtil from '@/utils/ArrayUtil'

const CmTreeView = defineAsyncComponent(() => import('@/components/common/CmTreeView.vue'))

const config = reactive({
  roots: ['node-1'],
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: true,
  editable: false,
  disabled: false,
  padding: 25,
  checkMode: 0,
})
const modeBool = ref(true)
const nodes = ref({})
const changeMode = () => {
  modeBool.value = !modeBool.value
  config.checkMode = modeBool.value ? 0 : 1
}

const getRoleFeature = async () => {
  const res = await window.axios.get('/usertype/get-feature-permission-by-portal')
    .then((value: any) => value)
    .catch((error: any) => error)

  const result = ArraysUtil.formatTreeData(ArraysUtil.flatMapTree([res.data[0]], 'permissions'), config.roots)

  nodes.value = reactive(result)
}

getRoleFeature()
</script>

<template>
  <div class="page-containter-box">
    <CmTreeView
      :nodes="nodes"
      :config="config"
      :is-org="false"
    />
  </div>
</template>
