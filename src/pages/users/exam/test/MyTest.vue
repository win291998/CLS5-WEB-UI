<script setup lang="ts">
const CpIntroduce: any = defineAsyncComponent(() => import('@/components/page/users/exam/test/CpIntroduce.vue'))
const CpMyTest: any = defineAsyncComponent(() => import('@/components/page/users/exam/test/CpMyTest.vue'))

const isInroduceView = ref(true)
const isTestRender = ref(false)
const isProgress = ref(false)
function startExam() {
  isInroduceView.value = false
}
function myTestRendered() {
  console.log('redner2')
  isProgress.value = true
}
onMounted(() => {
  isTestRender.value = true
})
</script>

<template>
  <div class="containter-light flex-center">
    <div class="containter-white">
      <div v-show="isInroduceView">
        <CpIntroduce
          :is-progress="isProgress"
          @startExam="startExam"
        />
      </div>
      <div
        v-if="isTestRender"
        v-show="!isInroduceView"
      >
        <CpMyTest @loaded="myTestRendered" />
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
