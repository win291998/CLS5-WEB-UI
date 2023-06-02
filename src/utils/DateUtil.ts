import moment from 'moment'

export default class DateUtil {
  /**
   * @name: get message error
   * @param str
   * @return {string}
   */
  static getDate = (serial: any) => {
    if (serial === null)
      return null
    if (serial.toString().includes('/'))
      return serial
    let dateInfo = null

    // const date = new Date(Date.parse(serial))
    // const isoDateStr = date.toISOString()

    if (isNaN(serial)) {
      dateInfo = new Date(serial)
    }
    else {
      const utcDays = Math.floor(serial - 25569)
      const utcValue = utcDays * 86400

      dateInfo = new Date(utcValue * 1000)
    }
    if (Object.prototype.toString.call(dateInfo) === '[object Date]') {
      if (isNaN(dateInfo.getTime()))
        return serial

      return `${dateInfo.getDate()}/${dateInfo.getMonth() + 1}/${dateInfo.getFullYear()}`
    }

    return serial
  }

  // format date to DD/MM/YYYY
  static formatDateToDDMM = (value: any) => {
    if (!value)
      return ''
    return moment(String(value)).format('DD/MM/YYYY')
  }

  static formatSecond = (value: any) => {
    value = Math.round(value)
    if (value < 60)
      return `${value}s`
    if (value >= 60 && value < 3600) {
      const minute = Math.floor(value / 60)
      const second = value % 60
      return value === 0 ? `${minute}m` : `${minute}m${second}s`
    }
    if (value >= 3600) {
      const minute = Math.floor(value / 60)
      const hour = Math.floor(minute / 60)
      const remainMinute = minute - (hour * 60)
      return remainMinute === 0 ? `${hour}h` : `${hour}h${remainMinute}m`
    }
    return ''
  }
}
