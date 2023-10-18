import { defaultTheme } from '@/constant/data/image.json'
import examNotComplete from '@/assets/images/exam/exam-error.png'
import examWaitingMark from '@/assets/images/exam/exam-essay.png'
import completeIcon from '@/assets/images/exam/icon/Success.png'
import errorIcon from '@/assets/images/exam/icon/Error.png'
import markIcon from '@/assets/images/exam/icon/Mark.png'

interface DataThemesProps {
  examImages: any[] | []
  items: any[] | []
}
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const EXAM_DEFAULT = defaultTheme.examImages
export const iconSystem = {
  complete: completeIcon,
  error: errorIcon,
  mark: markIcon,
}
export class Themes {
  static examImage: any = EXAM_DEFAULT
  static welcome = {
    background: '', // key = 32
    title: '', // key = 22
    content: '', // key = 23
    login: '', // key =33
  }

  static colors: any = {
    default: null, // key = 1
    warning: null, // key = 5
    correct: null, // key = 3
    wrong: null, // key = 4
    title: null, // key = 2
  }

  static imageSystem = {
    header: '', // key = 8
    noneData: '/badge/emptyData.png', // key = 6
    lessonComplete: '/badge/lessonComplete.png', // key = 21,
    courseComplete: '/badge/congratulationscousera.gif', // key = 10
    examComplete: '/badge/examComplete.png', // key = 11
    examNotComplete,
    examWaitingMark,
    waitingSurvey: '/badge/suveyComplete.png', // key = 9
    surveyComplete: '/badge/suveyComplete.png', // key = 12
    routeComplete: '/badge/pathComplete.png', // key = 13 lo trinh
    event: '/badge/eventDefault.png', // key = 7
    examVideo: '/testDevice/testVideo.mp4', // key = 29
  }

  public static setDataTheme({ examImages, items }: DataThemesProps) {
    if (examImages && examImages.length > 0)
      this.examImage = examImages
    console.log(examImages, items)

    if (items && items.length > 0) {
      items.forEach((theme: any) => {
        if (theme?.value) {
          switch (theme.key) {
            case 1:
              this.colors.default = theme.value
              break
            case 2:
              this.colors.title = theme.value
              break
            case 3:
              this.colors.correct = theme.value
              break
            case 4:
              this.colors.wrong = theme.value
              break
            case 5:
              this.colors.warning = theme.value
              break
            case 6:
              this.imageSystem.noneData = SERVERFILE + theme.value
              break
            case 8:
              this.imageSystem.header = SERVERFILE + theme.value
              break
            case 21:
              this.imageSystem.lessonComplete
                = SERVERFILE + theme.value
              break
            case 10:
              this.imageSystem.courseComplete
                = SERVERFILE + theme.value
              break
            case 11:
              this.imageSystem.examComplete = SERVERFILE + theme.value
              break
            case 9:
              this.imageSystem.waitingSurvey = SERVERFILE + theme.value
              break
            case 12:
              this.imageSystem.surveyComplete
                = SERVERFILE + theme.value
              break
            case 13:
              this.imageSystem.routeComplete = SERVERFILE + theme.value
              break
            case 7:
              this.imageSystem.event = SERVERFILE + theme.value
              break
            case 29:
              this.imageSystem.event = SERVERFILE + theme.value
              break
            case 22:
              this.welcome.title = theme.value
              break
            case 23:
              this.welcome.content = theme.value
              break
            case 32:
              this.welcome.background = SERVERFILE + theme.value
              break
            case 33:
              this.welcome.login = theme.value
              break
            default:
              break
          }
        }
      })
    }
  }
}
