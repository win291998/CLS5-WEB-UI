import jwtDefaultConfig from './jwtDefaultConfig'
import axios from '@axios'

interface Errors {
  [propName: string]: any
}

export default class AuthUtil {
  static getToken = () => {
    return localStorage.getItem(jwtDefaultConfig.storageTokenKeyName)
  }

  static setToken = (value: string) => {
    localStorage.setItem(jwtDefaultConfig.storageTokenKeyName, value)
  }

  static setRefreshToken = (value: string) => {
    localStorage.setItem(jwtDefaultConfig.storageRefreshTokenKeyName, value)
  }

  static getUserData = () => {
    const userData = localStorage.getItem(jwtDefaultConfig.userData)
    if (userData)
      return JSON.parse(userData)
  }

  static login = async (...args: any[]) => {
    try {
      return await axios.post(jwtDefaultConfig.loginEndpoint, ...args)
    }
    catch (err) {
      return err?.response?.data
    }
  }

  static loginByGoogle = async (credential: any) => {
    try {
      return await axios.post(`${jwtDefaultConfig.loginByGoogleEndpoint}/${credential}`)
    }
    catch (err) {
      return err?.response?.data
    }
  }

  static loginByMicrosoft = async (code: any) => {
    try {
      return await axios.post(`${jwtDefaultConfig.loginByMicrosoftEndpoint}/${code}`)
    }
    catch (err) {
      return err?.response?.data
    }
  }

  static logout = async (...args: any[]) => {
    try {
      return await axios.post(jwtDefaultConfig.logoutEndpoint, ...args)
    }
    catch (err) {
      return null
    }
  }

  static register = async (...args: any[]) => {
    return axios.post(jwtDefaultConfig.registerEndpoint, ...args)
  }

  static forgotPassword = async (args: any) => {
    try {
      const { data } = await axios.post(jwtDefaultConfig.forgotPassword, args)

      return data
    }
    catch (err) {
      return err?.response?.data
    }
  }

  static checkLinkResetPassword = async (args: any) => {
    try {
      const { data } = await axios.get(`${jwtDefaultConfig.checkResetPassword}?securityCode=${args}`)

      return data
    }
    catch (err) {
      return err?.response?.data
    }
  }

  static resetPassword = async (args: any) => {
    try {
      const { data } = await axios.post(`${jwtDefaultConfig.resetPassword}`, args)

      return data
    }
    catch (err) {
      return err?.response?.data
    }
  }

  static checkPortalBranch = async (args: any) => {
    try {
      const { status } = await axios.get(jwtDefaultConfig.checkPortalBranchEndpoint)

      return status === 200
    }
    catch (err) {
      return false
    }
  }

  static confirmPortal = async (token: any) => {
    try {
      const { data } = await axios.get(`${jwtDefaultConfig.confirmPortal}?code=${token}`)

      return data
    }
    catch (err) {
      return err?.response?.data
    }
  }

  static getSocialClientId = async (...args: any[]) => {
    try {
      return await axios.get(jwtDefaultConfig.getSocialClientId, ...args)
    }
    catch (err) {
      return err?.response?.data
    }
  }
}
