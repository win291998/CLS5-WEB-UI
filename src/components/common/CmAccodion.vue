<script setup lang="ts">
import GlobalUtil from '@/utils/Global'

/**
 * Common accorrdion: danh sách đóng mở
 * input:
 * output
 * ex: dánh sách cơ cấu tổ chức, nhóm người dùng, chức danh,... trong table
 */
interface Props {
  data: dataAccodion[]
  customKey?: string
  customKeyChild?: string
  customLabel?: string
  classNameLabel?: Array<any>
  isOpen?: boolean
  isCustom?: boolean
  isDefault?: boolean
  isTree?: boolean
  isBgActive?: boolean
  isBorder?: boolean
}
interface dataAccodion {
  label?: any
  icon?: any
  colorClass?: any
  value?: any
  content?: any
  [name: string]: any
}
interface Emit {
  (e: 'change', data: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  data: () => ([{
    label: '',
    content: '',
  }]),
  customKey: 'content',
  customKeyChild: 'content',
  customLabel: 'label',
  classNameLabel: () => ([]),
  isOpen: false,
  isDefault: true,
  isCustom: false,
  isBgActive: false,
  isBorder: false,
}))

const emit = defineEmits<Emit>()

function checkAllValue() {
  return props.data.map(item => item.value)
}

const panel = props.isOpen ? ref(checkAllValue()) : ref([])
</script>

<template>
  <div :class="{ isBgActive }">
    <VExpansionPanels
      v-model="panel"
      class="no-background"
      multiple
    >
      <template v-if="!isTree || isCustom">
        <VExpansionPanel
          v-for="(item, index) in data"
          :key="index"
          :value="item.value || item.label"
          :class="{ 'isBorder-collap': isBorder }"
        >
          <template #title>
            <div v-if="isDefault">
              <VAvatar
                v-if="item.icon"
                size="32"
                class="mr-2"
                :class="[item.colorClass]"
                variant="tonal"
              >
                <VIcon
                  :icon="item.icon"
                  size="14"
                  :class="[item.colorClass]"
                />
              </VAvatar>
            </div>
            <span
              v-if="isDefault"
              :class="[props.classNameLabel[0]]"
              class="text-regular-sm"
            >{{ item[customLabel] }}</span>
            <slot
              class="text-regular-sm"
              name="titleData"
              :context="item"
            />
          </template>
          <template #text>
            <div
              v-if="GlobalUtil.checkTypeContent(item[customKey]) === 'array'"
            >
              <div
                v-for="(listItem, idItem) in item[customKey]"
                :key="idItem"
                class="mb-2"
              >
                <div
                  v-if="listItem?.icon"
                  class="icon-item"
                >
                  <VIcon
                    :icon="listItem?.icon"
                    size="14"
                    :class="[item?.colorClass]"
                  />
                </div>
                <div
                  v-if="listItem[customKeyChild]"
                  class="content-item text-regular-sm"
                  :class="[props.classNameLabel[1]]"
                >
                  {{ listItem[customKeyChild] }}
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-regular-sm mb-2"
            >
              {{ item?.[customKey] }}
            </div>
            <slot
              name="textData"
              class="text-regular-sm"
              :context="item"
            />
          </template>
        </VExpansionPanel>
      </template>
      <VExpansionPanel v-else>
        <template #title>
          <slot name="title" />
        </template>
        <template #text>
          <slot name="text" />
        </template>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.v-expansion-panel {
  background-color: unset !important;
}

.v-expansion-panel__shadow {
  box-shadow: unset !important;
}

.v-expansion-panel:not(:first-child)::after {
  border-block-start-style: unset !important;
}
.v-expansion-panel:not(:first-child) {
  margin-top: 8px !important;
}

.v-expansion-panel-text__wrapper {
  padding-inline: 3.5rem 1rem !important;
}
.isBgActive .v-expansion-panel-title{
  padding: 0px 16px !important;
  &[aria-expanded="true"] {
    /* CSS styles cho khi aria-expanded="true" */
    background-color: rgb(var(--v-gray-200));
  }
}
.isBorder-collap:not(:last-child){
  border-bottom: 1px solid rgb(var(--v-gray-300));
}
</style>
