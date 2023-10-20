<script setup lang="ts">
import CpMdCerification from '@/components/page/users/course/course-learning/modal/CpMdCerification.vue'

// import CpScreenEnds from '@/components/page/users/course/course-learning/screen/CpScreenEnds.vue'
import CpScreenStart from '@/components/page/users/course/course-learning/screen/CpScreenStart.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'

const CpSurveyLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpSurveyLearning.vue'))
const CpVideoLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpVideoLearning.vue'))

const route = useRoute()
const router = useRouter()
const myCourseManagerManager = myCourseManagerStore()
const { contentCurrent } = storeToRefs(myCourseManagerManager)
const { getDetailContent, checkSurveyInfo, getSurveyInfo } = myCourseManagerManager
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const isShowContent = ref(false)

const isShowDialogCert = ref(false)
function openCertification() {
  isShowDialogCert.value = true
}

const course = ref({
  courseName: 'a',
  courseId: 4089,
})

function componentContentCurrent() {
  switch (contentCurrent.value.contentArchiveTypeId) {
    case 4:
      return CpVideoLearning
    case 11:
      return CpSurveyLearning

    default:
      break
  }
}
async function changeCurrentContent() {
  console.log(contentCurrent)
  await getDetailContent(15169)
  if (contentCurrent.value.contentArchiveTypeId === 11) {
    await checkSurveyInfo()
    await getSurveyInfo()
  }
  isShowContent.value = true
}
</script>

<template>
  <div

    class="mycourse"
  >
    <div
      v-show="!isShowContent"
      class="box flex-center page-containter"
    >
      <CpScreenStart
        is-desc-box
        @click="changeCurrentContent"
      >
        <template #descBox>
          <div>
            Tổng số câu hỏi: 10 câu
          </div>
          <div>
            Thời gian làm bài: 90 phút
          </div>
        </template>
      </CpScreenStart>
    </div>
    <div v-show="isShowContent">
      <Component :is="componentContentCurrent()" />
    </div>
  </div>
  <!--
    <button @click="openCertification">
    Chứng nhận
    </button>
  -->
  <!-- <CpScreenEnds /> -->
  <CpMdCerification
    v-model:is-dialog-visible="isShowDialogCert"
    :course-name="course.courseName"
    :course-id="course.courseId"
    :is-div-space="false"
    is-hide-footer
  />
</template>

<style lang="scss">
.mycourse{
  .box{
    background: rgb(var(--v-theme-surface));
    .box-content{
      background:  rgb(var(--v-gray-50));
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid rgb(var(--v-gray-300));
      max-width: 80%;
      .mc-desc{
        border-radius: 8px;
        background-color: rgb(var(--v-primary-50));
        padding: 12px 16px;
        text-align: center;
        margin-block: 16px;
      }
      .mc-about{
        &.text-over-hide{
          display: -webkit-box;
          -webkit-line-clamp: 2; /* Số hàng tối đa muốn hiển thị */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
