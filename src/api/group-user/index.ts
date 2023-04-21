const GroupUserService = {
  /** Get */
  ListGroup: '/usergroup/get-all-paging',
  AddGroup: '/usergroup/create',
  DetailGroup: '/usergroup/get-by-id',
  UpdateGroup: '',
  DeleteGroup: '/usergroup/delete-list',

  // người dùng
  ListUser: '/usergroup/get-list-user',
  ListUserAdd: '/user/get-list-user',
  GroupUserCombobox: '/usergroup/get-combobox',
  CategoryTitleCombobox: '/categorytitle/get-combobox',
  TitleCombobox: '/Title/get-list-distinct',
  AddUserGroup: '/usergroup/add-user',
  MoveUser: 'UserGroup/move-group',
  UserExclude: 'UserGroup/move-group',

  // Khóa học
  ListCourse: '/course/get-by-group-user',
  ListCourseAdd: '/course/get-paging-services',
  AddCourse: '/course/add-course-to-group-user',
  TopicCourse: '/topic/get-combobox-topic-course',
  CourseExclude: '/course/get-list-course-by-structure',
}

export default GroupUserService
