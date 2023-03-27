<script setup lang="ts">
import { loadButton } from '@/store/button'
import type { typeVariant } from '@/typescript/enums/enums'

/*
  isLoad: boolean cho phép button loading hay không
  block: boolean
  text?: string tiêu đề button
  color?: string class màu của button gồm btn- hoặc color(nếu dùng variant outlined) cộng với tên màu, primary, error, warning, success, dark
  rounded?: string bo góc của button
  icon?: string
  variant?: string
  size?: string
  disabled?: boolean
*/

interface Props {
  isLoad?: boolean
  block?: boolean
  color?: string
  bgColor?: string
  rounded?: string
  icon?: string
  variant?: typeof typeVariant[number]
  size?: string
  textColor?: string
  disabled?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), ({
  isLoad: false,
  block: false,
  disabled: false,
  color: '',
  textColor: '',
  bgColor: '',
  className: '',
  variant: 'tonal',
}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'click', idxBtn: number): void
}
const store = loadButton()
const indexLoad = ref(0)
const { addButton, buttonLoading } = store
const { buttons } = storeToRefs(store)

onMounted(() => {
  addButton()
  indexLoad.value = store.countButton - 1
  buttons.value.push(false)
})

const handleClick = () => {
  buttonLoading(indexLoad.value)
  emit('click', indexLoad.value)
}

const isDisabled = computed(() => {
  return props.disabled
})
</script>

<template>
  <VBtn
    :loading="props.isLoad ? buttons[indexLoad] : false"
    :variant="props.variant"
    :block="block"
    :disabled="isDisabled"
    :icon="icon"
    :size="size"
    :rounded="rounded"
    color="white"
    class="text-style-btn"
    :class="[color, bgColor, className]"
    @click="handleClick"
  >
    <template #prepend>
      <slot name="prepend" />
    </template>

    <template
      #default
    >
      <div :class="[textColor]">
        <slot />
      </div>
    </template>
    <template #append>
      <slot name="append" />
    </template>
  </VBtn>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;

.text-style-btn {
  text-transform: inherit;
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.custom-loader {
  display: flex;
  animation: loader 1s infinite;
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
