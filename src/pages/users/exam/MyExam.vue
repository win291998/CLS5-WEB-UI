<script setup lang="ts">
const router = useRouter()
function goLink() {
  router.push({ name: 'my-test', params: { id: 2040 } })
}
</script>

<template>
  <div>
    <button @click="goLink">
      ky thi của tôi
    </button>
  </div>
</template>

<style scoped>

</style>
