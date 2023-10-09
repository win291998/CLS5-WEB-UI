import { defineStore } from 'pinia'
import * as signalR from '@microsoft/signalr'
import ExamService from '@/api/exam'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { fetchData } from '@/mock/exam/'
import processLocalData from '@/stores/user/exam/processDataLocal'
import ExamMethodsUtil from '@/stores/user/exam/examMethod'

export const myExamManagerStore = defineStore('myExamManager', () => {
  /** store */
  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()
  const isReview = ref(false)
  const examData = ref<any>({})
  const isComplete = ref(false)
  const isDoing = ref(false)
  const isSuspendedExam = ref(false)
  const isExamAntiCheating = ref(false)
  const disableSubmitBtn = ref(false)
  const storageKey = ref('exam')
  const userViolation = ref<any>()
  const connection = ref<any>(null)
  const examId = ref<any>(null)
  const quantityFileUploading = ref<number>(0)
  const numberOfRetake = ref<any>(null)
  const timer = ref<any>(null)

  /** question */
  const questionStore = ref<any>()
  const questions = ref<any>()
  const totalQuestion = ref(0)
  const totalPoint = ref(0)
  const amountAnswered = ref<any>()
  const reviewOption = ref<any>()
  const localData = ref<any>()
  const pageOption = ref({
    pageNumber: 1,
    pageSize: 5,
  })

  /** ********************************** signal *************************/

  function connectionSignalR() {
    try {
      const serverToken = localStorage.getItem('accessToken')
      const url = `${window.SERVER_SIGNAL}/hubs/examhub?access_token=${serverToken}`
      connection.value = new signalR.HubConnectionBuilder()
        .withUrl(url, {
          transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build()
      connection.value
        .start()
        .then(() => {
          // this.initalAttemptForChat = true
          connection.value.invoke(
            'ConnectToExam',
            examData.value.examineeId,
            examData.value.testId,
            examData.value.testShiftId !== null ? examData.value.testShiftId : 0,
          )

          // // event  nhận tin nhắn
          // connection.value.on('ReceiveDirectMessageLearner', message => {
          //   this.recieveMessage(message.message)
          // })

          // // event yêu cầu nhận diện
          // connection.value.on('IdentifyUser', message => {
          //   if (message) {
          //     if (navigator.mediaDevices) {
          //       navigator.mediaDevices
          //         .getUserMedia({ video: true, audio: false })
          //         .then(stream => {
          //           this.accessDeviceContent = this.$t(
          //             'tests.exam.access-camera',
          //           )
          //           this.isHaveDevice = true

          //           // this.selectSupervisionId = message.requestBy
          //           this.checkShowModalIdentified()
          //         })
          //         .catch(err => {
          //           this.accessDeviceContent = this.$t(
          //             'tests.exam.no-device',
          //           )
          //           this.isHaveDevice = false
          //           this.checkShowModalIdentified()
          //         })
          //     }
          //     else {
          //       this.accessDeviceContent = this.$t('tests.exam.no-device')
          //       this.isHaveDevice = false
          //       this.checkShowModalIdentified()
          //     }
          //   }
          // })

          // // xử lý vi phạm
          // connection.value.on('HandleViolation', message => {
          //   if (message) {
          //     switch (message.type) {
          //       case 1:
          //         // eslint-disable-next-line no-case-declarations
          //         let messageContent = ''
          //         if (message?.reason) {
          //           messageContent = `${this.$t(
          //             'tests.exam.you-have-deducted',
          //           )} ${message.minusPoint} ${this.$t(
          //             'tests.exam.with-reason',
          //           )} ${message.reason}`
          //         }
          //         else {
          //           messageContent = `${this.$t(
          //             'tests.exam.you-have-deducted',
          //           )} ${message.minusPoint} ${this.$t(
          //             'common.point',
          //           )}`
          //         }
          //         this.$bvToast.toast(messageContent, {
          //           title: this.$t('common.notification'),
          //           variant: 'warning',
          //           toaster: this.$toastPosition,
          //           solid: true,
          //         })
          //         break
          //       case 2:
          //         // xóa thông tin lưu đáp án
          //         localStorage.removeItem(this.storageKey)
          //         this.$refs['exam-direction']?.stopTimerExam()
          //         if (message?.reason) {
          //           this.contentConfirmModal = `${this.$t(
          //             'tests.exam.suspending-message',
          //           )}<br>${this.$t('report.reason')}: ${message.reason}`
          //         }
          //         else {
          //           this.contentConfirmModal = `${this.$t(
          //             'tests.exam.suspending-message',
          //           )}`
          //         }
          //         this.isSuspendedExam = true
          //         connection.value.invoke(
          //           'RegisterSuspended',
          //           examData.value.examineeId,
          //           examData.value.testId,
          //           examData.value.testShiftId,
          //         )
          //         this.$bvModal.show(this.notificationModalId)
          //         break
          //       default:
          //         break
          //     }
          //   }
          // })
        })
        .catch(() => {
          // this.initalAttemptForChat = false
          connection.value = null
        })
    }
    catch (e) {
      toast('ERROR', t('no-connection-to-server'))
      throw e
    }
  }
  async function disConnectSignalR() {
    // phát sing signal disconnect
    await connection.value.invoke(
      'DisConnectToExam',
      examData.value.examineeId,
      examData.value.testId,
      examData.value.testShiftId !== null ? examData.value.testShiftId : 0,
    ).catch(() => {
      toast('ERROR', t('no-connection-to-server'))
    })
    if (connection.value?.stop())
      connection.value?.stop()?.catch(() => { toast('ERROR', t('no-connection-to-server')) })
  }

  /** ********************************** signal *************************/
  /** ********************************** Thiết lập  bài làm *************************/
  // lấy thông tin kỳ thi
  async function getExamInfo() {
    if (!isReview.value) {
      const params = {
        testId: Number(route.params.id),
        shiftId: 0,
      }
      return await MethodsUtil.requestApiCustom(ExamService.GetExamInfo, TYPE_REQUEST.GET, params).then(async (result: any) => {
        if (!result.testShiftId || result.testShiftId === null)
          result.testShiftId = 0
        if (result?.isComplete === true) {
          isComplete.value = true
          return
        }
        if (result?.isSuspended === true) {
          examData.value = result
          isSuspendedExam.value = true
          return
        }
        await getDateServer()
        if (!result.testShiftId || result.testShiftId === null)
          result.testShiftId = 0

        if (result?.listTimeShot?.length)
          result.listTimeShot = result.listTimeShot.map((item: any) => parseInt(item, 10))

        examData.value = result.data
        const { isFullScreen, notPageSwitching, examineeStartTime } = examData.value
        if (isFullScreen || notPageSwitching)
          isExamAntiCheating.value = true

        handleAntiCheating(isFullScreen, notPageSwitching, examineeStartTime)
        storageKey.value = `exam_T${examData.value.testId}_E${examData.value.examineeId}`
      }).catch(() => {
        router.push({ name: 'error-404' })
      })
    }
    else {
      const params = {
        id: Number(route.params.id),
      }
      MethodsUtil.requestApiCustom(ExamService.GetExamResultInfo, TYPE_REQUEST.GET, params).then((result: any) => {
        examData.value = result.data
      })
    }
  }

  const timeServer = ref()
  const joinExamTime = ref()
  async function getDateServer() {
    // MethodsUtil.requestApiCustom(SystemService.TimeServer, TYPE_REQUEST.GET).then((result: any) => {
    //   timeServer.value = (result?.code === 200 && result?.data) ? result?.data : (new Date()).toISOString()
    //   joinExamTime.value = (new Date()).toISOString()
    // })
  }

  /** ********************************** Thiết lập  bài làm  *************************/
  /** ********************************** Question *************************/
  const isMobileDevice = ref(MethodsUtil.deviceType() !== 'desktop')
  async function getTestQuestion() {
    // lấy đề
    await fetchData().then(async (value: any) => {
      questionStore.value = value.data.questions
      if (!window._.isEmpty(examData.value)) {
        if (examData.value.totalQuestionDisplayInPage)
          pageOption.value.pageSize = examData.value.totalQuestionDisplayInPage

        else
          pageOption.value.pageSize = isMobileDevice.value ? 10 : questionStore.value.length
      }

      // xử lý dữ liệu đề
      if (isReview.value !== true) {
        await initLocalData()
      }

      else {
        // xử lý dữ liệu xem
        ExamMethodsUtil.standardizedDataReview(questionStore.value)
      }

      totalPoint.value = value.data.totalPoint
      totalQuestion.value = questionStore.value.length
    })
  }

  // lấy đề thi từ database
  async function getExamQuestions() {
    const response = null

    // Trường hợp xem lại bài thi|khảo sát
    if (isReview.value === true) {
      // lấy nội dung xem lại bài thi
      const params = {
        id: examId.value, numberOfRetake: numberOfRetake.value,
      }
      MethodsUtil.requestApiCustom(ExamService.GetQuestionResult, TYPE_REQUEST.GET, params).then((result: any) => {
        examData.value = result.data
        examData.value.testCodeId = examId.value
        reviewOption.value = {
          isCorrectAnswer: examData.value?.reviewId === 3 ? examData.value.isCorrectAnswer : false,
          isDisplayResult: examData.value?.reviewId === 3 ? examData.value.isDisplayResult : false,
          isDisplayFalseAnswer: examData.value?.reviewId === 3 ? examData.value.isDisplayFalseAnswer : false,
          reviewId: examData.value.reviewId,
        }
      })
    }
    else {
      const params = {
        testCodeId: examData.value.testCodeId,
      }
      await MethodsUtil.requestApiCustom(ExamService.GetQuestionExamId, TYPE_REQUEST.GET, params).then(async (result: any) => {
        result?.data?.items.forEach((element: any) => {
          element.isAnswered = false
        })
        questionStore.value = result?.data?.items || []

        // lấy số câu hiển thị trên trang
        if (examData.value) {
          pageOption.value.pageSize = (examData.value.totalQuestionDisplayInPage && (examData.value.totalQuestionDisplayInPage !== 0))
            ? examData.value.totalQuestionDisplayInPage
            : questionStore.value.length
        }
        if (isReview.value !== true)
          await initLocalData()

        else
          ExamMethodsUtil.standardizedDataReview(questionStore.value, false)
      })
    }
  }

  // lấy danh sách câu hỏi theo phân trang
  async function fetchQuestion() {
    const begin = (pageOption.value.pageNumber - 1) * pageOption.value.pageSize
    questions.value = questionStore.value.slice(
      begin,
      begin + pageOption.value.pageSize,
    )
  }

  // cập nhật số câu trả lời
  function updateAmountAnswered() {
    amountAnswered.value = questionStore.value.filter(
      (qs: any) => qs.isAnswered === true,
    ).length
  }

  // set local storage
  async function initLocalData() {
    localData.value = JSON.parse(`${localStorage.getItem(storageKey.value)}`)
    console.log(localData.value)
    if (!localData.value || localData.value === null) {
      // dữ liệu local storage
      localData.value = {
        startTime: null,
        examineeId: examData.value.examineeId,
        questions: [],
      }

      // lấy dữ liệu từ log
      console.log(examData.value?.writeLogMinute, examData.value?.examineeStartTime)

      if (examData.value?.writeLogMinute && examData.value?.examineeStartTime !== null) {
        const params = {
          testId: examData.value.testId,
          examineeId: examData.value.examineeId,
          shiftId:
            examData.value.testShiftId !== null ? examData.value.testShiftId : 0,
          pageSize: questionStore.value.length,
          pageNumber: 1,
        }
        await MethodsUtil.requestApiCustom(ExamService.GetStudentExamLog, TYPE_REQUEST.GET, params).then((result: any) => {
          ExamMethodsUtil.synchronizedFromLog(questionStore.value, result.data)
        })
      }
      questionStore.value.forEach((element: any) => {
        localData.value.questions.push(
          ExamMethodsUtil.getLocalDataFromQuestion(element),
        )
      })
      localStorage.setItem(storageKey.value, JSON.stringify(localData.value))
    }
    else {
      ExamMethodsUtil.getDataFromDataLocal(
        questionStore.value,
        localData.value.questions,
      )
    }
  }

  /** ********************************** Question *************************/
  /** ********************************** Thiết lập các cài đặt để xử lý gian lận *************************/
  async function handleAntiCheating(isFullScreen: boolean, notPageSwitching: any, examineeStartTime: any) {
    if (!isFullScreen && !notPageSwitching)
      return

    const params = {
      examineeId: examData.value.examineeId,
    }
    MethodsUtil.requestApiCustom(ExamService.GetViolationUser, TYPE_REQUEST.GET, params).then((result: any) => {
      if (result?.isSuspended) {
        // BE lỗi nên check ở đây
        examData.value.isSuspended = true
        handleSuspendUser()
        return
      }
      result = {
        ...result,
        type: 1,
        isFullScreen,
        notPageSwitching,
        isWarning: false,
      }
      result.numberWarning = result.numberWarning || 0
      userViolation.value = result
      disableSubmitBtn.value = true
    })
  }
  function handleSuspendUser() {
    // if (this.connection) {
    //   connection.value.invoke(
    //     'RegisterSuspended',
    //     examData.value.examineeId,
    //     examData.value.testId,
    //     examData.value.testShiftId,
    //   )
    // }
    // if (this.storageKey)
    //   localStorage.removeItem(this.storageKey)
    // this.$refs['exam-direction']?.stopTimerExam()
    // window.removeEventListener('blur', this.handleChangeTab)
    // window.removeEventListener('focus', this.handleFocusExam)
    // document.removeEventListener('mouseleave', this.mouseLeave)
    // const violation = {
    //   isSuspended: true,
    // }
    // if (this.userViolation?.numberWarning)
    //   violation.numberWarning = this.userViolation.numberWarning

    // if (this.userViolation?.maximumViolation)
    //   violation.maximumViolation = this.userViolation.maximumViolation

    // this.userViolation = violation
    // this.isSuspendedExam = true
    // this.$nextTick(() => {
    //   this.$bvModal.show('anti-cheating')
    // })
  }

  // lấy danh sách giám sát thi
  const supervisor = ref()
  async function fetchSupervisions() {
    const params = {
      id: examData.value.testId,
    }

    MethodsUtil.requestApiCustom(ExamService.GetSupervisions, TYPE_REQUEST.GET, params).then((result: any) => {
      // const users = await shared.getUserInfoByIds(data)
      // supervisor.value = users.pageLists
    })
  }

  /** ********************************** Thiết lập các cài đặt để xử lý gian lận *************************/

  /** ********************************** doing *************************/

  const isShowModalSubmit = ref(false)
  async function handleStartExam() {
    connectionSignalR()

    // let isStart = false
    // examData.value.timeRemaining = 0
    // let timeRemaining = 0

    // // gọi lại lấy giờ server
    // await this.getDateServer()
    // const timeServer = this.getTimeFormTimeServer()
    // if (examData.value.examineeStartTime !== null) {
    //   isStart = true
    //   if (!this.isSurvey) {
    //     this.continueExam()
    //     this.connectionSignalR()

    //     // Nếu bảo toàn thời gian
    //     if (examData.value?.isPreserveTime)
    //       timeRemaining = (examData.value.minuteOfWork * 60 - Math.round(examData.value?.totalWork || 0)) / 60
    //   }
    //   if (examData.value.minuteOfWork !== 0 && (this.isSurvey || !examData.value?.isPreserveTime)) {
    //     timeRemaining = examData.value.minuteOfWork
    //                   - (new Date(timeServer) - new Date(examData.value.examineeStartTime)) / 1000 / 60
    //   }
    // }
    // else {
    //    localData.value.createdDate = timeServer
    //   localStorage.setItem(this.storageKey, JSON.stringify( localData.value))

    //   // ghi thời gian bắt đầu làm bài
    //   const response = await this.$store.dispatch(
    //     `${MY_EXAM_STORE_MODULE}/${
    //       this.isSurvey !== true ? 'startExam' : 'startSurvey'
    //     }`,
    //     { examineeId: examData.value.examineeId },
    //   )
    //   if (response?.code === 200) {
    //     isStart = true
    //     timeRemaining = examData.value.minuteOfWork
    //     if (!this.isSurvey)
    //       this.connectionSignalR()
    //   }
    // }
    // if (isStart === true) {
    //   this.viewMode = 'doing'

    //   if (examData.value.writeLogMinute > 0) {
    //     this.timeLog = examData.value.writeLogMinute * 60
    //     this.startTimerSaveLog()
    //   }
    //   if (examData.value.minuteOfWork !== 0) {
    //     // Nếu không duy trì trạng thái thi khi thời gian kì thi kết thúc
    //     if (!examData.value?.isMaintainStatus) {
    //       const endTimeThematicExam = (new Date(examData.value.endTime) - new Date(timeServer)) / 1000 / 60
    //       examData.value.timeRemaining = Math.min(timeRemaining, endTimeThematicExam)
    //     }
    //     else {
    //       examData.value.timeRemaining = timeRemaining
    //     }
    //     if (examData.value.timeRemaining <= 0)
    //       this.submitExam(1)
    //   }
    //   this.$nextTick(() => {
    //     if (this.$refs['exam-direction'])
    //       this.$refs['exam-direction'].startExame()
    //   })
    //   return true
    // }
    // return false
  }
  function confirmSubmit() {
    isShowModalSubmit.value = true
  }
  function setQuantityUploadingFile(quantity: any) {
    if (quantity !== 0) {
      const qty = quantityFileUploading.value + quantity
      if (qty >= 0)
        quantityFileUploading.value = qty
    }
    else {
      quantityFileUploading.value = 0
    }
  }

  // nộp bài kiểm tra
  async function submitExam(submitId: number) {
    // submitId 1: Hệ thống, 2: Người dùng
  //  handleDisableAntiCheating(true)
    if (submitId === 1) {
      // Tự động nộp bài cho thí sinh khi đã hết thời gian thi
      toast('WARNING', t('time-out-exam'))
    }

    // lưu lại log exam khi nộp bài
    saveUserAnswer(true, 1)
    const result = await saveUserAnswer(false, submitId)
    if (result === false) {
      // this.isSubmitting = false
      // this.$bvModal.show(this.submitErrorModalId)
      // if (this.$refs['exam-direction'] && !this.isSurvey)
      //   this.$refs['exam-direction'].stopTimerExam()

      // return
      toast('WARNING', t('nộp bài lỗi'))
    }
    clearInterval(timer.value)

    setQuantityUploadingFile(0)
    localStorage.removeItem(storageKey.value)

    // router.push({
    //   name: 'my-test-result',
    //   params: { id: route.params.id },
    //   query: {
    //     id: examData.value.testCodeId,
    //     checkCert: 'true',
    //   },
    // })
    if (connection.value !== null) {
      connection.value.invoke(
        'CompleteExam',
        examData.value.examineeId,
        examData.value.testId,
        examData.value.testShiftId ?? 0,
      )
    }
  }

  // Lưu câu trả lời của người dùng
  async function saveUserAnswer(isSaveLog: any, submitId: any) {
    // !isSaveLog: Nộp bài; submitId(1: Hệ thống, 2: Người dùng)
    let data: any = null
    let model = null
    let localStorageData: any

    // if (isSaveLog === true) {
    //   // kiểm tra thêm sự thay đổi ở local storage, khi chưa đến thời gian ghi log người dùng thoát ra và vào lại kì thi
    //   localStorageData = JSON.parse(localStorage.getItem(storageKey.value) ?? '{}') || {}
    //   data = processLocalData.getExamUserAnswerChange(questionStore.value, localStorageData)
    // }
    // else {
    data = processLocalData.getExamUserAnswer(questionStore.value)

    // }

    if (isSaveLog === true) {
      if (data?.listData.length > 0 || submitId === 1) {
        model = {
          testId: examData.value.testId,
          shitfId: examData.value.testShiftId,
          examineeId: examData.value.examineeId,
          questions: data?.listData || [],
          createdDate: localStorageData?.createdDate || null,
        }

        // MethodsUtil.requestApiCustom(ExamService.PostStudentExamLog, TYPE_REQUEST.POST, model).then((result: any) => {
        //   questionStore.value.forEach((element: any) => {
        //     element.listQuestions.forEach((question: any) => {
        //       question.isDataChange = false
        //     })
        //   })
        //   if (localStorageData?.questions?.length) {
        //     localStorageData?.questions?.forEach((el: any) => {
        //       el?.questions?.forEach((q: any) => {
        //         q.isDataChange = false
        //       })
        //     })
        //     localStorage.setItem(storageKey.value, JSON.stringify(localStorageData))
        //   }
        // })
      }
      return true
    }
    const params = {
      testCodeId: examData.value.testCodeId,
      listData: data?.listData || [],
      submitId,
      testLearnerMapId: examData.value.examineeId,
    }

    // MethodsUtil.requestApiCustom(ExamService.PostSaveUserAnswer, TYPE_REQUEST.POST, params).then((result: any) => {
    //   return true
    // }).catch(() => {
    //   return false
    // })

    return false
  }

  /** ********************************** doing *************************/

  /** ********************************** camera *************************/
  const isSharingCamera = ref<boolean | null>(null)
  const captureCamera = ref<any>({})
  function requestPermisionCamera(event: any) {
    if (captureCamera.value.isLoadCamera && captureCamera.value.stream)
      return
    if (event.target.state === 'denied') {
      captureCamera.value.stream = null
      isSharingCamera.value = false
    }
    else {
      grantPermissionsCamera()
    }
  }
  async function checkCamera() {
    if (navigator?.mediaDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      if (videoDevices.length) {
        navigator.permissions.query({ name: 'camera' } as any)
          .then(permissionObj => {
            permissionObj.onchange = event => {
              requestPermisionCamera(event)
            }

            if (permissionObj.state === 'denied')
              isSharingCamera.value = false

            if (permissionObj.state === 'granted')
              isSharingCamera.value = true
          })
      }
    }
  }
  async function grantPermissionsCamera() {
    if (navigator?.mediaDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      if (videoDevices.length) {
        navigator.permissions.query({ name: 'camera' } as any)
          .then(permissionObj => {
            permissionObj.onchange = event => {
              requestPermisionCamera(event)
            }

            if (permissionObj.state === 'denied') {
              isSharingCamera.value = false
              toast('WARNING', t('you-need-grant-camera-permission'))
            }
            else {
              loadCamera()
            }
          })
          .catch(() => {
            isSharingCamera.value = false
            captureCamera.value = {
              isLoadCamera: false,
              stream: null,
              video: null,
            }
          })
      }
    }
  }
  const cameraRef = ref()
  function videoOnendedCamera(event: any) {
    isSharingCamera.value = false
    captureCamera.value = {
      isLoadCamera: false,
      stream: null,
      video: null,
    }
  }
  async function loadCamera() {
    if (cameraRef.value)
      captureCamera.value.video = cameraRef.value

    else
      captureCamera.value.video = null

    if (navigator.mediaDevices) {
      captureCamera.value.isLoadCamera = true
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then(stream => {
          stream.getVideoTracks()[0].onended = event => {
            videoOnendedCamera(event)
          }
          captureCamera.value.stream = stream
          if (cameraRef.value) {
            // video kiểm tra camera ở start exam
            captureCamera.value.video.srcObject = stream
            captureCamera.value.video.play()
          }
          isSharingCamera.value = true
          captureCamera.value.isLoadCamera = false
        })
        .catch(err => {
          if (err?.message === 'Permission denied')
            toast('WARNING', t('you-need-grant-camera-permission'))

          captureCamera.value.isLoadCamera = false
          isSharingCamera.value = false
        })
    }
    else {
      isSharingCamera.value = false
    }
  }

  /** ********************************** camera *************************/
  /** ********************************** screen *************************/
  const captureStream = ref<any>({})
  const isSharingFullScreen = ref<boolean | null>(null)
  async function grantSharingScreenPermission() {
    captureStream.value.amount += 1
    try {
      captureStream.value.isReqShareScreen = true
      await navigator.mediaDevices
        .getDisplayMedia({
          video: true,
          audio: false,
        })
        .then(async stream => {
          const { displaySurface } = stream.getVideoTracks()[0].getSettings()
          if (displaySurface === 'monitor') {
            captureStream.value.stream = stream
            isSharingFullScreen.value = true
            stream.getVideoTracks()[0].onended = event => {
              videoScreenOnended(event)
            }
          }
          else {
            stream.getVideoTracks()[0].stop()
            captureStream.value.stream = null
            isSharingFullScreen.value = false
            toast('WARNING', t('you-need-grant-full-screen-permission'))

            // số lần chọn lại <= 3
            if (captureStream.value.stream === null && captureStream.value.amount <= 3)
              await grantSharingScreenPermission()
          }
          captureStream.value.isReqShareScreen = false
        })
    }
    catch (err) {
      isSharingFullScreen.value = false
      captureStream.value.isReqShareScreen = false
      captureStream.value = {
        stream: null,
        image: null,
        video: null,
        amount: 0,
        isReqShareScreen: false,
      }
    }
  }
  function videoScreenOnended(event: any) {
    isSharingFullScreen.value = false
    captureStream.value = {
      stream: null,
      image: null,
      video: null,
      amount: 0,
      isReqShareScreen: false,
    }
  }

  /** ********************************** camera *************************/
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    isReview, // trạng thái xem
    examData, // thông tin kỳ thi
    timeServer, // thời gian sever
    joinExamTime, // thời gian tham gia thi
    isComplete, // trạng thái kỳ thi hoàn thành
    isSuspendedExam, // trạng thái kỳ thi bị đình chỉ
    isExamAntiCheating, // trạng thái kì thì được thiết lập chống gian lận
    storageKey, // key local kỳ thi
    userViolation, // vi phạm của người dùng
    disableSubmitBtn, // trạng thái ẩn button nộp bài
    questionStore, // danh sách câu hỏi
    questions, // danh sách câu hỏi
    totalQuestion, // tổng số câu hỏi
    totalPoint, // tổng đểm câu hỏi
    isDoing, // trạng thái tiếp tục làm bài thi
    examId, // id bài thi khi xem lại
    numberOfRetake, // lần xem lại bài kiểm tra
    pageOption,
    isShowModalSubmit, // show modal confirm nộp bài
    // số lượng file đang tải lên ở trang hiện tại
    // dùng khi đề thi có thiết lập chống gian lận và có nhiều trang
    // nếu đang upload file ở câu hỏi chưa xong thì cảnh báo khi người dùng chuyển trang
    quantityFileUploading,

    ////
    connectionSignalR, // kết nối signal
    disConnectSignalR, // ngắt kết nối signal
    getExamInfo, // lấy thông tin kỳ thi
    getDateServer, // lấy thời gian sever
    handleStartExam, // hành động bắt đầu làm bài
    handleSuspendUser, // hanhd động đình chỉnh người dùng
    getTestQuestion, // lấy danh sách câu hỏi
    fetchQuestion, // lấy danh sách câu hỏi phân trang
    fetchSupervisions, // danh sách các giám thị
    updateAmountAnswered, // cập nhật số câu trả lời
    getExamQuestions, // lấy đề thi từ database
    confirmSubmit, // nộp bài
    submitExam,

    /** *Camera */
    cameraRef,
    isSharingCamera,
    grantPermissionsCamera, // cấp quyền camera
    checkCamera, // check quyền camera
    /** *screen */
    isSharingFullScreen, // chia sẻ toàn màn hình
    grantSharingScreenPermission, // cấp quyền màn hình
  }
})
