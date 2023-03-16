export default class GlobalUtil {
  /**
   * @name: chuyển đổi giá trị global window
   * @param {string} key: key cần thay đổi
   * @value giá trị
   */
  static setWindowDefineProperty = (key: string, value: any) => {
    window[key as never] = value
  }

  /**
   * @name: kiểm tra kiểu dữ liệu
   * @param {any} data dữ liệu cần kiểm tra
   * @return {boolean}
   */
  static checkTypeContent = (data: any) => {
    if (window._.isArray(data))
      return 'array'

    return typeof data
  }
}
