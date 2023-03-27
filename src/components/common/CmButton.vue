<script setup lang="ts">
import { load } from '@/stores/loadComponent.js'
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
  title?: string
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
  positionIcon?: string
  colorIcon?: string
}

const props = withDefaults(defineProps<Props>(), ({
  isLoad: false,
  block: false,
  disabled: false,
  color: 'primary',
  textColor: '',
  bgColor: '',
  className: '',
  variant: 'tonal',
  positionIcon: '',
}))

const emit = defineEmits<Emit>()
interface Emit {
  (e: 'click', idxBtn: number): void
}
const store = load()
const indexLoad = ref(0)
const { addComponent, loadComponent, unLoadComponent } = store
const { components } = storeToRefs(store)

onMounted(() => {
  addComponent()
  indexLoad.value = store.countComponent - 1
  components.value.push(false)
})

const handleClick = () => {
  loadComponent(indexLoad.value)
  emit('click', indexLoad.value)
}

const unLoadButton = () => {
  unLoadComponent(indexLoad.value)
}

const isDisabled = computed(() => {
  return props.disabled
})

const prefixColor = computed(() => {
  if (props.variant === 'outlined')
    return 'color'

  return 'btn'
})

defineExpose({
  unLoadButton,
})
</script>

<template>
  <VBtn
    :loading="props.isLoad ? components[indexLoad] : false"
    :variant="props.variant"
    :block="block"
    :disabled="isDisabled"
    :size="size"
    :rounded="rounded"
    color="white"
    class="text-style-btn"
    :class="[`${prefixColor}-${color}`, bgColor, className]"
    @click="handleClick"
  >
    <template #prepend>
      <slot name="prepend" />
    </template>

    <template
      #default
    >
      <div :class="[textColor]">
        <slot v-if="!title && !icon" />
        <div v-if="props.title || props.icon">
          <VueFeather
            v-if="props.icon"
            :type="props.icon"
            size="14"
            :class="[props.colorIcon]"
          />
          <span>{{ title }}</span>
        </div>
      </div>
    </template>
    <template #append>
      <slot name="append" />
    </template>
  </VBtn>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;

.text-style-btn {
  text-transform: inherit;
}
</style>
