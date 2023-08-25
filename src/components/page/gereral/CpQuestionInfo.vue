<script lang="ts" setup>
interface Props {
  name: string
  isGroup: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const { t } = window.i18n()
const type = computed(() => {
  if (props.isGroup) {
    return {
      name: 'QuestionService.SingleQuestion',
      color: 'warning',
    }
  }

  return {
    name: 'QuestionService.GroupQuestion',
    color: 'primary',
  }
})
</script>

<template>
  <div>
    {{ t(name) }}
  </div>
  <div :class="`text-${type.color}`">
    {{ t(type.name) }}
  </div>
</template>
