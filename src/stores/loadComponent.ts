import { defineStore } from 'pinia'

export const load = defineStore('load', () => {
  const countComponent = ref(0)
  const components = ref<boolean[]>([])
  const indexloadComponent = ref<number[]>([])

  // Đếm số lượng component
  const addComponent = () => {
    countComponent.value++
  }

  const unloadMultiplecomponents = () => {
    indexloadComponent.value.forEach((element: number) => {
      components.value[element] = false
    })
    indexloadComponent.value = []
  }

  const unLoadComponent = (index: number) => {
    components.value[index] = false
  }

  // Đổi trạng thái cho component
  const loadComponent = (index: number) => {
    components.value[index] = true
  }

  // clear component
  const $reset = () => {
    components.value = []
    countComponent.value = 0
  }

  const loadMultiplecomponents = (array: number[]) => {
    array.forEach((element: number) => {
      indexloadComponent.value.push(element)
      loadComponent(element)
    })
  }

  return {
    countComponent,
    addComponent,
    components,
    loadComponent,
    unLoadComponent,
    loadMultiplecomponents,
    unloadMultiplecomponents,
  }
})
