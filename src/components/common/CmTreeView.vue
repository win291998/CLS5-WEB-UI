<script setup lang="ts">
import Treeview from 'vue3-treeview'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import 'vue3-treeview/dist/style.css'

interface Props {
  config?: Config
  nodes?: NodeTree
  isOrg: boolean
}
interface Emit {
  (e: 'nodeOpened', value: any): void
  (e: 'nodeClosed', value: any): void
  (e: 'nodeFocus', value: any): void
  (e: 'nodeToggle', value: any): void
  (e: 'nodeBlur', value: any): void
  (e: 'nodeEdit', value: any): void
  (e: 'nodeChecked', value: any): void
  (e: 'nodeUnchecked', value: any): void
  (e: 'nodeDragstart', value: any): void
  (e: 'nodeDragenter', value: any): void
  (e: 'nodeDragleave', value: any): void
  (e: 'nodeDragend', value: any): void
  (e: 'nodeOver', value: any): void
  (e: 'nodeDrop', value: any): void
}

interface Config {
  roots: Array<string>
  keyboardNavigation: boolean
  dragAndDrop: boolean
  checkboxes: boolean
  editable: boolean
  disabled: boolean
  padding: number
  checkMode: number
}
interface NodeTree {
  [NodeTree: string]: Node
}
interface Node {
  [x: string]: any
  text?: string
  children?: Array<string>
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  config: () => ({
    roots: [],
    keyboardNavigation: false,
    dragAndDrop: false,
    checkboxes: true,
    editable: false,
    disabled: false,
    padding: 0,
    checkMode: 0,
  }),
  nodes: () => (reactive({})),
  isOrg: true,

}))

const emit = defineEmits<Emit>()

const handleNodeOpened = (event: any) => {
  emit('nodeOpened', event)
}

const handleNodeClosed = (event: any) => {
  emit('nodeClosed', event)
}

const handleNodeFocus = (event: any) => {
  emit('nodeFocus', event)
}

const handleNodeToggle = (event: any) => {
  emit('nodeToggle', event)
}

const handleNodeBlur = (event: any) => {
  emit('nodeBlur', event)
}

const handleNodeEdit = (event: any) => {
  emit('nodeEdit', event)
}

const handleNodeChecked = (event: any) => {
  emit('nodeChecked', event)
}

const handleNodeUnchecked = (event: any) => {
  emit('nodeUnchecked', event)
}

const handleNodeDragstart = (event: any) => {
  emit('nodeDragstart', event)
}

const handleNodeDragenter = (event: any) => {
  emit('nodeDragenter', event)
}

const handleNodeDragleave = (event: any) => {
  emit('nodeDragleave', event)
}

const handleNodeDragend = (event: any) => {
  emit('nodeDragend', event)
}

const handleNodeOver = (event: any) => {
  emit('nodeOver', event)
}

const handleNodeDrop = (event: any) => {
  emit('nodeDrop', event)
}

const onChangeOrgChecked = (val: any, node: any) => {
  node.orgPermissionValue = val ? node.orgPermission : 0
  if (node.ids === 0) {
    // eslint-disable-next-line vue/no-mutating-props
    props.nodes[node.parent].orgPermissionValue += (val ? node.orgPermission : -node.orgPermission)

    return
  }
  node.children.forEach((childeNode: any) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.nodes[childeNode].orgPermissionValue = val ? props.nodes[childeNode].orgPermission : 0
  })
}
</script>

<template>
  <Treeview
    :config="props.config"
    :nodes="props.nodes"
    class="tree-view"
    @node-opened="handleNodeOpened"
    @node-closed="handleNodeClosed"
    @node-focus="handleNodeFocus"
    @node-toggle="handleNodeToggle"
    @node-blur="handleNodeBlur"
    @node-edit="handleNodeEdit"
    @node-checked="handleNodeChecked"
    @node-unchecked="handleNodeUnchecked"
    @node-dragstart="handleNodeDragstart"
    @node-dragenter="handleNodeDragenter"
    @node-dragleave="handleNodeDragleave"
    @node-dragend="handleNodeDragend"
    @node-over="handleNodeOver"
    @node-drop="handleNodeDrop"
  >
    <template
      v-if="isOrg"
      #after-input="{ node }"
    >
      <div
        v-if="node.orgPermission > 0"
        class="content-after"
      >
        <CmCheckBox
          tooltip-label="Phân quyền theo cơ cấu tổ chức"
          :model-value="node.orgPermissionValue
            && (node.orgPermissionValue & node.orgPermission) === node.orgPermission"
          :disabled="!(node.state?.checked || node.state?.indeterminate)"
          :indeterminate="!!(node.orgId
            && node.orgPermissionValue
            && node.orgPermissionValue < node.orgPermission)"
          @update:model-value="onChangeOrgChecked($event, node)"
        />
      </div>
    </template>
    <template #loading-slot>
      <div class="progress">
        <div class="indeterminate" />
      </div>
    </template>
  </Treeview>
</template>

<style lang="scss">
.content-after {
  position: absolute;
  z-index: 99;
  inset-block: 0;
  inset-inline-end: 0;
}

.tree-view {
  .tree-node {
    .node-wrapper {
      position: relative;
    }
  }
}
</style>

