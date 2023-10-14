<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

interface Props {
  orientation?: string
  id?: number
}

const props = withDefaults(defineProps<Props>(), ({
  orientation: 'horizontal',
  id: 1,
}))

const perfectScrollbarSettings = {
  wheelSpeed: 0.66,
}
const splitter = ref<any>(null)
const firstEl = ref<any>(null)
const secondEl = ref<any>(null)
const last_position = ref(null)
const display_view = ref(0)
const min_view = ref(50)
const mouseOrient = ref('clientX')
const isMoving = ref(false)
const slitter = ref<any>({})
function init() {
  splitter.value = document.getElementById(`splitter${props.id}`)
  firstEl.value = document.getElementById(`first-content${props.id}`)
  secondEl.value = document.getElementById(`second-content${props.id}`)
  splitter.value?.addEventListener('mousedown', onMouseDown, false)
  if ('ontouchstart' in window)
    splitter.value.addEventListener('touchstart', onTouchStart, false)
}
function startMove(e: any) {
  e.preventDefault()
  isMoving.value = true
  if (props.orientation === 'vertical' && !display_view.value)
    display_view.value = document.getElementById(`slitter-view-question${props.id}`)?.clientWidth || 880
}
function endMove(e: any, isTouch = false) {
  if (isMoving.value === true) {
    e.preventDefault()
    if (isTouch) {
      if ('ontouchstart' in window) {
        splitter.value.removeEventListener('touchmove', onTouchMove)
        splitter.value.removeEventListener('touchend', onTouchEnd)
        splitter.value.addEventListener('touchstart', onTouchStart, false)
      }
    }
    else {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      splitter.value.addEventListener('mousedown', onMouseDown, false)
    }
    setPosition(last_position.value)
    nextTick(() => {
      slitter.value[`firstContentScrollbar${props.id}`]?.update()
      slitter.value[`secondContentScrollbar${props.id}`]?.update()
    })
    isMoving.value = false
  }
}

function onMouseDown(e: any) {
  startMove(e)
  last_position.value = e[`${mouseOrient.value}`]
  splitter.value.removeEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('mouseup', onMouseUp, false)
}

function onMouseUp(e: any) {
  endMove(e)
}

function onMouseMove(e: any) {
  e.preventDefault()
  setPosition(e[`${mouseOrient.value}`])
}

// Mobile event
function onTouchStart(e: any) {
  startMove(e)
  last_position.value = e.targetTouches[0][mouseOrient.value]
  if ('ontouchstart' in window) {
    splitter.value.removeEventListener('touchstart', onTouchStart)
    splitter.value.addEventListener('touchmove', onTouchMove, false)
    splitter.value.addEventListener('touchend', onTouchEnd, false)
  }
}

function onTouchEnd(e: any) {
  endMove(e, true)
}

function onTouchMove(e: any) {
  e.preventDefault()
  setPosition(e.targetTouches[0][mouseOrient.value])
}

function setPosition(nowX: any) {
  let dx = nowX - Number(last_position.value)
  if (props.orientation === 'vertical') {
    dx += firstEl.value.clientWidth
    if (dx < min_view.value)
      dx = min_view.value

    firstEl.value.style.width = `${dx}px`
    dx += splitter.value.clientWidth
    dx = display_view.value - dx
    if (dx < min_view.value)
      dx = min_view.value

    secondEl.value.style.width = `${dx}px`
  }
  else {
    dx += firstEl.value.clientHeight
    if (dx < min_view.value) {
      dx = min_view.value
      firstEl.value.style.maxHeight = `${dx}px`
      return
    }
    firstEl.value.style.maxHeight = `${dx}px`
  }
  last_position.value = nowX
}
onMounted(() => {
  init()
})
watch(() => props.id, (newValue, oldValue) => {
  slitter.value[`firstContentScrollbar${props.id}`] = ref()
  slitter.value[`secondContentScrollbar${props.id}`] = ref()
  nextTick(() => {
    if (slitter.value[`firstContentScrollbar${props.id}`] && slitter.value[`firstContentScrollbar${props.id}`].$el) {
      slitter.value[`firstContentScrollbar${props.id}`]?.update()
      slitter.value[`firstContentScrollbar${props.id}`].$el.scrollTop = 0
    }
    if (slitter.value[`secondContentScrollbar${props.id}`] && slitter.value[`secondContentScrollbar${props.id}`].$el) {
      slitter.value[`secondContentScrollbar${props.id}`]?.update()
      slitter.value[`secondContentScrollbar${props.id}`].$el.scrollTop = 0
    }
  })
}, { immediate: true })

if (props.orientation === 'horizontal')
  mouseOrient.value = 'clientY'
</script>

<template>
  <div
    :id="`slitter-view-question${id}`"
    class="slitter-view-question"
    :class="{ horizontal: orientation === 'horizontal' }"
  >
    <PerfectScrollbar
      :id="`first-content${id}`"
      :ref="`firstContentScrollbar${id}`"
      :settings="perfectScrollbarSettings"
      class="scroll-area slitter-view-content box-first-content px-50"
    >
      <div
        class="content-first"
      >
        <slot
          name="first-element"
        />
      </div>
    </PerfectScrollbar>
    <div
      :id="`splitter${id}`"
      class="splitter"
    />
    <PerfectScrollbar
      :id="`second-content${id}`"
      :ref="`secondContentScrollbar${id}`"
      :settings="perfectScrollbarSettings"
      class="scroll-area slitter-view-content box-second-content px-50"
    >
      <div
        class="content-second"
      >
        <slot
          name="second-element"
        />
      </div>
    </PerfectScrollbar>
  </div>
</template>

<style scoped>
.slitter-view-question {
  position: relative;
  display: flex;

  .slitter-view-content {
    max-height: 70vh;
    .ps__rail-x {
      height: 10px;

      &.ps--clicking {
        .ps__thumb-x {
          height: 6px;
        }
      }
      &:focus {
        >.ps__thumb-x {
          height: 6px;
        }
      }
      &:hover {
        >.ps__thumb-x {
          height: 6px;
        }
      }
      .ps__thumb-x {
        height: 4px;
      }
    }
    .ps__rail-y {
      width: 10px;
      &.ps--clicking {
        .ps__thumb-y {
          width: 6px;
        }
      }
      &:focus {
        >.ps__thumb-y {
          width: 6px;
        }
      }
      &:hover {
        >.ps__thumb-y {
          width: 6px;
        }
      }
      .ps__thumb-y {
        width: 4px;
      }
    }
  }
  .box-first-content {
    width: calc(50% - 3px);
    .content-first {
      min-width: 200px;
      padding-right: 1rem;
    }
  }
  .box-second-content {
    width: calc(50% - 3px);
    .content-second {
      min-width: 250px;
      padding-left: 1rem;
    }
  }
  .splitter {
    flex: 0 0 auto;
    width: 8px;
    background-color: #A6A8B0;
    cursor: col-resize;
    position: relative;
    touch-action: none;
    &::before {
      content: '';
      display: inline-block;
      height: 35px;
      width: 1px;
      background-color: #2E3A4A;
      position: absolute;
      top: 50%;
      left: 2px;
      transform: translateY(-50%);
    }
    &::after {
      content: '';
      display: inline-block;
      height: 35px;
      width: 1px;
      background-color: #2E3A4A;
      position: absolute;
      top: 50%;
      left: 5px;
      transform: translateY(-50%);
    }
  }
  &.horizontal {
    flex-direction: column;
    .slitter-view-content {
      max-height: unset;
    }
    .box-first-content {
      width: 100%;
      max-height: 20vh;
      height: unset;
    }
    .box-second-content {
      width: 100%;
      height: 60vh;
    }
    .splitter {
      flex: 0 0 auto;
      height: 8px;
      width: 100%;
      cursor: row-resize;
      z-index: 10;
      &::before {
        height: 1px;
        width: 35px;
        left: 50%;
        top: 2px;
        transform: translateX(-50%);
      }
      &::after {
        height: 1px;
        width: 35px;
        left: 50%;
        top: 5px;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
