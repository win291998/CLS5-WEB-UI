import { reactive, readonly } from 'vue'

interface GlobalStateReadOnly {
  isRenderReadOnly: boolean
  isLoadingReadOnly: boolean
}

const globalStateReadOnly = reactive<GlobalStateReadOnly>({
  isRenderReadOnly: false,
  isLoadingReadOnly: false,
})

export const globalsReadOnly = readonly({
  ...toRefs(globalStateReadOnly),
})
