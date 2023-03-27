<script setup lang="ts">
import type { size } from '@/typescript/enums/enums'

/**
 * ListItem: danh sách các item
 * trong
 * {
 *  title:
 *  icon:
 *  class:
 *  action: function từ cha truyền xuống, nếu ko thì dùng click item
 * }
 * icon: icon hiển thị của prepend button
 * isBorder: có hiển thị border giữa 2 button
 * isDiabledPrepend: boolean này tự hiểu
 * isDiabledAppend: boolean này tự hiểu
 * size: 'x-small', 'small', 'default', 'large', 'x-large'
*/

interface Props {
  listItem: ListItem[]
  icon: string
  color?: string
  isBorder: boolean
  isDiabledPrepend: boolean
  isDiabledAppend: boolean
  size: typeof size[number]
}
interface ListItem {
  title: string
  icon?: string
  colorClass?: string
  action?: any
}

interface Emit {
  (e: 'clickPrepend'): void
  (e: 'clickItem', item: object): void
}

const props = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
  icon: 'chevron-down',
  isBorder: true,
  color: 'error',
  isDiabledPrepend: false,
  isDiabledAppend: false,
  size: 'default',
}))

const emit = defineEmits<Emit>()

const handlerPrepend = () => {
  emit('clickPrepend')
}

const buttonActive = ref(false)

const activeButton = () => {
  buttonActive.value = !buttonActive.value
}

const clickItem = (item: object) => {
  emit('clickItem', item)
}
</script>

<template>
  <div>
    <VBtn
      :class="`button-group-prepend btn-${props.color}`"
      activator="parent"
      :size="props.size"
      :disabled="props.isDiabledPrepend"
    >
      <div
        @click="handlerPrepend"
      >
        <slot />
      </div>
    </VBtn>
    <VBtn
      :size="props.size"
      :disabled="props.isDiabledAppend"
      :class="`button-group-append btn-${props.color} ${isBorder ? `border-left-${props.color}` : ''}`"
    >
      <VMenu
        location="bottom right"
        class="button-dropdown"
        activator="parent"
      >
        <template #activator>
          <VIcon
            :icon="props.icon"
            :size="18"
          />
        </template>
        <VList>
          <VListItem
            v-for="(item, index) in listItem"
            :key="index"
            :class="item.colorClass"
            :value="index"
            @click="item?.action ? item?.action(item) : clickItem(item)"
          >
            <VListItemTitle class="jutify-content-center">
              <VIcon
                v-if="item.icon"
                :icon="item.icon"
                size="14"
                :class="[item.colorClass]"
              /> <span class="ml-25">{{ item.title }}</span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VBtn>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;

.button-group-prepend {
  border-end-end-radius: unset;
  border-start-end-radius: unset;
}

.button-group-append {
  border-end-start-radius: unset;
  border-start-start-radius: unset;
}
</style>
