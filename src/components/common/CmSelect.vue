<script setup lang="ts">
import Globals from '@/constant/Globals'

interface Props {/** ** Interface */
  items?: Array<any>
  maxItem?: number
  multiple?: boolean
  returnObject?: boolean
  customKey?: string
  itemValue?: string
  label?: string
  bgColor?: string
  text?: string
  placeholder?: string
}
interface Emit {
  (e: 'update:modelValue', value: any): void
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  items: () => ([]),
  maxItem: Globals.MAX_ITEM_SELECT_MULT,
  multiple: false,
  returnObject: false,
  customKey: 'key',
  itemValue: 'value',
  label: undefined,
  bgColor: 'white',
  text: undefined,
  placeholder: 'Chọn',
}))

const emit = defineEmits<Emit>()
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const value = ref([])

/** method */
const handleChangeValue = event => {
  emit('update:modelValue', event)
}
</script>

<template>
  <div class="mb-1">
    <label
      class="text-medium-sm color-dark"
    >{{ props.text }}</label>
  </div>
  <div>
    <VSelect
      v-model="value"
      class="v-select-limit-width"
      :items="items"
      :item-title="customKey"
      :item-value="itemValue"
      :label="label"
      :multiple="multiple"
      :placeholder="placeholder"
      :bg-color="bgColor"
      :menu-props="{
        maxHeight: '300px',
        maxWidth: '100px',
      }"
      :return-object="returnObject"
      @update:modelValue="handleChangeValue"
    >
      <template
        v-if="multiple"
        #selection="{ item, index }"
      >
        <VChip v-if="maxItem ? index < maxItem : true">
          <span>{{ t(item.title) }}</span>
        </VChip>
        <span
          v-if="maxItem ? index === maxItem : false"
          class="text-grey text-caption align-self-center"
        >
          {{ t('and-count-more', { count: value.length - (maxItem || 0) }) }}
        </span>
      </template>
    </VSelect>
  </div>
</template>

<style lang="scss">
.v-chip.v-chip--size-small {
  // margin-block: 5px;
}
</style>
