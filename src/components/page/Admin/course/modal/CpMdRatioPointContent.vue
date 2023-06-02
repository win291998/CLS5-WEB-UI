<script setup lang="ts">
import { courseApproveManagerStore } from '@/stores/admin/course/approve'

const CpRatioPointContentCourse = defineAsyncComponent(() => import('@/components/page/Admin/course/CpRatioPointContentCourse.vue'))
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
/** store */
const storeCourseApproveManager = courseApproveManagerStore()
const { idModalSendRatioPoint } = storeToRefs(storeCourseApproveManager)
const LABEL = Object.freeze({
  TITLE: t('set-up-a-course-approver'),
  TITLE1: t('api-name'),
  TITLE2: t('code-number'),
})
function onCancel(params: any) {

}
function onConfirm(params: any) {

}
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="idModalSendRatioPoint"
      :title="LABEL.TITLE"
      close-on-back
      :height="800"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <CpRatioPointContentCourse />
    </CmDialogs>
  </div>
</template>

<style scoped>

</style>
