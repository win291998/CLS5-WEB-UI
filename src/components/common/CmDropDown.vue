<script setup lang="ts">
import CmCheckBox from './CmCheckBox.vue'
import MethodsUtil from '@/utils/MethodsUtil'

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
  icon?: string
  data?: any
  multiple?: boolean
  customKey: string
  type?: number
  index?: number
}
interface item {
  icon?: string
  colorClass?: string
  action?: any
  appendItem?: appendItem
  prependItem?: prependItem
  [key: string]: any
}
interface appendItem {
  icon?: string
  [key: string]: any
}
interface prependItem {
  isShow: boolean
  isDisabled: boolean
  value: boolean
  action: any
}

const propsValue = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
  icon: 'tabler:dots-vertical',
  checkbox: true,
  multiple: false,
  customKey: 'title',
  type: undefined,
  data: undefined,
  index: 0,
}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'change', data: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

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
          <VIcon
            v-if="propsValue.icon"
            v-bind="props"
            :icon="propsValue.icon "
            :size="18"
          />
        </div>
      </template>

      <VList>
        <VListItem
          v-for="(item, i) in propsValue.listItem"
          :key="i"
          class="border-bottom-item cursor-pointer"
          :value="item"
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
            @click="item?.action ? propsValue.type === 1 ? item?.action(MethodsUtil.checlActionKey(item, data), index) : item?.action() : ''"
          >
            <VIcon
              v-if="item?.icon"
              :icon="item?.icon"
              :size="18"
              class="mr-2 color-dark"
              :class="[item.colorClass]"
            />
            <span class="text-medium-sm">{{ t(item[customKey]) }}
            </span>
          </VListItemTitle>
          <template #append>
            <VIcon
              v-if="item?.appendItem?.icon"
              :icon="item?.appendItem?.icon"
              :size="12"
              class="mr-2 color-dark"
              :class="[item.colorClass]"
            />
            <span
              v-if="item?.appendItem?.[customKey] "
            > {{ item?.appendItem[customKey] }}</span>
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
    border-block-end: 1px solid $color-gray-100;
    margin-inline: 0 !important;
  }
}
</style>

