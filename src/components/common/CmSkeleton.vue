<script setup lang="ts">
import { createVuetify } from 'vuetify'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

import {
  BulletListLoader,
  CodeLoader,
  ContentLoader,
  FacebookLoader,
  InstagramLoader,
  ListLoader,
} from 'vue-content-loader'
import type { typeSkeleton } from '@/typescript/enums/enums'

interface Props {
  type: typeof typeSkeleton[number]
}

const props = withDefaults(defineProps<Props>(), ({
  type: 'ContentLoader',
}))
const skeletonComponent = (type: string) => {
  let component = null
  switch (type) {
    case 'BulletListLoader':
      component = BulletListLoader
      break
    case 'CodeLoader':
      component = CodeLoader
      break
    case 'ContentLoader':
      component = ContentLoader
      break
    case 'FacebookLoader':
      component = FacebookLoader
      break
    case 'InstagramLoader':
      component = InstagramLoader
      break
    case 'ListLoader':
      component = ListLoader
      break

    default:
      component = ContentLoader
      break
  }
  return component
}
</script>

<template>
  <div>
    <Component
      :is="skeletonComponent(type)"
      height="500"
      width="100%"
      viewBox="0 0 100% 550"
      primary-color="#F2F4F7"
      secondary-color="#D0D5DD"
    >
      <slot />
    </Component>
  </div>
</template>

