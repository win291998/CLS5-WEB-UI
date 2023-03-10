<script setup lang="ts">
import CmSelectTree from '@/components/common/CmSelectTree.vue'

const options = [{
  id: 'a',
  label: 'a',
  children: [{
    id: 'aa',
    label: 'aa',
    customLabel: 'Custom Label aaa',
  }, {
    id: 'ab',
    label: 'ab',
  }],
}, {
  id: 'success',
  label: 'b',
}, {
  id: 'c',
  label: 'c',
}]

const treeModel = ref<Array<any>>([])

const handleChangeSelect = () => {
  treeModel.value = ['c']

  // console.log(treeModel)
}
</script>

<template>
  <div>
    <CmSelectTree
      v-model="treeModel"
      :options="options"
      placeholder="Select your favourite(s)..."
      value-format="id"
      multiple
    />
    <button @click="handleChangeSelect">
      click
    </button>
  </div>
</template>

