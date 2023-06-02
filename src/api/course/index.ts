const CourseService = {
  /** Get */
  GetCourseOrgStruct: '/course/get-by-organizational-structures',
  GetListCourseAdd: '/course/get-paging-services',
  GetCourseExclude: '/course/get-list-course-by-structure',
  GetCourseList: '/Course/get-list',
  GetCheckApprove: '/Course/check-valid-to-approve',
  GetCourseSetting: '/coursecontent/get-require-point',

  /** Post */
  PostAddCourseOrg: '/course/add-course-to-organizational-structures',
  PostDeleteCourseOrg: '/course/delete-course-without-organizational-structures',
  PostUpdatePointCourse: '/coursecontent/save-require-point',
  PostDeleteCourse: '/course/delete',
  PostApproveCourse: '/course/save-agree-course', // duyệt khóa học
  PostSendApproveCourse: '/course/send-agree-course', // Gửi duyệt khóa học

  /** Delete */

  /** Put */
  /** Update */
  /** patch */
  PatchAddAprover: '/Course/add-approver',
}

export default CourseService
