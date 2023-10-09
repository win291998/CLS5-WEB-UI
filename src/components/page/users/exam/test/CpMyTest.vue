<script setup lang="ts">
import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import CmChip from '@/components/common/CmChip.vue'
import CpContentView from '@/components/page/gereral/page/user/CpContentView.vue'
import CpControlQuestionNumber from '@/components/page/users/exam/test/CpControlQuestionNumber.vue'
import { myExamManagerStore } from '@/stores/user/exam/exam'
import CpConfirmDialog from '@/components/page/gereral/CpConfirmDialog.vue'

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'loaded'): void
}

const { t } = window.i18n()
const route = useRoute()
const router = useRouter()
const sheet = ref(false)
const layoutMobile = ref(false)
const myExamManagerManager = myExamManagerStore()
const { questionStore, totalPoint, isShowModalSubmit } = storeToRefs(myExamManagerManager)
const { submitExam } = myExamManagerManager
const config = ref({
  wheelPropagation: false,
  suppressScrollX: true,
})
function handleResize() {
  // Kiểm tra kích thước màn hình và cập nhật giá trị visibleItems
  if (window.innerWidth >= 769)
    layoutMobile.value = false // Giá trị cho màn hình md trở lên
  else
    layoutMobile.value = true // Giá trị cho màn hình mobile
}
window.addEventListener('resize', handleResize)

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// nội dung bài thi

// const questions = ref<any>([
//   {
//     id: 43309313,
//     isMark: false,
//     isQuestionGroup: false,
//     answers:
//       [{
//         answeredValue: null,
//         id: 2248258,
//         correctAnswer: null,
//         content: '<span>1.1</span>',
//         essayContent: '',
//         urlFile: '',
//         isCorrect: null,
//         isTrue: false,
//         position: 1,
//       },
//       { answeredValue: null, id: 2248261, correctAnswer: null, content: '<span>đã sửa</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 2 },
//       { answeredValue: true, id: 2248260, correctAnswer: null, isTrue: true, content: '<span>7.5</span>', essayContent: '', urlFile: '', isCorrect: null, position: 3 },
//       { answeredValue: null, id: 2248259, correctAnswer: null, content: '<span>ddđ</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 4 }],
//     content: '<p>Được thêm từ file</p>',
//     isCorrect: false,
//     questionId: 43309313,
//     typeId: 1,
//     unitPoint: 1,
//     urlFile: null,
//     isDataChange: true,
//     questionGroupContent: '',
//     isAnswered: true,
//   },
//   {
//     id: 43309314,
//     isMark: false,
//     isQuestionGroup: false,
//     answers:
//       [{
//         answeredValue: null,
//         id: 2248265,
//         correctAnswer: null,
//         content: '<span>1</span>',
//         essayContent: '',
//         urlFile: '',
//         isCorrect: null,
//         isTrue: false,
//         position: 1,
//       },
//       { answeredValue: true, id: 2248264, correctAnswer: null, content: '<span>2</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 2 },
//       { answeredValue: null, id: 2248263, correctAnswer: null, content: '<span>3</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: true, position: 3 },
//       { answeredValue: null, id: 2248262, correctAnswer: null, content: '<span>4</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 4 },
//       { answeredValue: null, id: 2248266, correctAnswer: null, content: '<span>hhhhhhhhhhhhhhh</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 5 }],
//     content: '<p>tự tạo ngày 11 đã sửa</p>',
//     isCorrect: false,
//     questionId: 43309314,
//     typeId: 1,
//     unitPoint: 1,
//     urlFile: null,
//     questionGroupContent: '',
//     isAnswered: false,
//   },
//   {
//     id: 43309315,
//     isMark: false,
//     isQuestionGroup: false,
//     answers: [{
//       answeredValue: null,
//       id: 2248267,
//       correctAnswer: null,
//       content: '<span>1</span>',
//       essayContent: '',
//       urlFile: '',
//       isCorrect: null,
//       isTrue: false,
//       position: 1,
//     },
//     { answeredValue: null, id: 2248268, correctAnswer: null, content: '<span>2</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 2 },
//     { answeredValue: null, id: 2248269, correctAnswer: null, content: '<span>thêm mới hihi</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 3 },
//     { answeredValue: null, id: 2248270, correctAnswer: null, content: '<span>đ</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: true, position: 4 }],
//     content: '<p>media vs hinh ảnh</p>',
//     isCorrect: false,
//     questionId: 43309315,
//     typeId: 1,
//     unitPoint: 1,
//     urlFile: 'fol-sfv4-037r6frlXs',
//     questionGroupContent: '',
//     isAnswered: false,
//   },
// ])

const isReview = ref(false)
</script>

<template>
  <div class="mt">
    <div
      class="mt-left"
      :class="{ 'w-100': layoutMobile }"
    >
      <div class="flex-center">
        <CmChip
          color="success"
          class="mb-2"
        >
          <div class="text-medium-md color-success">
            00:00:35
          </div>
        </CmChip>
      </div>
      <div class="text-bold-lg flex-center">
        Đề thi kiểm tra đề thi kiểm tra đề thi kiểm tra
      </div>
      <div class="flex-center text-semibold-md color-primary">
        Thời gian thi: 100 phút
      </div>
      <PerfectScrollbar
        :options="config"
        style="max-height: 100vh;"
      >
        <div
          id="mt-content"
          class="mt-content mt-8"
        >
          <div
            v-for="(qs, pos) in questionStore"
            :key="qs.id"
          >
            <div>
              <CpContentView
                v-model:data="questionStore[pos]"
                :type="qs.typeId"
                :number-question="pos + 1"
                :disabled="isReview"
                :is-review="isReview"
                :total-point="totalPoint"
                is-sentence
                :is-show-ans-false="isReview"
                :is-show-ans-true="isReview"
                @loaded="emit('loaded')"
              />
            </div>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
    <div
      v-if="!layoutMobile"
      class="mt-right"
    >
      <CpControlQuestionNumber />
    </div>
  </div>
  <CpConfirmDialog
    v-model:is-dialog-visible="isShowModalSubmit"
    :type="1"
    variant="outlined"
    :confirmation-msg-sub-title="t('confirm-submit')"
    :confirmation-msg="t('submit')"
    @confirm="submitExam(2)"
  />
  <div class="mt-mb">
    <VBtn
      v-if="layoutMobile"
      size="x-large"
      text="Click Me"
      @click="sheet = !sheet"
    />

    <VBottomSheet v-model="sheet">
      <VCard
        class="text-center"
        height="200"
      >
        <VCardText>
          <VBtn
            variant="text"
            @click="sheet = !sheet"
          >
            close
          </VBtn>

          <br>
          <br>

          <div>
            Chào mừng đến với bình nguyên vô tận
          </div>
        </VCardText>
      </VCard>
    </VBottomSheet>
  </div>
</template>

<style  lang="scss">
.mt{
  display: flex;
  .mt-left{
    width: 70% ;
    margin-right: 12px;
  }
  .mt-right{
    width: 30% ;
    margin-left: 12px;
    .mt-point{
      padding: 24px;
      border-radius: 8px;
      border: 1px solid rgb(var(--v-gray-300));
      background:  rgb(var(--v-gray-50));
    .mt-point-list{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .mt-point-item{
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 2px solid rgb(var(--v-gray-500));
        background: #fff;
        margin: 8px ;
        &.item-select{
          color: #fff;
          border: 2px solid rgb(var(--v-primary-600));
          background:  rgb(var(--v-primary-600));
        }
        &.item-flag{
          border: 2px solid rgb(var(--v-warning-500));
        }
      }
    }
    }
  }
}
.mt-mb{
  position: fixed;
  top: 2rem;
  right: 0;
}
</style>
