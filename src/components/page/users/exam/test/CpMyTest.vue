<script setup lang="ts">
import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
import CmChip from '@/components/common/CmChip.vue'
import CpContentView from '@/components/page/gereral/CpContentView.vue'
import { fetchData } from '@/mock/exam/'

const sheet = ref(false)
const layoutMobile = ref(false)

function handleResize() {
  // Kiểm tra kích thước màn hình và cập nhật giá trị visibleItems
  if (window.innerWidth >= 666)
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
//         answerId: 2248258,
//         answerValue: null,
//         content: '<span>1.1</span>',
//         essayContent: '',
//         urlFile: '',
//         isCorrect: null,
//         isTrue: false,
//         position: 1,
//       },
//       { answeredValue: null, answerId: 2248261, answerValue: null, content: '<span>đã sửa</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 2 },
//       { answeredValue: true, answerId: 2248260, answerValue: null, isTrue: true, content: '<span>7.5</span>', essayContent: '', urlFile: '', isCorrect: null, position: 3 },
//       { answeredValue: null, answerId: 2248259, answerValue: null, content: '<span>ddđ</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 4 }],
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
//         answerId: 2248265,
//         answerValue: null,
//         content: '<span>1</span>',
//         essayContent: '',
//         urlFile: '',
//         isCorrect: null,
//         isTrue: false,
//         position: 1,
//       },
//       { answeredValue: true, answerId: 2248264, answerValue: null, content: '<span>2</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 2 },
//       { answeredValue: null, answerId: 2248263, answerValue: null, content: '<span>3</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: true, position: 3 },
//       { answeredValue: null, answerId: 2248262, answerValue: null, content: '<span>4</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 4 },
//       { answeredValue: null, answerId: 2248266, answerValue: null, content: '<span>hhhhhhhhhhhhhhh</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 5 }],
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
//       answerId: 2248267,
//       answerValue: null,
//       content: '<span>1</span>',
//       essayContent: '',
//       urlFile: '',
//       isCorrect: null,
//       isTrue: false,
//       position: 1,
//     },
//     { answeredValue: null, answerId: 2248268, answerValue: null, content: '<span>2</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 2 },
//     { answeredValue: null, answerId: 2248269, answerValue: null, content: '<span>thêm mới hihi</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: false, position: 3 },
//     { answeredValue: null, answerId: 2248270, answerValue: null, content: '<span>đ</span>', essayContent: '', urlFile: '', isCorrect: null, isTrue: true, position: 4 }],
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
const questions = ref()
const totalPoint = ref()
async function getQuestionListTest() {
  await fetchData().then((value: any) => {
    questions.value = value.data.questions
    totalPoint.value = value.data.totalPoint
  })
}

const isReview = ref(true)
getQuestionListTest()
</script>

<template>
  <div class="mt">
    <div class="mt-left">
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
      <div class="mt-content mt-8">
        <div
          v-for="(qs, pos) in questions"
          :key="qs.id"
        >
          <div v-if="qs.typeId !== 10">
            <CpContentView
              :type="qs.typeId"
              :data="qs"
              :number-question="pos + 1"
              :disabled="isReview"
              :is-review="isReview"
              :total-point="totalPoint"
              is-sentence
              :is-show-ans-false="isReview"
              :is-show-ans-true="isReview"
            />
            <!--
              disabled
              is-show-ans-true
              is-show-ans-false
              is-hide-not-choose
            -->
          </div>
          <div v-if="qs.typeId === 10 && qs">
            <div class="text-medium-md text-cluse-title">
              Yêu cầu chung: Nội dung câu hỏi chùm câu hỏi chùm câu hỏi chùm
            </div>
            <div
              v-for="(qsItem, pos) in qs.questions"
              :key="qsItem.id"
              class="mb-5"
            >
              <CpContentView
                :type="qs.typeId"
                :data="qs"
                is-sentence
                is-show-ans-true
                is-show-ans-false
                is-hide-not-choose
                :number-question="pos + 1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-right">
      a
    </div>

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
              This is a bottom sheet using the controlled by v-model instead of activator
            </div>
          </VCardText>
        </VCard>
      </VBottomSheet>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mt{
  display: flex;
  .mt-left{
    width: 70% ;
    margin-right: 12px;
  }
  .mt-right{
    width: 30% ;
    background-color: aqua;
    margin-left: 12px;
  }
}
</style>
