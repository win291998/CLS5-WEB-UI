import _ from 'lodash'

import { reactive } from 'vue'

interface GlobalState {
  isRender?: boolean
  isLoading?: boolean
  [key: string]: any
}

const globalState = reactive<GlobalState>({
  isRender: false,
  isLoading: false,
})

const changeValue = (key: string, value: any) => {
  globalState[key] = value
}

export const globals = ({
  ...toRefs(globalState),
  changeValue,
  _,
})
