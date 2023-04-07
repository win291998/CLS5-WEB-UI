<script setup lang="ts">
import CmtextArea from '@/components/common/CmtextArea.vue'
import CmTextField from '@/components/common/CmTextField.vue'

const dataInput = ref({
  code: '',
  name: '',
  description: '',
})
</script>

<template>
  <div class="d-flex add-group-user">
    <div
      class="w-50 h-auto d-flex flex-wrap pl-2 pr-2"
    >
      <div class="w-100">
        <CmTextField
          v-model="dataInput.code"
          text="Mã nhóm người dùng"
        />
      </div>
      <div class="w-100">
        <CmTextField
          v-model="dataInput.name"
          text="Tên nhóm người dùng*"
        />
      </div>
    </div>
    <div
      class="w-50  pl-2 pr-2"
    >
      <CmtextArea
        v-model="dataInput.description"
        text="Mô tả"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .add-group-user {
    display: inline-block;
    height: 30vh;
  }
</style>
