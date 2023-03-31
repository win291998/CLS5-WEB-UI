<script setup lang="ts">
import CmSelectTree from '@/components/common/CmSelectTree.vue'
import ArrayUtil from '@/utils/ArrayUtil'
import { comboboxStore } from '@/stores/combobox'

interface Props {/** ** Interface */
  value?: any
  orgStructs?: Array<any>
  valueFormat?: string
  excludeId?: number
  maxItem?: number
  customKey?: string
  multiple?: boolean
  parentId?: number
  appendToBody?: boolean
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
  customKey: 'id',
  label: undefined,
  bgColor: 'white',
  text: undefined,
  placeholder: 'Chọn',
}))

const emit = defineEmits<Emit>()

/** ** Khởi tạo store */
const store = comboboxStore()
const { combobox } = store
const { fetchTOrgStructCombobox } = store
const organizations = ref<Array<any>>([])

const options = ref()

const getAllOrgStruct = async () => {
  if (!window._.isEmpty(combobox?.organizations)) {
    console.log(combobox.organizations)

    const data = window._.cloneDeep(combobox.organizations)
    if (props.excludeId) {
      const positionExclude = data.findIndex((item: any) => item[props.customKey] === props.excludeId)

      combobox.organizations = window._.pullAt(data, positionExclude)
    }

    options.value = ArrayUtil.formatSelectTree(combobox.organizations, 'parentId', props.customKey)
  }
}

const handleChangeSelect = (data: any) => {
  emit('update:modelValue', data)
}

onMounted(async () => {
  if (window._.isEmpty(combobox.organizations)) {
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
      v-model="organizations"
      :options="options"
      :placeholder="props.text"
      value-format="id"
      multiple
      :normalizer-custom-type="[props.customKey, 'name', 'children']"
      @update:model-value="handleChangeSelect"
    />
  </div>
</template>

