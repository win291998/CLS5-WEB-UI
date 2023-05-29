import type { typeCardImage, typeCardImageEnum, typeStatusToast } from '@/typescript/enums/enums'

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

export type typeToast = typeof typeStatusToast[number]

export interface Any {
  [e: string]: any
}
