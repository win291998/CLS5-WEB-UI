import { defineStore } from 'pinia'

// import toast from '@/plugins/toast'
// import CourseService from '@/api/course/index'
// import UserService from '@/api/user'
// import { TYPE_REQUEST } from '@/typescript/enums/enums'
// import MethodsUtil from '@/utils/MethodsUtil'

export const asignUserManagerStore = defineStore('asignUserManager', () => {
  /** lib ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()

  /**
 * Store
 */
  /** state */
  const queryParams = ref({
    id: null as any,
    orStructure: [],
    groupUser: [],
    categoryTitleId: [],
    titles: [],
    courseId: 0,
    pageNumber: 1,
    pageSize: 10,
    searchKey: '',
    listId: [],
  })

  /** Người dùng */

  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    //* *Người dùng */
    queryParams,
  }
})
