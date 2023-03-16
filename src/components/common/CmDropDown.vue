<script setup lang="ts">
interface Props {
  listItem: ListItem[]
}
interface ListItem {
  title: string
  icon?: string
  colorClass?: string
  action?: Action
  event?: string
}
interface Action {
  type: string
  event: any
}
interface Emit {
  (e: 'change', data: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
}))

const emit = defineEmits<Emit>()

const handleChange = (event: any) => {
  emit('change', event)
}
</script>

<template>
  <div class="text-center">
    <VMenu
      @update:model-value="handleChange"
    >
      <template #activator="{ props }">
        <div v-bind="props">
          <VueFeather
            v-bind="props"
            type="more-vertical"
            :size="18"
          />
        </div>
      </template>

      <VList>
        <VListItem
          v-for="(item, i) in props.listItem"
          :key="i"
        >
          <VListItemTitle @click="item?.action?.event ? item?.action?.event() : ''">
            <VueFeather
              :type="item?.icon"
              :size="12"
              class="mr-2 color-dark"
              :class="[item.colorClass]"
            />
            <span class="text-medium-sm">{{ item.title }}</span>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>
