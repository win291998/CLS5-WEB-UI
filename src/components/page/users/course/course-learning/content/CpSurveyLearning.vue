<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { myCourseManagerStore } from '@/stores/user/course/course'
import CmChip from '@/components/common/CmChip.vue'
import CmPagination from '@/components/common/CmPagination.vue'
import CpContentView from '@/components/page/gereral/page/user/CpContentView.vue'
import CpControlQuestionNumber from '@/components/page/gereral/page/user/CpControlQuestionNumber.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const myCourseManagerManager = myCourseManagerStore()
const { contentCurrent, surveyData, surveyQuestion, pageOption, isReview } = storeToRefs(myCourseManagerManager)

const layoutMobile = ref(false)

// xử lý thời gian
const isStopTimer = ref(false)
const time = ref(0)
const halfTime = ref(0)
const quaterTime = ref(0)
const lastTime = ref(60)
const endTime = ref(0) // thời gian kết thúc bộ đếm ngược
const isWarningHalfTime = ref(false)
const isWarningQuarter = ref(false)
const isWarningLastTime = ref(false)
const timerVariant = computed(() => {
  if (time.value <= lastTime.value)
    return 'error'
  if (time.value > halfTime.value)
    return 'success'
  if (time.value > quaterTime.value)
    return 'warning'
  return 'error'
})

const prettyTime = computed(() => {
  const thour: number = time.value / 3600
  const hours = parseInt(`${thour}`, 10)

  const tminute = (time.value - hours * 3600) / 60
  const minutes = parseInt(`${tminute}`, 10)
  const secondes = time.value - hours * 3600 - minutes * 60
  return `${hours > 9 ? hours : `0${hours}`}:${
    minutes > 9 ? minutes : `0${minutes}`
  }:${secondes > 9 ? secondes : `0${secondes}`}`
})

// nội dung khảo sát

const config = ref({
  wheelPropagation: false,
  suppressScrollX: true,
})
function pageChange(pageNumber: number, currentSizePage: number, pageOld: number) {
  pageOption.value.pageNumber = pageNumber

  // if (quantityFileUploading.value) {
  //   pageNumberUploadingChange.value = pageNumber
  //   isShowModalUploading.value = true
  //   nextTick().then(() => {
  //     pageOption.value.pageNumber = pageOld
  //   })
  //   return
  // }
  const el: any = document.getElementById('exam-test-content-scroll')
  el.scrollTop = 0
}

const timerScrollQuestion = ref<any>(null)

async function handleClickQuestion(question: any, isConfirm?: boolean, pos = 0) {
  const idQuestion = question.questionId
  console.log((pageOption.value.pageNumber - 1) * pageOption.value.pageSize <= pos && pos < pageOption.value.pageNumber * pageOption.value.pageSize)
  console.log(question, pos)

  if (question === null)
    return
  if (!((pageOption.value.pageNumber - 1) * pageOption.value.pageSize <= pos && pos < pageOption.value.pageNumber * pageOption.value.pageSize)) {
    // if (quantityFileUploading.value && !isConfirm) {
    //   questionGoTo.value = question
    //   isShowModalUploading.value = true
    //   return
    // }
    const index = surveyQuestion.value.indexOf(question)
    pageOption.value.pageNumber = Math.floor(index / pageOption.value.pageSize) + 1
    console.log(pageOption.value)
    nextTick(() => {
      clearTimeout(timerScrollQuestion.value)
      timerScrollQuestion.value = null
      timerScrollQuestion.value = setTimeout(() => {
        const el: any = document.getElementById(`${idQuestion}`)
        const top = el.offsetTop
        el.offsetParent.scrollTop = top
      }, 500)
    })
  }

  else {
    const el: any = document.getElementById(`${idQuestion}`)
    const top = el.offsetTop
    el.offsetParent.scrollTop = top
  }
}
function checkShowPage(pos: number) {
  console.log(pageOption.value)
  if (pageOption.value.pageSize === 0)
    return true
  return (pageOption.value.pageNumber - 1) * pageOption.value.pageSize <= pos && pos < pageOption.value.pageNumber * pageOption.value.pageSize
}
</script>

<template>
  <div class="containter-white">
    <div
      class="mt doing-exam-container h-inherit"
    >
      <div
        class="mt-left h-inherit"
        :class="{ 'w-100': layoutMobile }"
      >
        <div>
          <div class="flex-center">
            <CmChip
              :color="timerVariant"
              class="mb-2"
            >
              <div
                class="text-medium-md color-success"
                :class="`color-${timerVariant}`"
              >
                {{ prettyTime }}
              </div>
            </CmChip>
          </div>
          <div class="text-bold-lg flex-center">
            {{ contentCurrent?.courseContentName }}
          </div>
          <div class="flex-center text-semibold-md color-primary mb-4">
            <span>{{ t('time-survey') }}: {{ contentCurrent?.minuteOfLearn === 0 ? t('empty-date') : (`${contentCurrent?.minuteOfLearn} ${$t('minute').toLowerCase()}`) }}</span>
          </div>

          <PerfectScrollbar
            id="exam-test-content-scroll"
            :options="config"
            style="height: 70vh;"
          >
            <div
              id="mt-content"
              class="mt-content mt-8"
            >
              <div
                v-for="(qs, pos) in surveyQuestion"
                :key="pos"
              >
                <div v-show="checkShowPage(pos)">
                  <CpContentView
                    v-model:data="surveyQuestion[pos]"
                    is-survey
                    :type="qs.questionTypeId"
                    :number-question="pos + 1"
                    :disabled="isReview"
                    :is-review="isReview"
                    is-sentence
                  />
                </div>
              </div>
            </div>
          </PerfectScrollbar>
        </div>

        <div

          class="exam-pagination"
        >
          <CmPagination
            v-if="pageOption?.pageSize > 0"
            :type="3"
            :total-items="surveyQuestion?.length"
            :current-page="pageOption?.pageNumber"
            :page-size="pageOption?.pageSize"
            @pageClick="pageChange"
          />
        </div>
      </div>

      <div
        v-if="!layoutMobile"
        class="mt-right"
      >
        <CpControlQuestionNumber
          :question-store="surveyQuestion"
          :total-question="surveyQuestion?.length"
          @handle-click-question="handleClickQuestion"
        />
      </div>
    </div>
  </div>
  <!--
    <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalSubmit"
    :type="1"
    append-to-body
    variant="outlined"
    :confirmation-msg-sub-title="t('confirm-submit')"
    :confirmation-msg="t('submit')"
    @confirm="submitExam(2)"
    >
    <template #sub-title>
    <div
    v-if="quantityFileUploading"
    v-html="t('confirm-uploading-submit', { quantity: `${quantityFileUploading}` })"
    />
    </template>
    </CpConfirmDialog>
    <CpConfirmDialog
    v-model:is-dialog-visible="isShowSubmitError"
    :type="2"
    append-to-body
    persistent
    variant="outlined"
    :is-cancle="false"
    :confirmation-msg-sub-title="t('submit-error')"
    :confirmation-msg="t('submit')"
    @confirm="submitExam(2)"
    />
  -->
  <!--
    <div>
    <CmSheet />
    </div>
  -->
</template>

<style  lang="scss">
 .containter-white{
    background-color: rgb(var(--v-theme-surface));
    max-width: 1400px;
    height: 100%;
    min-height: calc(100vh - 4rem);
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
    margin:0 auto;
  }
.doing-exam-container{
  background-color:  rgba(var(--v-theme-surface))
}
#doing-exam-container::backdrop {
    position: relative;
    inset: 0px;
    background: black;
}
.mt{
  display: flex;
  .mt-left{
    width: 70% ;
    margin-right: 12px;
    overflow: hidden;
  }
  .mt-right{
    width: 30% ;
    margin-left: 12px;
  }
}
.mt-mb{
  position: fixed;
  top: 2rem;
  right: 0;
}
.controlQuestionNumberMb{
  position: fixed;
  bottom: 0;
}
</style>
