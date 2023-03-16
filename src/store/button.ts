import { defineStore } from 'pinia'

export const loadButton = defineStore('loadButton', () => {
  const countButton = ref(0)
  const buttons = ref<boolean[]>([])
  const indexButtonLoading = ref<number[]>([])

  // Đếm số lượng button
  const addButton = () => {
    countButton.value++
  }

  const unloadMultipleButtons = () => {
    indexButtonLoading.value.forEach((element: number) => {
      buttons.value[element] = false
    })
    indexButtonLoading.value = []
  }

  const buttonUnLoading = (index: number) => {
    buttons.value[index] = false
  }

  // Đổi trạng thái cho button
  const buttonLoading = (index: number) => {
    buttons.value[index] = true
  }

  // clear button
  const $reset = () => {
    buttons.value = []
  }

  const loadMultipleButtons = (array: number[]) => {
    array.forEach((element: number) => {
      indexButtonLoading.value.push(element)
      buttonLoading(element)
    })
  }

  return {
    countButton,
    addButton,
    buttons,
    buttonLoading,
    buttonUnLoading,
    loadMultipleButtons,
    unloadMultipleButtons,
  }
})
