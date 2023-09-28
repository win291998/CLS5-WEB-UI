<script setup lang="ts">
import CpIntroduce from '@/components/page/users/exam/test/CpIntroduce.vue'
import CpMyTest from '@/components/page/users/exam/test/CpMyTest.vue'

const isInroduceView = ref(true)
function startExam() {
  isInroduceView.value = false
}
</script>

<template>
  <div class="containter-light flex-center">
    <div class="containter-white">
      <div v-if="isInroduceView">
        <CpIntroduce @startExam="startExam" />
      </div>
      <div v-else>
        <CpMyTest />
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
