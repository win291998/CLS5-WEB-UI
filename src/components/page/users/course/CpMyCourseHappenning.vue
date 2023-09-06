<script setup lang="ts">
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpMyCourseFilter from '@/components/page/users/course/components/CpMyCourseFilter.vue'
import CpMyCourseItemCard from '@/components/page/users/course/components/CpMyCourseItemCard.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmSwitch from '@/components/common/CmSwitch.vue'
import CpMyCourseItemHappenning from '@/components/page/users/course/item/CpMyCourseItemHappenning.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import CmPagination from '@/components/common/CmPagination.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import CourseService from '@/api/course/index'
import type { Any } from '@/typescript/interface'
import ObjectUtil from '@/utils/ObjectUtil'
import CmImg from '@/components/common/CmImg.vue'
import CmTable from '@/components/common/CmTable.vue'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const isShowFilter = ref(true)

const queryParams = ref<any>({
  sort: '-date',
  typeId: 1,
  studyTypeId: null,
  topicIds: [],
  search: null,
  pageSize: 12,
  pageNumber: 1,
})

/** method */
// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  console.log(type)

  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break
    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.search = value
  getListMyCourseHappen()
}

const activeSwitch = ref(false)
const action = reactive([
  {
    icon: 'tabler:layout-grid',
    value: false,
    action: () => activeSwitch.value = false,
  },
  {
    icon: 'ic:baseline-format-list-bulleted',
    value: true,
    action: () => activeSwitch.value = true,
  },
])
interface course {
  id: number
  [name: string]: any
}
const myCourseHappening = ref<course[]>([])
const totalHappening = ref(0)
function getListMyCourseHappen() {
  MethodsUtil.requestApiCustom(CourseService.GetListMyCourse, TYPE_REQUEST.GET, queryParams.value).then((result: any) => {
    console.log(result)
    myCourseHappening.value = result?.data?.myCourseHappening
    totalHappening.value = result?.data?.totalHappening
  })
}
function pageChange(pageNumber: any) {
  queryParams.value.pageNumber = pageNumber
  getListMyCourseHappen()
}

//  Bấm nút vào nội dung khóa học
async function clickDetailCourse(item: any, actionClick: any) {
  if (item) {
    const { id } = item
    console.log(actionClick)

    switch (actionClick) {
      case 'start':
      case 'continue':

        // const [requiredCourses, requiredProficiencies] = await this.checkCourseCondition(id)
        // if ((requiredCourses && requiredCourses.length > 0) || (requiredProficiencies && requiredProficiencies.length > 0))
        //  openModalNotifi(requiredProficiencies, requiredCourses)

        // else
        router.push({ name: 'course-learning', params: { id } })

        break
      case 'review':
        router.push({ name: 'detail-courses', params: { id } })
        break
      case 'detail':
        router.push({ name: 'course-detail', params: { id } })
        break
      default:
        router.push({ name: 'course-detail', params: { id } })
        break
    }
  }
}
function getImage(id: number): string {
  const result = MethodsUtil.getThemeItem(1)(id)
  return typeof result === 'string' ? result : ''
}

// view table
const headers = ref([
  { text: '', value: 'checkbox', width: 50 },
  { text: t('proficiency'), value: 'proficiencyName' },
  { text: t('level'), value: 'levels', type: 'custom', width: 250 },
])

onMounted(async () => {
  if (Object.keys(route.query).length > 1) {
    console.log(route.query.topicIds?.length)
    console.log(route.query.topicIds)

    queryParams.value.search = route.query.search ? route.query.search as string : queryParams.value.search
    queryParams.value.sort = route.query.sort ? route.query.sort as string[] : []
    queryParams.value.studyTypeId = route.query.studyTypeId ? Number(route.query.studyTypeId) : queryParams.value.studyTypeId
    if (route.query.topicIds && route.query.topicIds?.length) {
      switch (typeof route.query.topicIds) {
        case 'object':
          queryParams.value.topicIds = (route.query.topicIds as any)?.map((item: any) => Number(item))
          break

        default:
          queryParams.value.topicIds = [Number(route.query.topicIds)]
          break
      }
    }
    else {
      queryParams.value.topicIds = []
    }

    queryParams.value.pageNumber = route.query.pageNumber ? Number(route.query.pageNumber) : queryParams.value.pageNumber
    queryParams.value.pageSize = route.query.pageSize ? Number(route.query.pageSize) : queryParams.value.pageSize
  }

  else { await getListMyCourseHappen() }
})
watch(queryParams, (val: Any) => {
  const params = ObjectUtil.omitByDeep(JSON.parse(JSON.stringify(val)))
  router.push({
    query: {
      type: route.query.type,
      ...params,
    },
  })
  getListMyCourseHappen()
}, { deep: true })
</script>

<template>
  <div class="mt-6">
    <div class="mt-6">
      <div class="text-medium-lg mb-6">
        {{ t('course-happenning') }}
      </div>
      <CmCollapse :is-show="isShowFilter">
        <CpMyCourseFilter
          v-model:topicIds="queryParams.topicIds"
          v-model:studyTypeId="queryParams.studyTypeId"
          v-model:sort="queryParams.sort"
        />
      </CmCollapse>
      <div class="my-3">
        <CpHeaderAction
          is-fillter
          :keyword="queryParams.search"
          @click="handleClickBtn"
          @update:keyword="handleSearch"
        >
          <template #actionEnd>
            <div class="ml-3">
              <CmSwitch
                v-model="activeSwitch"
                color="secondary"
                :list-item="action"
              />
            </div>
          </template>
        </CpHeaderAction>
      </div>
      <div
        v-if="!activeSwitch"
        class="my-course-list"
      >
        <div v-if="myCourseHappening?.length">
          <VRow>
            <VCol
              v-for="item in myCourseHappening"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              xl="3"
            >
              <CpMyCourseItemCard
                :data="item"
                @click="clickDetailCourse"
              >
                <CpMyCourseItemHappenning :data="item" />
              </CpMyCourseItemCard>
            </VCol>
          </VRow>
          <CmPagination
            :type="3"
            :total-items="totalHappening"
            :current-page="1"
            :page-size="12"
            @pageClick="pageChange"
          />
        </div>
        <div
          v-else
          class="d-flex justify-center"
        >
          <CmImg
            :src="MethodsUtil.urlImageFile(getImage(6))"
            height="12rem"
            cover
          />
        </div>
      </div>
      <div v-else>
        <CmTable
          v-model:pageSize="queryParams.pageSize"
          :headers="headers"
          :items="items"
          :total-record="totalRecord"
          :page-number="queryParams.pageNumber"
          return-object
          :type-pagination="2"
          @handlePageClick="handlePageClick"
          @update:selected="selectedRows"
        >
          <template #rowItem="{ col, context }">
            <div v-if="col === 'levels'">
              <CmSelect
                v-model="context.selectedLevel"
                :items="context.levels"
                custom-key="proficiencyLevelName"
                item-value="proficiencyLevelMapId"
                :append-to-body="true"
                :placeholder="LABEL.PLH_SELECT"
                @update:modelValue="changeCellvalue($event, context)"
              />
            </div>
          </template>
        </CmTable>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.my-course-list{
  margin-block: 24px;
}
</style>
