import { defineStore } from 'pinia'
import toast from '@/plugins/toast'

/** call api */
import MethodsUtil from '@/utils/MethodsUtil'
import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

// import { TYPE_REQUEST } from '@/typescript/enums/enums'

/** end call api */
export const courseApproveManagerStore = defineStore('courseApproveManager', () => {
  /** lib */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const route = useRoute()
  const router = useRouter()

  /** store */

  /** state */
  // data request api danh sách khóa học
  const scoreSettingCourse = ref<any>({
    courseId: null,
  })
  const rowsScore = ref<any>()
  const listApprove = ref<any>([])
  const checkValidToApprover = ref<any>('')
  const idModalSendApproveCourse = ref(false)
  const idModalSendRatioPoint = ref(false)
  const myFormScore = ref()
  const idSelected = ref()
  const approverRoleId = ref<any>()

  /** method */
  /* ==> thực hiện các action được chọn ở header page CP */

  async function sendApproveCourse(id: any, list: any) {
    scoreSettingCourse.value.courseId = id
    listApprove.value = list
    const params = {
      courseId: id,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetCheckApprove, TYPE_REQUEST.GET, params).then((value: any) => {
      checkValidToApprover.value = value?.data
      if (checkValidToApprover.value === 'CSE_CourseContentNotFound') {
        toast('ERROR', t('checkValidToApprover'))
        return
      }
      idModalSendApproveCourse.value = true
    })
  }

  /* ==> thiết lập điểm */
  async function scoreSetting() {
    const params = {
      id: scoreSettingCourse.value.courseId,
    }
    await MethodsUtil.requestApiCustom(CourseService.GetCourseSetting, TYPE_REQUEST.GET, params).then((value: any) => {
      if (value?.data)
        rowsScore.value = value?.data
    })
  }

  /* ==> lưu điểm */
  async function handlerAddPoint() {
    let score = 0
    rowsScore.value.forEach((element: any) => {
      score += element.point
      element.courseId = scoreSettingCourse.value.courseId
    })
    if (Number(score) !== 100) {
      toast('ERROR', 'score-invalid-100')
      return false
    }
    const params = {
      listModel: rowsScore.value,
    }
    let dataSend = false
    await MethodsUtil.requestApiCustom(CourseService.PostUpdatePointCourse, TYPE_REQUEST.POST, params).then((value: any) => {
      if (value.code !== 200) {
        toast('ERROR', t(value.message))
        dataSend = false
      }
      toast('SUCCESS', t(value.message))
      dataSend = true
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
        dataSend = false
      })
    return dataSend
  }

  /* ==> lưu người duyệt */
  async function addApproverSuper() {
    const params = {
      courseId: scoreSettingCourse.value.courseId,
      listApproverId: idSelected.value,
      note: '',
      lastApproverId: approverRoleId.value,
    }

    return await MethodsUtil.requestApiCustom(CourseService.PatchAddAprover, TYPE_REQUEST.PATCH, params).then((value: any) => {
      if (value.code === 200) {
        idModalSendApproveCourse.value = false
        toast('SUCCESS', t(value.message))

        return true
      }
      else {
        toast('ERROR', t(value.errors))
        return false
      }
    })
      .catch((error: any) => {
        toast('ERROR', t(error.response.data.message))
        return false
      })
  }
  async function handleUpdatePointCourse() {
    await myFormScore.value.validate().then(async (res: any) => {
      await handlerAddPoint()
    })
  }
  function valueChange(value: any, data: any) {
    rowsScore.value[data?.originIndex].point = Number(value)
  }

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    listApprove,
    scoreSettingCourse,
    idModalSendApproveCourse,
    checkValidToApprover,
    rowsScore,
    myFormScore,
    idSelected,
    approverRoleId,
    idModalSendRatioPoint,
    sendApproveCourse,
    scoreSetting,
    valueChange,
    handlerAddPoint,
    addApproverSuper,
    handleUpdatePointCourse,
  }
})
