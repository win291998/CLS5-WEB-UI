<script setup lang="ts">
import { useRouter } from 'vue-router'
import { loadButton } from '@/store/button'
import CmButton from '@/components/common/CmButton.vue'

const store = loadButton()

const { countButton } = storeToRefs(store)
const { loadMultipleButtons, buttonUnLoading } = store

const router = useRouter()

const handleClick = value => {
  console.log(value)
  setTimeout(() => {
    buttonUnLoading(value)
  }, 3000)
}
</script>

<template>
  <div>
    <h1>Quản lí người dùng chil</h1>
    <VBtn @click="loadMultipleButtons([1, 2, 3])">
      loading
    </VBtn>
    <CmButton
      text="button "
      is-load
      @click="handleClick"
    />
    <CmButton text="button " />
    <CmButton
      text="button"
      is-load
      variant="outlined"
    />
    <CmButton
      text="button "
      variant="outlined"
      color="color-error"
    />
    <CmButton text="button " />
    <CmButton><span>hello</span></CmButton>
    <CmButton />
    <CmButton />
    <CmButton />
  </div>
</template>
