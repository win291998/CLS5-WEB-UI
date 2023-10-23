<script setup lang="ts">
import { myExamManagerStore } from '@/stores/user/exam/exam'
import CpMdAntiCheating from '@/components/page/users/exam/test/modal/CpMdAntiCheating.vue'
import CpMdCaptureImageRecognition from '@/components/page/users/exam/test/modal/CpMdCaptureImageRecognition.vue'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'

const CpIntroduce: any = defineAsyncComponent(() => import('@/components/page/users/exam/test/CpIntroduce.vue'))
const CpMyTest: any = defineAsyncComponent(() => import('@/components/page/users/exam/test/CpMyTest.vue'))

const myExamManagerManager = myExamManagerStore()
const {
  isShowMdAccessCamera, isHaveDevice, accessDeviceContent, isShowMdCaptureImage,
  examControlRef, isShowModalSuspended, contentConfirmModal, quantityFileUploading, questionGoTo, pageOption, pageNumberUploadingChange,
  examData, isReview, isSuspendedExam, isComplete, isDoing, userViolation, isShowModalAntiCheat, isSharingFullScreen, isNotice, isConnected, isInTroduceView, isShowModalUploading,
} = storeToRefs(myExamManagerManager)
const { acceptCamera, handleClickQuestion, handleStartExam, setQuantityUploadingFile, getExamInfo, handleAcceptConfirmModal, handleSuspendUser, getTestQuestion, fetchSupervisions, updateAmountAnswered, getExamQuestions } = myExamManagerManager
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const isTestRender = ref(false)
const isProgress = ref(false)
const isloading = ref(false)
const route = useRoute()
const router = useRouter()
async function initData() {
  if (
    route.name === 'my-test'
  ) {
    isReview.value = false
    await getExamInfo().then(async () => {
      if (isSuspendedExam.value) { // lấy danh sách bị đình chỉ
        isloading.value = false
        handleSuspendUser()
        return
      }
      if (isComplete.value) {
        router.push({ name: 'list-my-exam' })
        return
      }
      await getTestQuestion()
      fetchSupervisions()
      updateAmountAnswered()
      if (examData.value.examineeStartTime !== null)
        isDoing.value = true
    })
  }
  else {
    // xem lại kì thi hoặc kì khảo sát
    isReview.value = true
    isInTroduceView.value = false
    await getExamQuestions()
    updateAmountAnswered()
  }
  isloading.value = false
}

// bắt đầu làm bài
function startExam() {
  if (!userViolation.value?.notPageSwitching && !userViolation.value?.isFullScreen) {
    isInTroduceView.value = false
    handleStartExam()
  }

  else {
    isShowModalAntiCheat.value = true
  }
}
function myTestRendered() {
  window.hideAllPageLoading()

  setTimeout(() => {
    isProgress.value = true
  }, 1000)
}
function handleAcceptUploadConfirmModal() {
  setQuantityUploadingFile(0)

  if (questionGoTo.value) {
    handleClickQuestion(questionGoTo.value, true)
    questionGoTo.value = null
    return
  }
  pageOption.value.pageNumber = pageNumberUploadingChange.value
  const el: any = document.getElementById('exam-test-content-scroll')
  el.scrollTop = 0
  pageNumberUploadingChange.value = null
}
function handleCancelUploadConfirmModal() {
  if (questionGoTo.value) {
    questionGoTo.value = null
    return
  }
  pageNumberUploadingChange.value = null
}
onMounted(() => {
  initData()
  setTimeout(() => {
    isTestRender.value = true
  }, 0)
})
</script>

<template>
  <div
    id="doing-exam-container"
    class="containter-light"
  >
    <div class="h-inherit">
      <div class="containter-white">
        <div v-show="isInTroduceView">
          <CpIntroduce
            :is-progress="isProgress"
            @startExam="startExam"
          />
        </div>
        <div
          v-if="isTestRender"
          v-show="!isInTroduceView && isProgress"
          class="h-inherit"
        >
          <CpMyTest
            ref="examControlRef"
            :is-show="!isInTroduceView"
            @loaded="myTestRendered"
          />
        </div>
      </div>
      <CpMdAntiCheating
        v-if="userViolation"
        v-model:isShowModal="isShowModalAntiCheat"
        :is-sharing-full-screen="isSharingFullScreen"
        :is-notice="isNotice"
        :is-connected="isConnected"
        :data="userViolation"
      />
      <CpConfirmDialog
        v-model:is-dialog-visible="isShowModalSuspended"
        :type="1"
        persistent
        :is-cancle="false"
        variant="outlined"
        :confirmation-msg-sub-title="contentConfirmModal"
        :confirmation-msg="t('i-req')"
        append-to-body
        @confirm="handleAcceptConfirmModal"
      />
      <CpConfirmDialog
        v-model:is-dialog-visible="isShowModalUploading"
        :type="1"
        append-to-body
        persistent
        variant="outlined"
        :button-cancle-name="t('cancel-title')"
        :confirmation-msg-sub-title="quantityFileUploading ? t('confirm-uploading-change-page', { quantity: `${quantityFileUploading}` }) : t('upload-success')"
        :confirmation-msg="t('i-req')"
        @confirm="handleAcceptUploadConfirmModal"
        @cancel="handleCancelUploadConfirmModal"
      />
      <!-- modal access camera -->
      <CpConfirmDialog
        v-model:is-dialog-visible="isShowMdAccessCamera"
        :type="1"
        append-to-body
        persistent
        variant="outlined"
        :is-cancle="false"
        :button-ok-name="!isHaveDevice ? t('ok-title') : t('allow')"
        :confirmation-msg-sub-title="accessDeviceContent"
        :confirmation-msg="t('i-req')"
        @confirm="acceptCamera"
      />
      <!-- modal yêu cầu nhận diện -->
      <CpMdCaptureImageRecognition v-model:isShowModal="isShowMdCaptureImage" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.containter-light {
  background-color: rgb(var(--v-gray-50));
  height: auto;
  min-height: 100vh;
  width: 100vw;
  padding: 2rem;

  .containter-white {
    background-color: rgb(var(--v-theme-surface));
    max-width: 1400px;
    height: 100%;
    min-height: calc(100vh - 4rem);
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
    margin: 0 auto;
  }
}
</style>
