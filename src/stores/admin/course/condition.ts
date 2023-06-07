import { defineStore } from 'pinia'
import { courseInforManagerStore } from '@/stores/admin/course/infor'

import CourseService from '@/api/course/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'

export const conditionManagerStore = defineStore('conditionManager', () => {
  /** store */

  /** state ****************************************************************/
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const router = useRouter()

  /**
 * Store
 */
  const storeCourseInforManager = courseInforManagerStore()
  const { courseData } = storeToRefs(storeCourseInforManager)
  const { } = storeCourseInforManager

  /** năng lực */
  const itemsCapacity = ref([])
  const totalRecordCapacity = ref(0)
  const dataCapacity = reactive({
    deleteIds: [] as any[], // list id các row table muốn xóa
    selectedRowsIds: [], // list id các row table được chọn
  })
  const queryParamsCapacity = ref<any>({
    search: null,
    pageNumber: 1,
    pageSize: 10,
  })
  const disabledDeleteCapacity = computed(() => !dataCapacity.selectedRowsIds.length)
  const isShowDialogNotiDeleteCapacity = ref(false)

  /** state ****************************************************************/
  /** interface */

  /** method */

  /** năng lực */
  function deleteItemsCapacity() {
    dataCapacity.deleteIds = dataCapacity.selectedRowsIds
    isShowDialogNotiDeleteCapacity.value = true
  }
  function handleSearchCapacity(value: any) {
    queryParamsCapacity.value.search = value
  }

  // chuyển trang
  async function handlePageClickCapacity(page: any) {
    queryParamsCapacity.value.pageNumber = page
  }
  function selectedRowsCapacity(e: any) {
    dataCapacity.selectedRowsIds = e
  }
  async function getCapacityRequired() {
    queryParamsCapacity.courseId = courseData.value?.id
    await MethodsUtil.requestApiCustom(CourseService.GetRequiredProficiencies, TYPE_REQUEST.GET, queryParamsCapacity).then((value: any) => {
      value.data.forEach((element: any) => {
        element.actions = [
          MethodsUtil.checkActionType({ id: 2 }, actionItemCapacity),
        ]
      })
      console.log(value.data)

      itemsCapacity.value = value.data

      // rows = data

    // reset các giá trị
    // selectedIds = []
    // deleteIds = []
    })
  }

  // xóa năng lực
  function deleteItem(id: number) {
    dataCapacity.deleteIds = [id as never]
    isShowDialogNotiDeleteCapacity.value = true
  }

  // hàm trả về các loại action khi click
  function actionItemCapacity(type: any) {
    console.log(type)

    switch (type[0]?.name) {
      case 'ActionDelete':
        deleteItem(type[1].id)
        break
      default:
        break
    }
  }
  onMounted(() => {
    //
  })
  onBeforeUnmount(() => {
    //
  })

  return {
    // state
    disabledDeleteCapacity,
    isShowDialogNotiDeleteCapacity,
    queryParamsCapacity,
    itemsCapacity,
    totalRecordCapacity,
    handlePageClickCapacity,
    selectedRowsCapacity,

    // method
    deleteItemsCapacity,
    handleSearchCapacity,
    getCapacityRequired,
  }
})
