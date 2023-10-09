<script setup lang="ts">
import { myExamManagerStore } from '@/stores/user/exam/exam'

const CpIntroduce: any = defineAsyncComponent(() => import('@/components/page/users/exam/test/CpIntroduce.vue'))
const CpMyTest: any = defineAsyncComponent(() => import('@/components/page/users/exam/test/CpMyTest.vue'))

const myExamManagerManager = myExamManagerStore()
const { examData, isReview, isSuspendedExam, isComplete, isDoing } = storeToRefs(myExamManagerManager)
const { handleStartExam, getExamInfo, handleSuspendUser, getTestQuestion, fetchQuestion, fetchSupervisions, updateAmountAnswered, getExamQuestions } = myExamManagerManager
const isInTroduceView = ref(true)
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
      fetchQuestion()
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
    fetchQuestion()
  }
  isloading.value = false
}
function startExam() {
  isInTroduceView.value = false
  isTestRender.value = true
  window.showAllPageLoading('FULL-OPACITY')
  handleStartExam()
}
function myTestRendered() {
  window.hideAllPageLoading()

  setTimeout(() => {
    isProgress.value = true
  }, 1000)
}
onMounted(() => {
  initData()
})
</script>

<template>
  <div class="containter-light flex-center">
    <div class="containter-white">
      <div v-show="isInTroduceView">
        <CpIntroduce
          :is-progress="true"
          @startExam="startExam"
        />
      </div>
      <div
        v-if="isTestRender"
        v-show="!isInTroduceView && isProgress"
      >
        <CpMyTest
          @loaded="myTestRendered"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.containter-light{
  background-color:  rgb(var(--v-gray-50));
  height: auto;
  min-height: 100vh;
  width: 100vw;
  padding: 2rem;
  .containter-white{
    background-color: rgb(var(--v-theme-surface));
    max-width: 1400px;
    height: 100%;
    min-height: calc(100vh - 4rem);
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
  }
}
</style>
