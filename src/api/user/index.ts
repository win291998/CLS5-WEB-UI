const UserService = {

  // dowload file sample
  GenerateExcelTemplateCreateUsers: 'user/generate-excel-template-create-users',
  GetTemplateExcelUpdateEmailUser: '/User/get-template-excel-update-email-user',
  GetTemplateExcelUpdateKpiUser: '/User/get-template-excel-update-kpi',
  GetTemplateExcelUpdateProficiencyUser: '/Proficiency/generate-excel-template-proficiency',
  DownloadFileSampleUser: 'user/excel-template-change-info',
  downloadSampleFileUpdateTitle: '/User/excel-template-change-title',
  downloadSampleFileAddUser: '/user/generate-excel-template-create-users',

  // import file
  UpdateInforUserExcel: '/User/update-email-excel',
  UpdateKpiUserExcel: '/User/update-kpi-excel',
  UpdateProficiencyUserExcel: '/Title/import-excel-create-proficiency',
  UpdateFileUserInfor: '/user/import-excel-change-info',
  updateTitleFromFile: '/User/import-excel-change-title',
  AddUserFromFile: '/user/import-user-from-json',

  // export file
  exportUserToExcel: 'user/export-excel-users',

  /// user type
  RoleFeaturePermission: '/usertype/get-feature-permission-by-portal',

  /** GET */
  GetListIdStructureUser: '/user/get-list-id-from-structure-by-user',
  GetOrganizationalStructure: '/organizationalstructure/get-all',
  GetListCustomerRequest: '/Customer/get-list',
  GetRegisterConfig: '/RegistryConfiguration/get',
  GetOrgById: '/organizationalstructure/get-by-id',
  getPagingUserByList: 'user/get-info-user-by-ids',
  getPagingUserOrgByList: 'organizationalstructure/get-list-user',
  getTitleById: 'title/get-by-id',
  getProficiencyData: 'proficiency/get-all',
  GetUserExclude: '/user/get-list-user-id-by-structure',

  /** POST */
  PostApproveCustomer: 'Customer/approve',
  PostOrgCreate: 'organizationalstructure/create',
  PostOrgUpdate: 'organizationalstructure/update',
  PostPeopleRolevalue: '/user/get-paging-people-by-rolevalue',
  PostAddUserOrg: '/organizationalstructure/add-user',
  PostUpdateUserOrg: '/organizationalstructure/update-user',
  PostDeleteUserOrg: '/organizationalstructure/delete-user',

  /** Put */
  PutReturnCustomer: 'Customer/deny',

  /** delete */
  deleteCustomer: '/Customer/delete', // Xóa người dùng
  DeleteOrgStruct: '/organizationalstructure/delete-change-orstrucnew',
  DeleteTitleOrgStruct: '/title/delete-listIds',

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
  fetchNameSchools: '/school/get-combobox', // get name schools
  fetchDegrees: '/Degree/get-combobox', // get bằng cấp trình độ '
  fetchCountry: '/Address/get-countries', // get country
  fetchProvinces: '/Address/get-provinces', // get provinces
  fetchDistricts: '/Address/get-districts', // get districts
  fetchWards: '/Address/get-wards', // get districts
  GetPagingByUser: '/usergroup/get-paging-by-user', // GetPagingByUser
  DeleteGroupWithUser: '/usergroup/delete-group-with-user', // GetPagingByUser
  GetPagingUserGroup: '/usergroup/get-paging-user-group-by-list', // GetPagingUserGroup
  /** POST */
  PostAddGroupUser: 'usergroup/add-group-with-user',
  PostCreateTitle: 'title/create',
  PostUpdateTitle: 'title/update',

  /** Nhóm người dùng */
  ListGroup: '/usergroup/get-all-paging',
  AddGroup: '/usergroup/create',
  DetailGroup: '/usergroup/get-by-id',
  UpdateGroup: '',
  DeleteGroup: '/usergroup/delete-list',
  ImportFileGroup: '/usergroup/import-group-user-from-json',
  DownloadFileSampleGroup: '/usergroup/generate-excel-template-group-users',
  DownloadFileSampleAddUser: '/UserGroup/generate-template-excel-add-list-user',
  ImportAddUserToGroup: '/UserGroup/import-list-user-from-excel',

  // người dùng
  ListUser: '/usergroup/get-list-user',
  ListUserAdd: '/user/get-list-user',
  DeleteUser: '/usergroup/delete-user',
  GroupUserCombobox: '/usergroup/get-combobox',
  CategoryTitleCombobox: '/categorytitle/get-combobox',
  TitleCombobox: '/Title/get-list-distinct',
  AddUserGroup: '/usergroup/add-user',
  MoveUser: '/UserGroup/move-group',
  UserExclude: '/user/get-list-user-id-by-structure',

  // Khóa học
  ListCourse: '/course/get-by-group-user',
  ListCourseAdd: '/course/get-paging-services',
  AddCourse: '/course/add-course-to-group-user',
  TopicCourse: '/topic/get-combobox-topic-course',
  CourseExclude: '/course/get-list-course-by-structure',
  DeleteCourse: '/course/delete-course-without-group-user',
}

export default UserService
