<script setup lang="ts">
const propsValue = withDefaults(defineProps<Props>(), ({
  icon: 'fe:edit',
  color: 'primary',
  size: 16,
  bgColor: '',
  type: 1,
}))

/**
 *  color: màu của item
 *  icon: icon,
 *  size: kích thước
 *  bgColor: màu nền
 * }
 */

interface Props {
  color?: string
  icon?: string
  bgColor?: string
  size?: number
  type?: number
}
const sizeIcon = computed(() => Number(propsValue.size) + 16)
</script>

<template>
  <VIcon
    v-if="type === 1"
    :icon="icon"
    :size="size"
    :color="color"
    variant="tonal"
  />
  <VBtn
    v-else
    :width="sizeIcon"
    :height="sizeIcon"
    :min-width="5"
    rounded
    variant="tonal"
    :icon="icon"
    :color="bgColor"
  >
    <template
      #default
    >
      <VIcon
        :icon="icon"
        :size="size"
        :color="color"
      />
    </template>
  </VBtn>
</template>
