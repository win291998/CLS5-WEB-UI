<script setup lang="ts">
import CmCheckBox from './CmCheckBox.vue'

/**
 * listItem: danh sách các item
 * item: {
 *  title: tiêu đề,
 *  icon: icon,
 *  colorClass: màu của item
 *  action: function truyền xuống
 *  appendItem: phần sau của item có thể hiển thị cả icon lẫn title
 *  prependItem: checkbox của từng item
 * }
 */

interface Props {
  listItem: item[]
  icon: string
  multiple?: boolean
}
interface item {
  title: string
  icon?: string
  colorClass?: string
  action?: any
  appendItem?: appendItem
  prependItem?: prependItem
}
interface appendItem {
  icon?: string
  title?: string
}
interface prependItem {
  isShow: boolean
  isDisabled: boolean
  value: boolean
  action: any
}

const propsValue = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
  icon: 'more-vertical',
  checkbox: true,
  multiple: false,
}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'change', data: any): void
}

const handleChange = (event: any) => {
  emit('change', event)
}

const handleClickItem = (event: any) => {
  if (propsValue.multiple)
    event.stopPropagation()
}
</script>

<template>
  <div class="text-center cm-drop-down">
    <VMenu
      class="cursor-pointer"
      @update:model-value="handleChange"
    >
      <template #activator="{ props }">
        <div v-bind="props">
          <VueFeather
            v-bind="props"
            :type="propsValue.icon"
            :size="18"
          />
        </div>
      </template>

      <VList>
        <VListItem
          v-for="(item, i) in propsValue.listItem"
          :key="i"
          class="border-bottom-item cursor-pointer"
          @click="handleClickItem($event)"
        >
          <template
            v-if="propsValue.multiple"
            #prepend
          >
            <CmCheckBox
              v-if="item.prependItem?.isShow"
              v-model:model-value="item.prependItem.value"
              @update:modelValue="item?.prependItem?.action"
            />
          </template>
          <VListItemTitle
            @click="item?.action ? item?.action() : ''"
          >
            <VueFeather
              :type="item?.icon"
              :size="12"
              class="mr-2 color-dark"
              :class="[item.colorClass]"
            />
            <span class="text-medium-sm">{{ item.title }}</span>
          </VListItemTitle>
          <template #append>
            <VueFeather
              v-if="item?.appendItem?.icon"
              :type="item?.appendItem?.icon"
              :size="12"
              class="mr-2 color-dark"
              :class="[item.colorClass]"
            />
            <span
              v-if="item?.appendItem?.title"
            > {{ item?.appendItem?.title }}</span>
          </template>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;

.cm-drop-down {
  .border-bottom-item {
    border-radius: 0 !important;
    border-bottom: 1px solid $color-gray-100;
    margin-inline: 0!important;
  }
}
</style>

