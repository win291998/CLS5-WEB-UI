const QuestionService = {
  /** Get */
  GetListExam: '/exam/get-paging',
  GetDetailExam: '/exam/get-update-exam-id',
  GetListQuestion: '/question/get-list-question-paging',
  GetComboboxQuestionLevel: 'questionlevel/get-combobox',
  GetComboboxQuestionType: 'question/get-combobox-question-type',
  GetListQuestionById: 'question/get-answer-from-question',
  GetListApprove: 'surveyExam/get-paging-agree-survey-exam',
  GetFeedBackRejectSurvey: 'surveyexam/get-feedback-survey-exam',
  GetDetailSurvey: '/surveyexam/get-by-id',
  GetListSurveyTopics: '/surveytest/get-paging-test-survey-exam',
  GetDetailSurveyTopic: '/surveytest/get-by-id',
  GetListSurvey: '/survey/get-list-survey-paging',
  GetSurveyType: '/survey/get-combobox-survey-type',
  GetListGroupFromSurvey: '/usergroup/get-paging-user-group-by-list',
  GetListPeople: '/surveytest/get-list-people',
  GetListTestSurvey: '/surveytestcode/get-paging-survey-test-code',
  GetListTestSurveyFromBankSurvey: '/survey/get-list-survey-paging',
  GetDetailTestSurvey: '/surveytestcode/get-by-id',
  GetListQuestionSurveyById: '/surveytestcode/get-list-question',
  GetListApproveSurveyTest: '/surveytestCode/get-paging-send-agree-test-code-survey-exam',

  /** Post */
  PostDeleteExam: '/exam/delete',
  PostCreateExam: '/exam/create',
  PostUpdateExam: '/exam/update',
  PostCreateSurvey: '/surveyexam/create',
  PostAgreeSurvey: '/surveyexam/save-agree-exam',
  PostRejectSurvey: '/surveyexam/save-reject-survey-exam',
  PostSendApproveSurvey: '/surveyexam/send-agree-survey-exam',
  PostCreateSurveyTopic: '/surveytest/create',
  PostUpdateSurveyTopic: '/surveytest/update',
  PostGetListInfobyTest: 'ExamTest/get-info-by-test',
  PostAddSurvey: 'survey/create',
  PostUpdateSurvey: '/survey/update',
  PostSurveyDetail: 'survey/get-survey-detail',
  PostListUserAddTest: '/ExamTest/get-info-user-add-test',
  PostAddUserToSurvey: '/surveytest/add-user',
  PostDeleteUserFromSurvey: '/surveytest/delete-user',
  PostCreateGroupUser: '/surveytest/create-group-user',
  PostGetListTestById: '/survey/get-survey-detail',
  PostCreateTestSurvey: '/surveytestcode/create',
  PostUpdateTestSurvey: '/surveytestcode/update',
  PostAgreeSurveyTest: '/surveytestCode/save-agree-survey-test-code',
  PostRejectSurveyTest: '/surveytestCode/save-reject-survey-test-code',
  PostRecallRequestSurveyTest: '/surveyTestCode/recall-request-survey-test-code',
  PostCreateOrgStrSurveyTest: '/surveytest/create-organizational-structures',

  /** Delete */
  DeleteSurveyTopic: '/surveytest/delete',
  DeleteSurveyTest: '/surveytestcode/delete',

  /** Put */
  /** Update */

  /** apiv5 */
  GetDetailQuestion: (id: number) => `/questions/${id}`,
  GetListQuestionV5: '/questions',
  AddQuestion: '/questions',

}

export default QuestionService
