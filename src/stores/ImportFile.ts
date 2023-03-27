import { defineStore } from 'pinia'
import readXlsxFile from 'read-excel-file'
import type { Config } from '@/typescript/interface/import'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ObjectUtil from '@/utils/ObjectUtil'

export const useImportFileStore = defineStore('importFile', () => {
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const type = ref(2)
  const config = reactive<Config>({ table: { header: [] } })

  const paramsImport = reactive({
    validData: [],
    invalidData: [],
  })

  /** method */
  const checkDataError = (data: any) => {
    if (data && data.length > 0) {
      data.forEach((item: any) => {
        if (item.isSuccess === false) {
          if (item.errors) {
            item.messageErr = ''
            item.errors.forEach((err: any) => {
              item.messageErr += `${t(`${err.message}`)} <br> `
            })
          }
        }
        else {
          // item.isSelected = true
        }
      })
    }
  }

  const getValidData = async (listData: Array<object>, paramExtend?: object) => {
    const model = {
      listLocal: [],
      listExcel: listData,
      isSave: false,
      type: 2,
      ...paramExtend,
    }

    const res = await MethodsUtil.requestApiCustom(config.importFile?.urlFileDefault, config.importFile?.method, model).then((value: any) => value)

    checkDataError(res.data)

    const validData = res.data.filter((item: any) => item.isSuccess === true)
    if (validData) {
      validData.forEach((element: never, id: number) => {
        (element as any).key = id
      })
      paramsImport.validData = validData
    }
    const inValidData = res.data.filter((item: any) => item.isSuccess === false)
    if (inValidData) {
      inValidData.forEach((element: never, id: number) => {
        (element as any).key = id
      })
      paramsImport.invalidData = inValidData
    }

    // showaddComponent = validData.length > 0
  }

  const checkInvalidData = async () => {
    const model = {
      listLocal: paramsImport.validData,
      listExcel: paramsImport.invalidData,
      isSave: false,
      type: 2,
      ...config?.importFile?.paramsImport,
    }

    const res = await MethodsUtil.requestApiCustom(config.importFile?.urlFileDefault, config.importFile?.method, model).then((value: any) => value)

    checkDataError(res.data)

    const validData = res.data.filter((item: any) => item.isSuccess === true)
    if (validData.length) {
      validData.forEach((element: never, id: number) => {
        paramsImport.validData.push(element)
      })
      paramsImport.validData.forEach((element: any, id: number) => {
        (element as any).key = id
      })
    }
    const inValidData = res.data.filter((item: any) => item.isSuccess === false)
    if (inValidData) {
      inValidData.forEach((element: never, id: number) => {
        (element as any).key = id
      })
      paramsImport.invalidData = inValidData
    }

    // this.showaddComponent = this.validData.length > 0
  }

  const fileChange = (event: any) => {
    const input = event.target.files[0]
    const listData: any = []

    readXlsxFile(input).then(rows => {
      if (rows.length <= 2) {
        // console.log('error')
      }
      else {
        for (let i = 2; i < rows.length; i += 1) {
          const rowData = rows[i]
          let data = null
          data = config?.dowloadSample?.dataColumnExcel(rowData)
          listData.push(data)
        }

        event.target.value = null

        getValidData(listData, config?.importFile?.paramsImport)
      }
    })
  }

  const updateFromFile = async () => {
    const list = reactive({
      listIndex: <number[]>[],
      listData: <any[]>[],
    })

    paramsImport.validData.forEach((item: any, index: number) => {
      if (item.isSelected) {
        list.listIndex.push(index)
        list.listData.push(item)
      }
    })

    let model = {
      listExcel: list.listData,
      isSave: true,
      typeUpdate: 2,
    }

    if (!ObjectUtil.isEmpty(type.value)) {
      model = {
        ...model,
        ...{
          type: type.value,
        },
      }
    }

    const res = await MethodsUtil.requestApiCustom(config.importFile?.urlFileDefault, config.importFile?.method, model).then((value: any) => value)

    if (res?.data && res?.code === 200) {
      toast('SUCCESS', res?.message)

      list.listIndex.reverse().forEach(item => {
        paramsImport.validData.splice(item, 1)
      })
      if (paramsImport.validData.length === 0 && paramsImport.invalidData.length === 0)
        return 'back'
    }
    else {
      toast('ERROR', res?.message)
    }
  }

  return { getValidData, checkInvalidData, checkDataError, paramsImport, fileChange, config, type, updateFromFile }
})
