<script setup lang="ts">
import type { colorType, densityType } from '@/typescript/enums/enums'

interface Props {/** ** Interface */
  rating?: number
  length: number
  emptyIcon?: string
  fullIcon?: string
  halfIcon?: string
  emptyColor?: string
  labelColor?: typeof colorType[any]
  fullColor?: string
  hover?: boolean
  sizeIcon?: any
  labels?: any[]
  halfIncrements?: boolean
  density?: typeof densityType[any]
  maxWidth?: number
}

const props = withDefaults(defineProps<Props>(), ({
  rating: 0,
  length: 0,
  hover: false,
  halfIncrements: false,
  emptyColor: 'orange',
  fullColor: 'orange',
  fullIcon: 'tabler:star-filled',
  emptyIcon: 'tabler:star',
  halfIcon: 'tabler:star-half-filled',
  density: 'default',
  maxWidth: 700,
}))
const ratingValue = ref()
</script>

<template>
  <VRating
    v-model="ratingValue"
    :empty-icon="emptyIcon"
    :full-icon="fullIcon"
    :half-icon="halfIcon"
    :half-increments="halfIncrements"
    :hover="hover"
    :color="fullColor"
    :item-labels="labels"
    item-label-position="bottom"
    :density="density"
    :style="{ width: '100%' }"
    :length="length"
    :disabled="true"
    class="d-flex justify-space-around rating-common"
  >
    <template
      v-if="labels"
      #item-label="props"
    >
      <span
        class="text-rating "
        :class="`text-${labelColor}`"
        :style="{ maxWidth: `${(maxWidth / length) - 40}px` }"
        v-html="props.label"
      />
    </template>
  </VRating>
</template>

<style lang="scss">
.rating-common > label:first-child {
  display: none;
}
.rating-common{
  .text-rating{
    white-space: pre-wrap;
  }
}
</style>
