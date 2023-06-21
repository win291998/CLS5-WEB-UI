import { defineStore } from 'pinia'

export const contentTypeManagerStore = defineStore('contentTypeManager', () => {
  /** lib ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const route = useRoute()

  /**
 * Store
 */

  /** ********************************Nội dung video******************************************** */
  /** state */
  const videoData = ref({
    courseId: null,
    archiveTypeId: 0,
    description: '',
    name: '',
    url: null,
    urlFileName: '',
    urlCdn: null,
    ownerId: null,
    dateTimeStart: null,
    dateTimeEnd: null,
    isRewind: false,
    isSpeed: false,
    isCustomTime: false,
    isPdf: false,
    themeticId: null,
    timeTypeId: 1,
    isApprove: true,
    isAutoTestCode: false,
    time: 0,
    isArchive: false,
    acceptDownload: null,
    IsCustomTime: false,
    timeVideoOrSound: 0,
    testConfig: {
      courseContentId: null,
      isShuffleQuestion: false,
      requiredPointRatio: 80,
      totalQuestionDisplayInPage: 0,
      randomQuestion: 0,
      minuteOfWork: 0,
      writeLogMinute: 0,
      numberOfRetake: 0,
      retakeResultType: 0,
      isDisplayResult: false,
      isCorrectAnswer: false,
      timeFinish: 0,
      isPreserveTime: false,
      isReviewTheTest: false,
      isMaintainStatus: false,
    },
  })

  /** method */

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    /** Nội dung video */
    videoData,
  }
})
