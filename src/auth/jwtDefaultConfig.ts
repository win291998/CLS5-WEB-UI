export default {
  // Endpoints
  loginEndpoint: '/user/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/user/refresh-token',
  logoutEndpoint: '/user/logout',
  forgotPassword: 'user/forgot-password',
  resetPassword: 'user/reset-password',
  checkResetPassword: 'user/check-reset-password',
  getSocialClientId: '/portal/clientid',
  loginByGoogleEndpoint: '/user/google-login',
  loginByMicrosoftEndpoint: '/user/microsoft-signin',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  menuItems: 'menuItems',
  role: 'role',
  userData: 'userData',
  branchData: 'branchData',
  logo: 'logo',

  // Enpoint chứa phương thức kiểm tra thông tin Portal, Brand có tồn tài từ request
  checkPortalBranchEndpoint: 'management/check-branch-portal',
  confirmPortal: 'management/confirm-portal',
}
