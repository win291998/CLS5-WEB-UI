<script setup lang="ts">
interface Props {/** ** Interface */
  prependIcon?: string
  className?: string
  color?: string
  bgColor?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), ({
}))

const prefixColor = computed(() => {
  if (props.variant === 'outlined' || props.variant === 'text')
    return 'color'

  return 'btn'
})
</script>

<template>
  <VChip
    color="primary"
    :class="[`${prefixColor}-${color}`, bgColor, className, textColor]"
    text-color="white"
    :prepend-icon="prependIcon"
  >
    <slot />
  </VChip>
</template>

