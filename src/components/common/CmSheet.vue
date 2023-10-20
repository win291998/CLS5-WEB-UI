<script setup lang="ts">
import type { Any } from '@/typescript/interface'

const props = withDefaults(defineProps<Props>(), {
  origin: 'bottom',
  size: 400,
})
const emit = defineEmits<Emit>()
declare const inline: readonly ['top', 'bottom', 'left', 'right']
interface Props {
  modelValue: boolean
  origin: typeof inline[number]
  size: number | string
}
interface Emit {
  (e: 'update:modelValue', value: boolean): void
}
const animation = computed(() => {
  if (props.modelValue)
    return 'in'

  return 'out'
})
const temp = ref(false)
watch(() => props.modelValue, val => {
  if (!val) {
    setTimeout(() => {
      temp.value = val
    }, 600)
  }
  else {
    temp.value = val
  }
})

const sizeBar = ref<string | number>(props.size)
const startPosition = ref(0)
const startSize = ref(0)
function handleResize(e: Any) {
  const el = document.querySelector('.content-sheet')
  if (['left', 'right'].includes(props.origin)) {
    startPosition.value = e.clientX
    startSize.value = el?.clientWidth as number
  }
  else {
    startPosition.value = e.clientY
    startSize.value = el?.clientHeight as number
  }

  document.documentElement.addEventListener('mousemove', doDragResize, false)
  document.documentElement.addEventListener('touchmove', doDragResize, false)
  document.documentElement.addEventListener('mouseup', stopDrag, false)
  document.documentElement.addEventListener('mouseup', stopDrag, false)
  document.documentElement.addEventListener('touchend', stopDrag, false)

  document.documentElement.removeEventListener('mousedown', handleResize, false)
}
function doDragResize(e: any) {
  let size
  switch (props.origin) {
    case 'right':
      size = startSize.value + (startPosition.value - e.clientX)
      if (size >= startSize.value)
        sizeBar.value = size
      break
    case 'left':
      size = startSize.value + (e.clientX - startPosition.value)
      if (size >= startSize.value)
        sizeBar.value = size
      break
    case 'top':
      size = startSize.value + (e.clientY - startPosition.value)
      if (size >= startSize.value)
        sizeBar.value = size
      break
    case 'bottom':
      size = startSize.value + (startPosition.value - e.clientY)
      if (size >= startSize.value)
        sizeBar.value = size
      break

    default:
      size = startSize.value + (startPosition.value - e.clientX)
      break
  }
}
const sizeSideBar = computed(() => {
  switch (props.origin) {
    case 'top':
    case 'bottom':
      return {
        width: '',
        height: sizeBar.value,
      }
    case 'left':
    case 'right':
      return {
        width: sizeBar.value,
        height: '',
      }
    default:
      return {
        width: sizeBar.value,
        height: sizeBar.value,
      }
  }
})
function stopDrag() {
  document.documentElement.removeEventListener('mousemove', doDragResize, false)
  document.documentElement.removeEventListener('mouseup', stopDrag, false)
}
</script>

<template>
  <div
    v-if="!props.modelValue"
    class="button-show-sidebar-vertical"
    :style="`${origin}: 0; ${['left', 'right'].includes(origin) ? 'top: 0' : 'left: 0'}`"
  >
    <div
      class="cursor-pointer"
      @click="emit('update:modelValue', !props.modelValue)"
    >
      <VIcon
        :style="`transform: ${['top', 'bottom'].includes(origin) ? 'unset' : 'rotate(90deg)'};`"
        icon="tabler:chevron-up"
        size="14"
      />
    </div>
  </div>

  <VDialog
    :model-value="temp"
    :class="`animation-${origin}-${animation} cm-sheet`"
    transition="none"
    :leave-absolute="true"
    :width="sizeSideBar.width"
    :height="sizeSideBar.height"
    fullscreen
    no-click-animation
    persistent
    :content-class=" `unset-position ${origin}-0`"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <div
      class="content-sheet h-100 w-100"
    >
      <div
        :style="`${['top', 'bottom'].includes(origin) ? 'cursor: row-resize' : 'rotate(90deg) cursor:  col-resize'}; `"
        class="resize-sidebar"
        @mousedown.stop.prevent="handleResize"
      >
        <VIcon
          :style="`transform: ${['top', 'bottom'].includes(origin) ? 'unset' : 'rotate(90deg)'}; `"
          icon=" tabler:chevron-down"
          size="16"
          @click.stop="emit('update:modelValue', !props.modelValue)"
        />
      </div>

      <VCard
        variant="flat"
        class=" h-100 w-100"
      >
        <template
          #text
        >
          <slot />
        </template>
      </VCard>
    </div>
  </VDialog>
</template>

<style lang="scss">
.button-show-sidebar-horizontal {
  position: absolute;
  z-index: 2400;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--v-gray-200));
}

.button-show-sidebar-vertical {
  position: absolute;
  z-index: 2400;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--v-gray-200));
}

.cm-sheet {
  .v-overlay__scrim {
    display: none !important;
  }

  .resize-sidebar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 10px ;
    background-color: rgb(var(--v-gray-200));
  }

  .unset-position {
    top: unset !important;
    right: unset !important;
    bottom: unset !important;
    left: unset !important;
  }

  .top-0 {
    top: 0!important;

    .content-sheet {
      display: flex;
      width: 100%;
      flex-direction: column-reverse;
    }
  }

  .left-0 {
    left: 0!important;

    .content-sheet {
      display: flex;
      flex-direction: row-reverse;
    }
  }

  .bottom-0 {
    bottom: 0!important;

    .content-sheet {
      width: 100%;
    }
  }

  .right-0 {
    right: 0!important;

    .content-sheet {
      display: flex;
      flex-direction: row;
    }
  }
}

.animation-top-in {
  animation: down-in .5s;
}

.animation-top-out {
  animation: down-out 1s;
}

@keyframes down-in {
  0% {
    top:  -100vh;
  }

  100% {
    top: 0;
  }
}

@keyframes down-out {
  0% {
    top: 0;
  }

  100% {
    top: -100vh;
  }
}

.animation-bottom-in {
  animation: up-in .5s;
}

.animation-bottom-out {
  animation: up-out 1s;
}

@keyframes up-in {
  0% {
    bottom: -100%;
  }

  100% {
    bottom: 0;
  }
}

@keyframes up-out {
  0% {
    bottom: 0;
  }

  100% {
    bottom: -100%;
  }
}

.animation-left-in {
  animation: left-in .5s;
}

.animation-left-out {
  animation: left-out 1s;
}

@keyframes left-in {
  0% {
    left: -100%;
  }

  100% {
    left: 0;
  }
}

@keyframes left-out {
  0% {
    left: 0;
  }

  100% {
    left: -100%;
  }
}

.animation-right-in {
  animation: right-in .5s;
}

.animation-right-out {
  animation: right-out 1s;
}

@keyframes right-in {
  0% {
    right:  -100%;
  }

  100% {
    right: 0;
  }
}

@keyframes right-out {
  0% {
    right: 0;
  }

  100% {
    right: -100%;
  }
}
</style>
