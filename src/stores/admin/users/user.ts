import { defineStore } from 'pinia'
import readXlsxFile from 'read-excel-file'
import type { Config } from '@/typescript/interface/import'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ObjectUtil from '@/utils/ObjectUtil'
import ComboboxService from '@/api/combobox/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { validatorStore } from '@/stores/validatator'

export const userManagerStore = defineStore('userManager', () => {
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const idUser = ref()

  onMounted(() => {
    console.log('onMounted')
  })
  onBeforeUnmount(() => {
    console.log('onBeforeUnmount')
  })

  return { idUser }
})
