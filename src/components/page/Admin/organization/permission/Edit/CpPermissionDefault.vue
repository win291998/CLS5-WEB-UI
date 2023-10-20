<script lang="ts" setup>
import CmTreeView from '@/components/common/CmTreeView.vue'

interface Props {
  listFeaturePermission: any[]
}
interface Emit {
  (e: 'update:listFeature', data: any): void
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
function config(idx: number) {
  return {
    roots: [`node-p${idx + 1}`],
    keyboardNavigation: false,
    dragAndDrop: false,
    checkboxes: true,
    editable: false,
    disabled: false,
    padding: 25,
    checkMode: 0,
  }
}

function handleChecked(node: any, idx: number) {
  if (node.children && node.children.length) {
    //
    node.permissionValue = node.permission
  }
  else {
    // eslint-disable-next-line vue/no-mutating-props
    props.listFeaturePermission[idx][node.parent].permissionValue += node.permission
  }
}

function handleUnChecked(node: any, idx: number) {
  if (node.children && node.children.length) {
    //
    node.permissionValue = 0
  }
  else {
    // eslint-disable-next-line vue/no-mutating-props
    props.listFeaturePermission[idx][node.parent].permissionValue -= node.permission
  }
}
</script>

<template>
  <div class="edit-permission">
    <VRow
      class="permission"
    >
      <VCol
        v-for="(tree, index) in listFeaturePermission"
        :key="index"
        xs="12"
        sm="12"
        md="6"
        lg="4"
        xl="4"
      >
        <div class="content-permission">
          <CmTreeView
            :config="config(index)"
            :nodes="tree"
            @node-checked="handleChecked($event, index)"
            @node-unchecked="handleUnChecked($event, index)"
          />
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;

.edit-permission {
  .permission {
    display: flex;
    width: 100%;

    .content-permission {
      width: inherit;
      height: 100%;
      padding: 24px;

      // Gray 200

      border: 1px solid $color-gray-200;
      border-radius: var(--v-border-radius-xs);
      box-shadow: 0 4px 8px -2px rgba(16, 24, 40, 10%), 0 2px 4px -2px rgba(16, 24, 40, 6%);
    }

    .content-permission:nth-child(n+2) {
      // margin-left: 24px;
    }
  }

  .button-edit-permission:nth-child(n+2) {
    margin-left: 12px;
  }
}
</style>
