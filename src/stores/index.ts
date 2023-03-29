import { defineStore } from 'pinia'
import { defaultSetting } from '@/constant/data/settingDefault.json'

export const configStore = defineStore('appConfig', () => {
  /** variable */
  const config = reactive({
    isRTL: 'ltr',
    defaultSetting,
  })

  return { config }
})
