<script setup lang="ts">
import CpMdCerification from '@/components/page/users/course/course-learning/modal/CpMdCerification.vue'

// import CpScreenEnds from '@/components/page/users/course/course-learning/screen/CpScreenEnds.vue'
import CpSurveyLearning from '@/components/page/users/course/course-learning/content/CpSurveyLearning.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const isShowDialogCert = ref(false)
function openCertification() {
  isShowDialogCert.value = true
}

const course = ref({
  courseName: 'a',
  courseId: 4089,
})
</script>

<template>
  <div class="mycourse">
    course-learning
    <div class="box flex-center page-containter">
      <CpSurveyLearning />
    </div>
  </div>
  <button @click="openCertification">
    Chứng nhận
  </button>
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
