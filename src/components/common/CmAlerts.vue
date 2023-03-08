<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  icon: false,
  title: 'Alert title',
  text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi.',
  variant: undefined,
  type: undefined,
  color: undefined,
  density: undefined,
  border: undefined,
  closable: false,
  width: undefined,
  class: undefined,
  position: undefined,
})

const position = ['relative', 'absolute', 'static', 'fixed', 'sticky'] as const
interface Props {
  icon?: any
  title?: string
  text?: string
  variant?: any
  type?: any
  color?: string
  density?: any
  border?: any
  closable?: boolean
  width?: string | number
  class?: Array<string> | string
  position?: typeof position[number]
}
</script>

<template>
  <div>
    <VAlert
      :closable="props.closable"
      :icon="props.icon"
      :title="props.title"
      :text="props.text"
      :variant="props.variant"
      :type="props.type"
      :color="props.color"
      :density="props.density"
      :border="props.border"
      :width="props.width"
      :class="props.class"
    >
      <template #title>
        <VAlertTitle>
          <slot name="customTitle">
            {{ props.title }}
          </slot>
        </VAlertTitle>
      </template>
    </VAlert>
  </div>
</template>

<style scoped>
/* css */
</style>
