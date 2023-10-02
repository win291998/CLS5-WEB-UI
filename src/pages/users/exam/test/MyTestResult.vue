<script setup lang="ts">
import CmImg from '@/components/common/CmImg.vue'
import { Themes, iconSystem } from '@/typescript/class/Theme'
import CmButton from '@/components/common/CmButton.vue'
import CmButtonGroup from '@/components/common/CmButtonGroup.vue'

const { t } = window.i18n()

const result = ref({
  examId: 460,
  id: 4002729,
  isDisplayRating: false,
  isPassed: false,
  minusPoint: 0,
  numberOfRetake: 99,
  reviewId: 3,
  testCodeName: 'ngày 11',
  testId: 2040,
  testName: 'CLS5- đang code không sua',
  testShiftId: null,
  totalQuestion: 23,
  userPoint: 0,
  userRetake: 2,
  startDate: '2023-09-25T10:53:00',
  endDate: '2023-09-30T12:00:00',
  isCertification: true,
  isReview: null,
  isMarkEssay: false,
  isComplete: true,
  isFinalResult: false,
  completeDate: '2023-09-29T11:07:17.2379822',
  userName: 'xuan bach',
})
const listItemButtonGroup = [
  {
    title: 'Xem lần 1',
    key: 'importFile',
  },
]
function getImage(): string {
  const dataImg = Themes.imageSystem.examWaitingMark
  return typeof dataImg === 'string' ? dataImg : ''
}
</script>

<template>
  <div class="containter-light flex-center">
    <div class="containter-white flex-center">
      <div class="ct-btn-x">
        <CmButton
          padding="16px"
          color="white"
          icon="tabler:x"
          :size-icon="24"
        />
      </div>
      <div class="ct-content">
        <div class="flex-center w-100 my-6">
          <CmImg
            class="ct-img "
            :src="getImage()"
          />
        </div>
        <div class="ct-icon flex-center w-100 my-6">
          <CmImg
            :src="result.isPassed ? iconSystem.complete : iconSystem.error"
          />
        </div>
        <div class="ct-name text-bold-xl color-primary text-center">
          Chúc mừng Nguyễn Văn An!
        </div>
        <div class="ct-name-sub text-regular-md text-center">
          Bạn đã vượt qua chuyên đề thi
        </div>
        <div class="mt-4 display-bold-xs text-center color-success">
          56/100 điểm
        </div>
        <div class="ct-desc">
          <div>
            Tổng số câu hỏi: 25 câu
          </div>
          <div>
            Điểm bị trừ: 1 điểm
          </div>
          <div>
            Được làm lại: 2 lần
          </div>
        </div>
        <div class="mt-6 d-flex">
          <CmButton
            class="mr-3"
            color="primary"
            variant="tonal"
            :title="t('repeat-exam')"
          />
          <CmButton
            color="primary"
            :title="t('see-the-results')"
          />
          <CmButtonGroup
            :title="t('see-the-results')"
            color="primary"
            class="ml-1"
            :list-item="listItemButtonGroup"
          />
        </div>
        <div class="flex-center mt-3">
          <CmButton
            color="white"
            :title="t('see-the-certification')"
          />
        </div>
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
    position: relative;
    background-color: rgb(var(--v-theme-surface));
    max-width: 1400px;
    height: 100%;
    min-height: calc(100vh - 4rem);
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
    .ct-content{
      height: auto;
      .ct-img{
        width: auto;
        height: auto;
        max-height: 200px;
        max-width: 200px;
      }
      .ct-icon{
        width: 48px;
        height: 48px;
      }
      .ct-desc{
        border-radius: 8px;
        background-color: rgb(var(--v-primary-50));
        padding: 12px 16px;
        text-align: center;
        margin-top: 1rem;
      }
    }
    .ct-btn-x{
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
}
</style>
