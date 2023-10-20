<script setup lang="ts">
import CpMdCerification from '@/components/page/users/course/course-learning/modal/CpMdCerification.vue'

// import CpScreenEnds from '@/components/page/users/course/course-learning/screen/CpScreenEnds.vue'
import CpScreenStart from '@/components/page/users/course/course-learning/screen/CpScreenStart.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'
import { myExamCourseManagerStore } from '@/stores/user/course/courseExam'

const CpSurveyLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpSurveyLearning.vue'))
const CpVideoLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpVideoLearning.vue'))
const CpTestLearning = defineAsyncComponent(() => import('@/components/page/users/course/course-learning/content/CpTestLearning.vue'))

const route = useRoute()
const router = useRouter()
const myCourseManagerManager = myCourseManagerStore()
const { contentCurrent } = storeToRefs(myCourseManagerManager)
const { getDetailContent, checkSurveyInfo, getSurveyInfo } = myCourseManagerManager
const myExamCourseManagerManager = myExamCourseManagerStore()
const { } = storeToRefs(myExamCourseManagerManager)
const { getExamInfo, getTestQuestion } = myExamCourseManagerManager
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
    case 10:
      return CpTestLearning
    case 11:
      return CpSurveyLearning

    default:
      break
  }
}

async function changeCurrentContent() {
  console.log(contentCurrent)
  await getDetailContent(15150)
  if (contentCurrent.value.contentArchiveTypeId === 11) {
    await checkSurveyInfo()
    await getSurveyInfo()
  }
  if (contentCurrent.value.contentArchiveTypeId === 10) {
    await getExamInfo().then(() => {
      getTestQuestion()
    })
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
.mycourse {
  .box {
    background: rgb(var(--v-theme-surface));

    .box-content {
      max-width: 80%;
      padding: 1rem;
      border: 1px solid rgb(var(--v-gray-300));
      border-radius: var(--v-border-radius-xs);
      background:  rgb(var(--v-gray-50));

      .mc-desc {
        padding: 12px 16px;
        border-radius: var(--v-border-radius-xs);
        background-color: rgb(var(--v-primary-50));
        margin-block: 16px;
        text-align: center;
      }

      .mc-about {
        &.text-over-hide {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; /* Số hàng tối đa muốn hiển thị */
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
