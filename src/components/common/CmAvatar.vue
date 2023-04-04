<script lang="ts" setup>
import Globals from '@/constant/Globals'
import type { typeVariant } from '@/typescript/enums/enums'

interface Props {
  color?: string
  variant?: typeof typeVariant[number]
  rounded?: string | number | boolean
  src?: any
  size?: number
  className?: string
  isClassicBorder?: boolean
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  color: '',
  variant: Globals.VARIANT_DEFAULT,
  size: Globals.SIZE_AVATAR_DEFAULT,
  isClassicBorder: false,
}))

const prefixColor = computed(() => {
  if (props.variant === 'outlined')
    return `color-${props.color}`

  return `btn-${props.color}`
})
</script>

<template>
  <VAvatar
    class="cursor-pointer"
    :class="[className, isClassicBorder ? 'border-avatar' : '']"
    :color="prefixColor"
    :variant="variant"
    :rounded="rounded"
    :size="size"
  >
    <VImg
      v-if="src"
      :src="src"
    />
    <span
      v-else
      :style="{ fontSize: `${size / 2}px` }"
    ><slot /></span>
  </VAvatar>
</template>

<style lang="scss">
@use "@/styles/variables/global" as *;

.border-avatar {
  border: 4px solid $color-white;
  box-shadow: $box-shadow-lg;
}
</style>
