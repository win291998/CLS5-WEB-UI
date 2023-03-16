<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div>
    <h1>Quản lí người dùng chil chil chil chil</h1>
    <VButton @click="() => { router.push({ name: 'user-chil' }) }">
      user
    </VButton>
  </div>
</template>
