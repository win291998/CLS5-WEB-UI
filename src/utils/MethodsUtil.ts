import { useI18n } from 'vue-i18n'
import { ActionType } from '@/constant/data/actionType.json'
import { StatusTypeUser } from '@/constant/data/status.json'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import axios from '@axios'

type CallbackFunction = (key: string) => any

export default class MethodsUtil {
  /**
   * @name: chuyển đổi rem qua pixel
   * @param rem
   * @return {Number}
   */
  static convertRemToPixels = (rem: number) => (
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
  )

  /**
   * @name: get message error
   * @param str
   * @return {string}
   */
  static getErrorsMessage = (errors: Array<any>) => {
    let str = ''
    errors.forEach(element => {
      // str += `${i18n.t(element.message, element.params)}`
      str += '. '
    })

    return str
  }

  /**
   * @name: Download file
   * @param {string} url => Đường dẫn api
   * @param {string} method => Phương thức 'POST', 'GET'
   * @param {string} nameFile =>  Tên file muốn lưu
   * @param {any} payload =>  Dữ liệu đính kèm api
   * @return {string}
   */
  static dowloadSampleFile = async (url: string, method: string, nameFile: string, payload?: any) => {
    const model = {
      language: localStorage.getItem('lang') === null ? 'vi' : localStorage.getItem('lang'),
    }

    const data = method === 'GET' ? model : !window._.isEmpty(payload) ? payload : model
    const params = method === 'GET' ? payload : null

    const response = await window.axios({
      url,
      method,
      responseType: 'blob',
      data,
      params,
    })

    const fileURL = window.URL.createObjectURL(new Blob([response]))

    const fileLink = document.createElement('a')

    fileLink.href = fileURL
    fileLink.setAttribute('download', nameFile)
    document.body.appendChild(fileLink)
    fileLink.click()
  }

  /**
   * @name: Request API
   * @param {string} url => Đường dẫn api
   * @param {string} method => Phương thức 'POST', 'GET'
   * @param {any} payload =>  Dữ liệu đính kèm api
   * @return {object}
   */
  static requestApiCustom = (url = '', method = 'GET', payload?: any) => {
    if (url === undefined)
      return
    const data = method === 'GET' ? null : payload || null
    const params = method === 'GET' ? payload : null

    return window.axios({
      url,
      method,
      data,
      params,
    })
  }

  static checlActionKey = (itemRow: any, data?: any) => {
    const action = ActionType?.find((item: any) => item?.id === itemRow?.id)

    return data ? [action || itemRow, data] : [action || itemRow]
  }

  static checkActionType = (data: any, callback: CallbackFunction) => {
    const dataFormat = {
      ...data,
      action: callback,
    }

    const action = ActionType.find(item => item.id === data?.id)

    dataFormat.icon = action?.icon
    dataFormat.color = action?.color

    return dataFormat
  }

  static checkStatusTypeUser = (key: number | string) => {
    if (typeof key === 'number')
      return StatusTypeUser.find((item: any) => item.id === key)

    return StatusTypeUser.find((item: any) => item.name === key)
  }

  static checkStatus = (key: number | string, data: any) => {
    if (typeof key === 'number')
      return data.find((item: any) => item.id === key)

    return data.find((item: any) => item.name === key)
  }

  static formatFullName = (firstName: string, lastName: string) => {
    const lang = localStorage.getItem('lang') === null ? 'vi' : localStorage.getItem('lang')
    switch (lang) {
      case 'vi':
        return `${lastName || '-'} ${firstName || '-'}`
      case 'en':
        return `${firstName || '-'} ${lastName || '-'}`
      default:
        return `${lastName || '-'} ${firstName || '-'}`
    }
  }

  // Tìm kiếm thông tin người dùng trong phạm vi danh sách id
  static searchUserInfoByIds = async (userIds: any, searchKey = null,
    prosForSearch = null, pageSize = null, pageNumber: any = null,
    orStructure = [], groupUser = [], categoryTitleId = [], titles = []) => {
    if (userIds?.length > 0) {
      const distinctUserIds = [...new Set(userIds)] // Lấy giá trị distict value
      const params = {
        userIds: distinctUserIds,
        searchKey,
        prosForSearch,
        orStructure,
        groupUser,
        categoryTitleId,
        titles,
        pageSize,
        pageNumber,
      }
      params.pageSize = pageSize === null ? userIds.length : pageSize
      params.pageNumber = pageNumber === null ? 1 : pageNumber
      const res = await MethodsUtil.requestApiCustom(ApiUser.getPagingUserByList, TYPE_REQUEST.GET, params).then((value: any) => value)
      return res.data
    }
    return { pageLists: [], totalRecord: 0 }
  }

  static getAllChildrenOfTreeNodeIds = (node: any, nodes: any) => {
    let listIds: any = []
    node.children.forEach((item: any) => {
      listIds.push(Number(item.split('-')?.[1]))
      if (nodes[item]?.children?.length) {
        const children = MethodsUtil.getAllChildrenOfTreeNodeIds(nodes[item], nodes)
        console.log(nodes[item])
        listIds = listIds.concat(children)
      }
    })

    return listIds
  }

  // // kiểm tra quyền trên view
  // const checkPermission = (key, value) => {
  //   let permission = store.getters['app/permission']
  //   if (permission === null) {
  //     const token = useJwt.getToken()
  //     if (!token)
  //       return false
  //     permission = parseJwt(token)
  //     store.commit('app/UPDATE_PERMISSION', permission)
  //   }
  //   const propertyValue = permission[key]
  //   if (!propertyValue)
  //     return false
  //   const valueNumber = parseInt(propertyValue, 10)

  //   return valueNumber && (valueNumber & value) === value
  // }
}
