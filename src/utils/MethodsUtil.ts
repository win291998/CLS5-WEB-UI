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

    const data = method === 'GET' ? model : payload || model
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
}
