import { defineStore } from 'pinia'
import readXlsxFile from 'read-excel-file'
import type { Config } from '@/typescript/interface/import'

import MethodsUtil from '@/utils/MethodsUtil'

export const useImportFileStore = defineStore('importFile', () => {
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const type = ref()
  const config = reactive<Config>({})

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
      listLocal: paramsImport.validData,
      listExcel: listData,
      isSave: false,
      type: 2,
      ...paramExtend,
    }

    const res = await window.axios.put('/User/update-email-excel', model).then((value: any) => value)

    checkDataError(res.data)

    const validData = res.data.filter((item: any) => item.isSuccess === true)
    if (validData) {
      validData.forEach((element: never, id: number) => {
        (element as any).id = id
        paramsImport.validData.push(element)
      })
    }
    const inValidData = res.data.filter((item: any) => item.isSuccess === false)
    if (inValidData) {
      inValidData.forEach((element: never, id: number) => {
        (element as any).id = id
      })
      paramsImport.invalidData = inValidData
    }

    // showAddButton = validData.length > 0
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
        (element as any).id = id
      })
    }
    const inValidData = res.data.filter((item: any) => item.isSuccess === false)
    if (inValidData) {
      inValidData.forEach((element: never, id: number) => {
        (element as any).id = id
      })
      paramsImport.invalidData = inValidData
    }

    // this.showAddButton = this.validData.length > 0
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
    if (!list.listIndex.length) {
      list.listIndex = paramsImport.validData.map((item, id) => id)
      list.listData = paramsImport.validData
    }

    // const model = {
    //   listExcel: listData,
    //   isSave: true,
    //   type: this.type,
    //   typeUpdate: 2,
    // }

    // const { data } = await this.$store.dispatch(`${USER_STORE_MODULE}/updateMailFromFile`, model)

    // if (data) {
    //   listIndex.reverse().forEach(item => {
    //     this.validData.splice(item, 1)
    //   })
    // }
  }

  return { getValidData, checkInvalidData, checkDataError, paramsImport, fileChange, config, type, updateFromFile }
})
