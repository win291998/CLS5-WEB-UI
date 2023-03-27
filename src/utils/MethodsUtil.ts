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
  static requestApiCustom = async (url = '', method = 'GET', payload?: any) => {
    if (url === undefined)
      return
    const data = method === 'GET' ? null : payload || null
    const params = method === 'GET' ? payload : null

    return await window.axios({
      url,
      method,
      data,
      params,
    })
  }

  static checlActionKey = (id: number) => {
    switch (id) {
      case 1:
        // chỉnh sửa
        return 'ActionEdit'
      case 2:
        // xóa
        return 'ActionDelete'
      case 3:
        // Gửi duyệt
        return 'ActionSendAgree'
      case 4:
        // xem chi tiết
        return 'ActionViewDetail'
      case 5:
        // xem thông tin phản hồi
        return 'ActionViewFeedBack'
      case 6:
        // Yêu cầu thu hồi
        return 'ActionRecallRequest'
      case 7:
        // Chấp nhận yêu cầu thu hồi
        return 'ActionAcceptRecallRequest'
      case 8:
        // xem báo cáo
        return 'ActionViewReport'
      case 9:
        // phê duyệt
        return 'ActionAgree'
      case 10:

        return 'ActionCreatingTestCode'
      case 11:
        // điểm danh
        return 'ActionRollCallOffline'
      case 12:
        // Cập nhật điểm
        return 'ActionUpdatePointOffline'
      case 13:
        // thay đổi password
        return 'issuePasswords'
      case 14:
        // thay đổi trạng thái
        return 'changeStatus'
      case 15:
        // Khôi phục
        return 'RestoreCourse'
      case 16:
        // thêm cơ cấu tổ chức
        return 'AddOrStructure'

      default:
        return id
    }
  }

  static checkActionType = (data: any, callback: CallbackFunction) => {
    const dataFormat = {
      ...data,
      name: data?.name,
      action: callback,
    }

    switch (data?.id) {
      case 1:
        dataFormat.icon = 'mdi-pencil'
        dataFormat.color = 'color-dark'
        break
      case 2:
        dataFormat.icon = 'fe:trash'
        dataFormat.color = 'color-dark'
        break
      case 3:
        dataFormat.icon = 'tabler:send'
        dataFormat.color = 'color-dark'
        break
      case 4:
        dataFormat.icon = 'tabler:eye'
        dataFormat.color = 'color-primary'
        break
      case 5:
        dataFormat.icon = 'tabler:eye'
        dataFormat.color = 'color-dark'
        break
      case 6 :
        dataFormat.icon = 'tabler:circle-minus'
        dataFormat.color = 'color-dark'
        break
      case 7 :
        dataFormat.icon = 'prime-check-circle'
        dataFormat.color = 'color-dark'
        break

      case 8:
        dataFormat.icon = 'fe:pie-chart'
        dataFormat.color = 'color-success'
        break
      case 9:
        dataFormat.icon = 'prime-check-circle'
        dataFormat.color = 'color-success'
        break
      case 10:
        // dataFormat.icon = 'fe:pie-chart'
        // dataFormat.color = 'color-success'
        break
      case 11:
        dataFormat.icon = 'mdi:checkbox-marked-outline'
        dataFormat.color = 'color-success'
        break
      case 12:
        dataFormat.icon = 'fe:edit'
        dataFormat.color = 'color-success'
        break
      case 13:
        dataFormat.icon = 'fe:lock'
        dataFormat.color = 'color-dark'
        break
      case 14:
        dataFormat.icon = 'tabler:refresh'
        dataFormat.color = 'color-dark'
        break
      case 15:
        dataFormat.icon = 'tabler:refresh'
        dataFormat.color = 'color-primary'
        break
      case 16:
        dataFormat.icon = 'tabler:circle-plus'
        dataFormat.color = 'color-dark'
        break

      default:
        break
    }

    return dataFormat
  }
}
