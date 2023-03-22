<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { loadButton } from '@/store/button'
import CmButton from '@/components/common/CmButton.vue'

import CmDateStage from '@/components/common/CmDateStage.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmCard from '@/components/common/CmCard.vue'
import CmDropDown from '@/components/common/CmDropDown.vue'
import CmButtonGroup from '@/components/common/CmButtonGroup.vue'

const handleItem1 = value => {
  console.log(value)
}

const handleItem2 = value => {
  console.log(value)
}

const handleItem3 = (value: any) => {
  console.log(value)
}

const action = [{
  title: 'Xem chi tiết',
  icon: 'eye',
  action: handleItem1,
  prependItem: {
    value: true,
  },
},
{
  title: 'Tải file',
  icon: 'download',
  action: handleItem2,
  prependItem: {
    value: true,
    action: () => { console.log(action) },
  },
},
{
  title: 'Chỉnh sửa',
  icon: 'edit',
  action: handleItem3,
  prependItem: {
    value: true,
  },
}]

const handleClick = (value: any) => {
  console.log(action)
}

// action.value =
watch(action, () => {
  console.log(action)
}, { deep: true })

const store = loadButton()

const { countButton } = storeToRefs(store)
const { loadMultipleButtons, buttonUnLoading } = store

const router = useRouter()

const handlerPreButton = () => {
  debugger
}

const toast = useToast()

const showToast = () => {
  toast('win hello', {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: true,
  })
}
</script>

<template>
  <h1>Quản lí người dùng chil</h1>
  <CmDropDown
    :list-item="action"
    multiple
  />
  <CmButtonGroup
    :list-item="action"
    @click-prepend="handlerPreButton"
  >
    hello win
  </CmButtonGroup>

  <VBtn @click="loadMultipleButtons([1, 2, 3])">
    loading
  </VBtn>
  <CmButton
    text="button "
    is-load
    @click="handleClick"
  >
    <template #append>
      1
    </template>
    hello
    <template #prepend>
      2
    </template>
  </CmButton>
  <CmButton
    text="button "
    color="color-success"
    @click="handleClick"
  />
  <CmButton
    text="button"
    is-load
    color="btn-success"
    variant="outlined"
    @click="handleClick"
  >
    hello222
  </CmButton>
  <CmButton
    text="button "
    variant="outlined"
    color="color-error"
    @click="handleClick"
  >
    hello123
  </CmButton>
  <CmButton
    text="button "
    color="btn-error"
    @click="showToast"
  >
    hello
  </CmButton>
  <CmCheckBox
    color="color-error"
    @click="showToast"
  />
  <CmCheckBox color="color-primary" />
  <CmCheckBox color="color-warning" />
  <CmCheckBox color="color-success" />
  <CmCheckBox
    color="color-gray"
    @click="showToast"
  />

  <CmDateStage />

  <CmCard backgroud="bg-primary-50">
    <template #title>
      <VImg
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="200px"
        cover
      />
      <VCardTitle>
        Top western road trips
      </VCardTitle>
      <VCardSubtitle>
        1,000 miles of wonder
      </VCardSubtitle>
    </template>
    <template #text>
      hello hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello
    </template>
    <VDivider class="mx-4 mb-1" />

    <VCardTitle>Tonight's availability</VCardTitle>

    <div class="px-4">
      <VChipGroup>
        <VChip>5:30PM</VChip>

        <VChip>7:30PM</VChip>

        <VChip>8:00PM</VChip>

        <VChip>9:00PM</VChip>
      </VChipGroup>
    </div>
  </CmCard>
</template>
