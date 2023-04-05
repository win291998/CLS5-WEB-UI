<script setup lang="ts">
import CmSelectTree from '@/components/common/CmSelectTree.vue'
import ArrayUtil from '@/utils/ArrayUtil'
import { comboboxStore } from '@/stores/combobox'

interface Props {/** ** Interface */
  modelValue?: any
  orgStructs?: Array<any>
  valueFormat?: string
  excludeId?: number
  maxItem?: number
  customKey?: string
  multiple?: boolean
  parentId?: number
  appendToBody?: boolean
  closeOnSelect?: boolean
  bgColor?: string
  text?: string
  placeholder?: string
}
interface Emit {
  (e: 'update:modelValue', value: any): void
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  multiple: false,
  closeOnSelect: false,
  customKey: 'id',
  label: undefined,
  bgColor: 'white',
  text: undefined,
  placeholder: 'Chọn',
}))

const emit = defineEmits<Emit>()

/** ** Khởi tạo store */
const store = comboboxStore()
const { organizations } = storeToRefs(store)
const { fetchTOrgStructCombobox } = store
const organizationsValue = ref<any>(props.modelValue)

const options = ref()

const getAllOrgStruct = async () => {
  if (!window._.isEmpty(organizations.value)) {
    const data = window._.cloneDeep(organizations.value)
    if (props.excludeId) {
      const positionExclude = data.findIndex((item: any) => item[props.customKey] === props.excludeId)

      organizations.value = window._.pullAt(data, positionExclude)
    }

    options.value = ArrayUtil.formatSelectTree(organizations.value, 'parentId', props.customKey)
  }
}

const handleChangeSelect = (data: any) => {
  emit('update:modelValue', data)
}

onMounted(async () => {
  if (window._.isEmpty(organizations.value)) {
    await fetchTOrgStructCombobox()
    await getAllOrgStruct()
  }
  else {
    await getAllOrgStruct()
  }
})
</script>

<template>
  <div class="mb-1">
    <label
      class="text-medium-sm color-dark"
    >{{ props.text }}</label>
  </div>
  <div>
    <CmSelectTree
      v-model="organizationsValue"
      :options="options"
      :placeholder="props.text"
      value-format="id"
      :close-on-select="closeOnSelect"
      :multiple="multiple"
      :normalizer-custom-type="[props.customKey, 'name', 'children']"
      @update:model-value="handleChangeSelect"
    />
  </div>
</template>

