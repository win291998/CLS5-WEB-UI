import { QRCodeLimitLength, QRCodeModel, QRErrorCorrectLevel } from './QRCodeDefination'

class QRCode {
  public option: any

  // Hàm khởi tạo
  constructor() {
    this.option = {}
  }

  drawCanvas(context: any, text: any, option: any) {
    this.option = option
    const qrCode = new QRCodeModel(QRCode.getTypeNumber(text, option.correctLevel), option.correctLevel)
    qrCode.addData(text)
    qrCode.make()
    const nCount = qrCode.getModuleCount()
    const woh = option.width < option.height ? option.width : option.height
    const nWidth = woh / nCount
    const nHeight = woh / nCount
    const nRoundedWidth = Math.round(nWidth)
    const nRoundedHeight = Math.round(nHeight)

    context.translate(option.x + (option.width - woh) / 2, option.y + (option.height - woh) / 2)

    for (let row = 0; row < nCount; row += 1) {
      for (let col = 0; col < nCount; col += 1) {
        const bIsDark = qrCode.isDark(row, col)
        const nLeft = col * nWidth
        const nTop = row * nHeight
        context.strokeStyle = bIsDark ? option.colorDark : option.colorLight
        context.lineWidth = 1
        context.fillStyle = bIsDark ? option.colorDark : option.colorLight
        context.fillRect(nLeft, nTop, nWidth, nHeight)

        context.strokeRect(
          Math.floor(nLeft) + 0.5,
          Math.floor(nTop) + 0.5,
          nRoundedWidth,
          nRoundedHeight,
        )

        context.strokeRect(
          Math.ceil(nLeft) - 0.5,
          Math.ceil(nTop) - 0.5,
          nRoundedWidth,
          nRoundedHeight,
        )
      }
    }
  }

  static getTypeNumber(sText: any, nCorrectLevel: any) {
    let nType = 1
    const length = QRCode.getUTF8Length(sText)
    for (let i = 0, len = QRCodeLimitLength.length; i <= len; i += 1) {
      let nLimit = 0

      switch (nCorrectLevel) {
        case QRErrorCorrectLevel.L:
          nLimit = QRCodeLimitLength[i][0]
          break
        case QRErrorCorrectLevel.M:
          nLimit = QRCodeLimitLength[i][1]
          break
        case QRErrorCorrectLevel.Q:
          nLimit = QRCodeLimitLength[i][2]
          break
        case QRErrorCorrectLevel.H:
          nLimit = QRCodeLimitLength[i][3]
          break
        default:
          break
      }

      if (length <= nLimit)
        break

      else
        nType += 1
    }

    if (nType > QRCodeLimitLength.length)
      throw new Error('Too long data')

    return nType
  }

  static getUTF8Length(text) {
    const replacedText = encodeURI(text).toString().replace(/\\%[0-9a-fA-F]{2}/g, 'a')
    return replacedText.length + (replacedText.length !== text ? 3 : 0)
  }
}
export default new QRCode()
