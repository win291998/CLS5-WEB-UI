<script setup lang="ts">
import CmCollapse from '@/components/common/CmCollapse.vue'
import CpMyCourseFilter from '@/components/page/users/course/components/CpMyCourseFilter.vue'
import CpMyCourseItemCard from '@/components/page/users/course/components/CpMyCourseItemCard.vue'
import CpHeaderAction from '@/components/page/gereral/CpHeaderAction.vue'
import CmSwitch from '@/components/common/CmSwitch.vue'
import CpMyCourseItemHappenning from '@/components/page/users/course/item/CpMyCourseItemHappenning.vue'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const isShowFilter = ref(true)

const queryParams = ref<any>({
  topic: [],
  level: null,
  isGroup: null,
  createdBy: null,
  type: null,
  status: null,
  pageSize: 10,
  pageToken: null,
  searchTerm: null,
  sortBy: null,
  startDate: null,
  endDate: null,
})
const dataComponent = reactive({
  deleteIds: [] as any, // list id các row table muốn xóa
  selectedRowsIds: [], // list id các row table được chọn
})

/** computed */
const disabledBtnHeaderAction = computed(() => !dataComponent.selectedRowsIds.length)

/** method */
// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  console.log(type)

  switch (type) {
    case 'fillter':
      isShowFilter.value = !isShowFilter.value
      break

      // case 'delete':
      //   deleteItems()
      //   break

    default:
      break
  }
}

// search ở fillter header
async function handleSearch(value: any) {
  queryParams.value.pageNumber = 1
  queryParams.value.keyword = value
}

const activeSwitch = ref(false)
const action = reactive([
  {
    icon: 'tabler:layout-grid',
    value: false,

  // action: handleOrgTreeDiagram,
  },
  {
    icon: 'ic:baseline-format-list-bulleted',
    value: true,

  // action: handleOrgTree,
  },
])
</script>

<template>
  <div class="mt-6">
    <div class="mt-6">
      <div class="text-medium-lg mb-6">
        {{ t('course-happenning') }}
      </div>
      <CmCollapse :is-show="isShowFilter">
        <CpMyCourseFilter
          v-model:topicId="queryParams.topic"
          v-model:formOfStudy="queryParams.formOfStudy"
          v-model:sort="queryParams.sort"
          v-model:isDisplayHome="queryParams.isDisplayHome"
          v-model:statusId="queryParams.statusId"
          v-model:ownerId="queryParams.ownerId"
          v-model:dateFrom="queryParams.dateFrom"
          v-model:dateTo="queryParams.dateTo"
        />
      </CmCollapse>
      <div class="my-3">
        <CpHeaderAction
          is-delete
          is-send-approve
          :disabled-delete="disabledBtnHeaderAction"
          :disabled-send-approve="disabledBtnHeaderAction"
          is-fillter
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
      <div class="my-course-list">
        <VRow>
          <VCol
            v-for="item in 20"
            :key="item"
            cols="12"
            sm="6"
            md="4"
          >
            <CpMyCourseItemCard>
              <CpMyCourseItemHappenning />
            </CpMyCourseItemCard>
          </VCol>
        </VRow>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.my-course-list{
  margin-block: 24px;
}
</style>
