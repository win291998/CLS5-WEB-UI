<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CmChip from '@/components/common/CmChip.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeMyCourse } from '@/constant/data/status.json'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const showHideIntr = ref(true)
function showMore() {
  showHideIntr.value = !showHideIntr.value
}
</script>

<template>
  <div class="box-content">
    <div class="text-bold-xl text-center">
      Vượt qua bài kiểm tra
    </div>
    <div class="text-regular-md text-center color-text-500">
      Điều kiện hoàn thành
    </div>
    <div class="text-regular-md text-center">
      <CmChip
        :color="MethodsUtil.checkType(0, StatusTypeMyCourse, 'id')?.color"
      >
        <span>{{ t(MethodsUtil.checkType(0, StatusTypeMyCourse, 'id').name) }}</span>
      </CmChip>
    </div>
    <div class="my-6 flex-center">
      <CmButton
        color="primary"
        :title="t('Bắt đầu làm bài')"
      />
    </div>
    <div class="text-bold-xl color-primary text-center">
      Tên chuyên đề khảo sát khảo sát khảo sát khảo sát
    </div>
    <div class="flex-center">
      <div class="mc-desc">
        <div>
          Tổng số câu hỏi: 10 câu
        </div>
        <div>
          Thời gian làm bài: 90 phút
        </div>
      </div>
    </div>
    <div
      class="mc-about"
      :class="{ 'text-over-hide': showHideIntr }"
    >
      Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học Nội dung khóa học khóa học
    </div>
    <div class="flex-center">
      <CmButton
        v-if="showHideIntr"
        id="showMoreButton"
        variant="text"
        color="primary"
        @click="showMore"
      >
        <div class="d-flex flex-noWrap">
          <div>
            Hiện thêm
          </div>
          <VIcon icon="tabler:chevron-down" />
        </div>
      </CmButton>
      <CmButton
        v-if="!showHideIntr"
        variant="text"
        color="primary"
        @click="showMore"
      >
        <div class="d-flex flex-noWrap">
          <div>
            Ẩn bớt
          </div>
          <VIcon icon="tabler:chevron-up" />
        </div>
      </CmButton>
    </div>
  </div>
</template>
