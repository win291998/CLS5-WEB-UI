<script setup lang="ts">
import CmTreeView from '@/components/common/CmTreeView.vue'
import ArraysUtil from '@/utils/ArrayUtil'

const modeBool = ref(true)
const { t } = window.i18n()

const config = reactive({
  roots: ['node-1'],
  keyboardNavigation: false,
  dragAndDrop: false,
  checkboxes: true,
  editable: false,
  disabled: false,
  padding: 25,
  checkMode: 0,
  openedIcon: {
    style: 'font-size: 18px; height: 18px; width: 18px;',
    type: 'shape',
    width: '32',
    fill: 'currentColor',
    height: '32',
    stroke: 'black',
    viewBox: '0 0 24 24',
    draw: 'M12 14.975q-.2 0-.388-.075t-.312-.2l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z',
  },
  closedIcon: {
    style: 'font-size: 18px; height: 18px; width: 18px;',
    type: 'shape',
    stroke: 'black',
    fill: 'currentColor',
    width: '32',
    height: '32',
    viewBox: '0 0 24 24',
    draw: 'M8.7 17.3q-.275-.275-.275-.7t.275-.7l3.9-3.9l-3.9-3.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375q0 .2-.063.375t-.212.325l-4.6 4.6q-.275.275-.7.275t-.7-.275Z',
  },
})

const nodes = ref({})

const changeMode = () => {
  modeBool.value = !modeBool.value
  config.checkMode = modeBool.value ? 0 : 1
}

const getRoleFeature = async () => {
  const res = await window.axios.get('/usertype/get-feature-permission-by-portal')
    .then((value: any) => value)
    .catch((error: any) => error)
  const result = ArraysUtil.formatTreeData(ArraysUtil.flatMapTree([res.data[0]], 'permissions'), config.roots, t)
  nodes.value = reactive(result)
}

getRoleFeature()
</script>

<template>
  <p>
    <label for="showCheckBoxes">Checkboxes</label>
    <input
      id="showCheckBoxes"
      v-model="config.checkboxes"
      type="checkbox"
    >

    <label for="padding"> | Padding</label>
    <input
      id="padding"
      v-model.number="config.padding"
      type="number"
    >

    <label for="editable"> | Editable</label>
    <input
      id="editable"
      v-model="config.editable"
      type="checkbox"
    >

    <label for="disabled"> | Disabled</label>
    <input
      id="disabled"
      v-model="config.disabled"
      type="checkbox"
    >

    <label for="keyboardNavigation"> | Keyboard Navigation</label>
    <input
      id="keyboardNavigation"
      v-model="config.keyboardNavigation"
      type="checkbox"
    >

    <label for="DragandDrop"> | DragandDrop</label>
    <input
      id="DragandDrop"
      v-model="config.dragAndDrop"
      type="checkbox"
    >

    <label for="checkMode"> | Checkmode auto bach</label>
    {{ modeBool }}
    <input
      id="checkMode"
      v-model="modeBool"
      type="checkbox"
      @input="changeMode"
    >
  </p>

  <CmTreeView
    :nodes="nodes"
    :config="config"
    is-org
  />
</template>

