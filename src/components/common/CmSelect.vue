<script setup lang="ts">
interface Props {/** ** Interface */
  items?: Array<any>
  maxItem?: number
  multiple?: boolean
  returnObject?: boolean
  itemTitle?: string
  itemValue?: string
  label?: string
  bgColor?: string
  text?: string
  placeholder?: string
}
interface Emit {
  (e: 'change', value: any): void
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  items: () => ([]),
  maxItem: undefined,
  multiple: false,
  returnObject: false,
  itemTitle: 'key',
  itemValue: 'value',
  label: undefined,
  bgColor: 'white',
  text: undefined,
  placeholder: 'Chọn',
}))

const emit = defineEmits<Emit>()

const value = ref([])

/** method */
const handleChangeValue = event => {
  emit('change', event)
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
      :item-title="itemTitle"
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
      <template #selection="{ item, index }">
        <VChip v-if="maxItem ? index < maxItem : true">
          <span>{{ item.title }}</span>
        </VChip>
        <span
          v-if="maxItem ? index === maxItem : false"
          class="text-grey text-caption align-self-center"
        >
          (+{{ value.length - (maxItem || 0) }} others)
        </span>
      </template>
    </VSelect>
  </div>
</template>

