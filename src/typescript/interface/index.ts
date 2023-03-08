import type { typeCardImage, typeCardImageEnum } from '@/typescript/enums/enums'

export interface globaleInterface {
  isRender: boolean
  _: _.LoDashStatic
  changeValue(key: any, value: any): void
}

export interface infMsgTimeLine {
  from: string
  message: string
  time: string
  color: string
}

export interface infTimeLine {
  isShow: boolean
  msgTimeLine: infMsgTimeLine[]
}

export interface infImageCard {
  type: typeCardImageEnum
  src: string
}
