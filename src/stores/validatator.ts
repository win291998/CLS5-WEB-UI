import { defineStore } from 'pinia'
import * as yup from 'yup'
import { Field, Form, useField } from 'vee-validate'

export const validatorStore = defineStore('validator', () => {
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

  const CONFIG = Object.freeze({
    LAST_NAME: {
      FIELD: t('common.surname'),
      MAX: 50,
      MIN: 2,
    },
    FIRST_NAME: {
      FIELD: t('common.name'),
      MAX: 50,
    },
    EMAIL: {
      FIELD: t('common.email'),
      MAX: 255,
    },
    USERNAME: {
      FIELD: t('common.sign-name'),
      MAX: 255,
      MIN: 3,
    },
    PASSWORD: {
      FIELD: t('common.password'),
      MAX: 255,
      MIN: 3,
    },
  })

  const ruleMessage = reactive({
    required: (field?: any) => `Vui lòng nhập dữ liệu ${field || ''}`,
    min: (min: any, field?: any) => `${field || ''} phải chứa ít nhất ${min} ký tự`,
    max: (max: any, field?: any) => `${field || ''} chỉ chứa tối đa ${max} ký tự`,
    password: (field?: any) => `${field || ''} phải chứa ít nhất một chữ cái viết thường, một chữ in hoa, một số và một ký tự đặc biệt`,
  })

  const getRulePassword = () => {
    if (window
      && window.location
      && ['daotaotlg.cls.vn', 'winedu.com.vn'].includes(window.location.hostname)
    ) {
      return yup.string()
        .required()
        .min(8, ruleMessage.min(8, CONFIG.PASSWORD.FIELD))
        .matches(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          ruleMessage.password(CONFIG.PASSWORD.FIELD),
        )
    }

    return yup.string()
      .required()
      .min(8, ruleMessage.min(8, CONFIG.PASSWORD.FIELD))
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        ruleMessage.password(CONFIG.PASSWORD.FIELD),
      )
  }

  const schema = yup.object().shape({
    lastName: yup.string().required(ruleMessage.required())
      .max(CONFIG.LAST_NAME.MAX, ruleMessage.max(CONFIG.LAST_NAME.MAX, CONFIG.LAST_NAME.FIELD)),
    firstName: yup.string().required(ruleMessage.required())
      .max(CONFIG.FIRST_NAME.MAX, ruleMessage.max(CONFIG.FIRST_NAME.MAX, CONFIG.FIRST_NAME.FIELD)),
    email: yup.string().required(ruleMessage.required())
      .max(CONFIG.EMAIL.MAX, ruleMessage.max(CONFIG.EMAIL.MAX, CONFIG.EMAIL.FIELD)),
    userName: yup.string().required(ruleMessage.required())
      .max(CONFIG.USERNAME.MAX, ruleMessage.max(CONFIG.USERNAME.MAX, CONFIG.USERNAME.FIELD))
      .min(CONFIG.USERNAME.MIN, ruleMessage.min(CONFIG.USERNAME.MIN, CONFIG.USERNAME.FIELD)),
    password: getRulePassword(),

  })

  return { schema, ruleMessage, Field, Form, useField }
})
