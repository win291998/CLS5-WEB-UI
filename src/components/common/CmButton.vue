<script setup lang="ts">
import { loadButton } from '@/store/button'

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
  isLoad: boolean
  block: boolean
  text?: string
  color?: string
  rounded?: string
  icon?: string
  variant?: string
  size?: string
  disabled?: boolean
}
interface Emit {
  (e: 'click', idxBtn: number): void
}

const props = withDefaults(defineProps<Props>(), ({
  isLoad: false,
  block: false,
  disabled: false,
  color: 'btn-primary',
}))

const emit = defineEmits<Emit>()

const store = loadButton()
const indexLoad = ref(0)
const { addButton, buttonLoading } = store
const { buttons } = storeToRefs(store)

onMounted(() => {
  addButton()
  indexLoad.value = store.countButton - 1
  buttons.value.push(false)
})

// rounded: Không truyền, lg, 0, pill
// const rounded = ''

// size: x-small, small, Không truyền  , large, x-large
// const size = 'x-small'

const handleClick = () => {
  buttonLoading(indexLoad.value)
  emit('click', indexLoad.value)
}

const isDisabled = computed(() => {
  return props.disabled || buttons[indexLoad.value]
})
</script>

<template>
  <VBtn
    :loading="props.isLoad ? buttons[indexLoad] : false"
    variant="outlined"
    :block="props.block"
    :disabled="isDisabled"
    :icon="props.icon"
    :size="props.size"
    :rounded="props.rounded"
    :class="props.color"
    @click="handleClick"
  >
    <span v-if="text">{{ text }}</span>
    <slot v-else />
  </VBtn>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
//

 @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
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
