<script setup lang="ts">
import CmSelectTree from '@/components/common/CmSelectTree.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import ArrayUtil from '@/utils/ArrayUtil'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { fetchData } from '@/mock/users/index'

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
  items: () => ([]),
  multiple: false,
  customKey: 'id',
  label: undefined,
  bgColor: 'white',
  text: undefined,
  placeholder: 'Chọn',
}))

const emit = defineEmits<Emit>()
const organizations = ref<Array<any>>([])

const options = ref()

const getAllOrgStruct = async () => {
  const res = await MethodsUtil.requestApiCustom(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)

  // const res = await fetchData(ComboboxService.AllOrgStruct, TYPE_REQUEST.GET).then((value: any) => value)
  if (res.code === 200 && res.data) {
    let data = res.data
    if (props.excludeId) {
      const positionExclude = data.findIndex((item: any) => item[props.customKey] === props.excludeId)

      data = window._.pullAt(data, 10)
      console.log(positionExclude)
    }

    options.value = ArrayUtil.formatSelectTree(res.data, 'parentId', props.customKey)
  }
}

const handleChangeSelect = (data: any) => {
  emit('update:modelValue', data)
}

getAllOrgStruct()
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

