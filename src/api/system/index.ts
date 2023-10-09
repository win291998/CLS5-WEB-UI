const SystemService = {
  /** Get */
  SettingDefaultSystem: 'SettingSystem/get-list-setting-default',
  ThemeSystem: 'theme/get-detail',
  SendMailTest: 'EmailConfiguration/send-email',
  LoginProvider: 'portal/external-login-provider',
  ConfigAuth: 'portal/config-authentication',
  ConfigExternalLogin: 'portal/external-login',
  GetRegisterConfig: '/RegistryConfiguration/get',
  UpdateRegisterConfig: '/RegistryConfiguration/create',
  TimeServer: '/ConfigEvent/get-date-now',
}

export default SystemService
