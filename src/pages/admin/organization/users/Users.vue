<script setup lang="ts">
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const count = ref(0)

const countPlus = () => {
  count.value++
}
</script>

<template>
  <div>
    users
    <CmButton
      color="btn-primary"

      @click="countPlus"
    >
      hello {{ count }}
    </CmButton>
  </div>
  <div>mot</div>
</template>

