import { _ } from './LodashUtil'
import RegExps from '@/constant/RegExps'

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
}
