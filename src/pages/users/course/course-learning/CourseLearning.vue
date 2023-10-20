<script setup lang="ts">
// import CpScreenEnds from '@/components/page/users/course/course-learning/screen/CpScreenEnds.vue'
import CpFrameLearning from '@/components/page/users/course/course-learning/components/CpFrameLearning.vue'

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
  <div class="my-course-learning">
    <CpFrameLearning>
      <template #sidebar>
        hello sidebar
      </template>
      <template #content>
        <h1>hello content</h1>
      </template>
    </CpFrameLearning>
  </div>
</template>

<style lang="scss">
.my-course-learning {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
