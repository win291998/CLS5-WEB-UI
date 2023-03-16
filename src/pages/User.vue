<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div>
    <h1>Quản lí người dùng</h1>
    <VButton
      class="cursor-pointer"
      @click="() => { router.push({ name: 'user-chil' }) }"
    >
      user
    </VButton>
  </div>
</template>
