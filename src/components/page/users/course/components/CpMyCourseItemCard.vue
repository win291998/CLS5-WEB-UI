<script setup lang="ts">
import CmCard from '@/components/common/CmCard.vue'
import CmButton from '@/components/common/CmButton.vue'

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
</script>

<template>
  <div class="my-course-card">
    <CmCard padding="14px 8px">
      <template #title>
        <div class="v-card-img">
          <VImg
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            height="12rem"
            cover
          />
        </div>
        <VCardTitle>
          <VProgressLinear
            rounded-bar
            :model-value="50"
            color="success"
            class="mt-6"
            rounded
            height="8"
          />
        </VCardTitle>
      </template>
      <template #text>
        <div class="text-semibold-sm label-author mb-2">
          Tên tác giả
        </div>
        <div class="text-semibold-md label-course">
          Tên khóa học khóa học
        </div>
      </template>
      <div class="box-content">
        <slot />
      </div>
      <template
        #actions
      >
        <CmButton
          class="w-100"
          :title="t('Bắt đầu')"
          color="primary"
        />
      </template>
    </CmCard>
  </div>
</template>

<style scoped>
.my-course-card{
  .label-author{
    color:  rgb(var(--v-primary-700));
  }
  .label-course{
    color:  rgb(var(--v-gray-900));
  }
  .box-content{
    padding: 8px 16px;
  }
}
</style>
