const CourseService = {
  /** Get */
  GetCourseOrgStruct: '/course/get-by-organizational-structures',
  GetListCourseAdd: '/course/get-paging-services',
  GetCourseExclude: '/course/get-list-course-by-structure',
  GetCourseList: '/Course/get-list',
  GetCheckApprove: '/Course/check-valid-to-approve',
  GetCourseSetting: '/coursecontent/get-require-point',
  GetPagingAgreeCourse: '/course/get-paging-agree-course',
  GetFeedBackCourse: '/course/get-feedback-course', // lấy phản hồi khóa học
  GetDetailCourseById: '/course/get-detail-information', // lấy phản hồi khóa học
  GetAuthorCourseById: '/course/get-authors', // lấy phản hồi khóa học
  GetRequiredProficiencies: '/course/get-required-proficiencies', // lấy danh sách năng lực theo yêu cầu
  GetRequiredCourse: '/course/get-required-courses', // lấy danh sách khóa học theo yêu cầu
  GetRequiredFinishCourse: '/course/get-required-finish', // lấy điều kiện hoàn thành

  /** Post */
  PostAddCourseOrg: '/course/add-course-to-organizational-structures',
  PostDeleteCourseOrg: '/course/delete-course-without-organizational-structures',
  PostUpdatePointCourse: '/coursecontent/save-require-point',
  PostDeleteCourse: '/course/delete',
  PostApproveCourse: '/course/save-agree-course', // duyệt khóa học
  PostSendApproveCourse: '/course/send-agree-course', // Gửi duyệt khóa học
  PostSendRejectCourse: '/course/reject-course', // Từ chối khóa học
  PostAddInforCourse: '/course/add-course-information', // Thêm khóa học
  PostUpdateInforCourse: '/course/update-course-information', // Cập nhật khóa học
  PostUpdateSettingCourse: '/course/update-setting', // Thêm khóa học
  PostDeleteRequiredProficiencies: '/course/delete-required-proficiency', // Xóa năng lực theo yêu cầu
  PostAddProficiencies: '/course/add-required-proficiency', // Xóa năng lực theo yêu cầu
  PostDeleteCourseRequired: '/course/delete-required-course', // Xóa năng lực theo yêu cầu
  PostAddCourseRequired: '/course/add-required-course', // Thêm khóa học theo yêu cầu
  PostUpdateFinishRequired: '/course/update-required-finish', // Thêm điều kiện hoàn thành

  /** Delete */

  /** Put */
  /** Update */
  /** patch */
  PatchAddAprover: '/Course/add-approver',
}

export default CourseService
