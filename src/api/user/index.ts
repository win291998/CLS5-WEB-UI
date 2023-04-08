const UserService = {
  /** Get */
  // dowload file sample
  GenerateExcelTemplateCreateUsers: 'user/generate-excel-template-create-users',
  GetTemplateExcelUpdateEmailUser: '/User/get-template-excel-update-email-user',
  GetTemplateExcelUpdateKpiUser: '/User/get-template-excel-update-kpi',
  GetTemplateExcelUpdateProficiencyUser: '/Proficiency/generate-excel-template-proficiency',

  // import file
  UpdateInforUserExcel: '/User/update-email-excel',
  UpdateKpiUserExcel: '/User/update-kpi-excel',
  UpdateProficiencyUserExcel: '/Title/import-excel-create-proficiency',

  /// user type
  RoleFeaturePermission: '/usertype/get-feature-permission-by-portal',

  /// get danh sách:
  UsersList: '/User/get-all-users-paging', // danh sách người dùng
  UsersDelete: '/user/delete', // Xóa người dùng
  ResetPassword: '/user/set-password', // Cập nhật mật khẩu
  ChangeStatus: '/user/change-status', // Cập nhật trạng thái
  GetListTitle: 'title/get-all-by-search', // GetListTitle
  GetProfileOrg: 'profile/get-list-organizational-structure', // GetProfileOrg
  UpdateTitleUser: '/organizationalstructure/update-title-user', // updateTitleUser
  fetchCreateUser: '/User/create', // fetchCreateUser
  fetchUpdateUser: '/user/update', // fetchUpdateUser
  getAutoCode: '/user/get-suggest-user-code', // getAutoCode
  fetchDetailUpdate: '/user/get-detail-update', // fetchDetailUpdate

}

export default UserService
