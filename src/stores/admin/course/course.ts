import { defineStore } from 'pinia'

export const courseManagerStore = defineStore('courseManager', () => {
  /** store */

  /** variable */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()
  const idCourse = ref<any>(null)

  /** interface */
  interface course {
    id?: any
    name?: string | null
    thumbnail?: string
    videoUrl?: string
    about?: string
    topicCourseId?: number | null
    formOfStudy?: number | null
    code?: string | null
    authorList?: any
    credit?: number | null
    ownerId?: number | null
  }
  const courseDetail = ref<course>(
    {
      name: null,
      thumbnail: '',
      videoUrl: '',
      about: '',
      topicCourseId: null,
      code: null,
      formOfStudy: null,
      credit: null,
      authorList: [],
      ownerId: null,
    },
  )
  const isViewDetail = ref(false) // trạng thái xem hay chỉnh sửa
  /** method */

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    // state
    idCourse,

    // method
  }
})
