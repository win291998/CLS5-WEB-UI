<script setup lang="ts">
import CpMdCerification from '@/components/page/users/course/course-learning/modal/CpMdCerification.vue'

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
  <div>
    course-learning
  </div>
  <button @click="openCertification">
    Chứng nhận
  </button>
  <CpMdCerification
    v-model:is-dialog-visible="isShowDialogCert"
    :course-name="course.courseName"
    :course-id="course.courseId"
    :is-div-space="false"
    is-hide-footer
  />
</template>
