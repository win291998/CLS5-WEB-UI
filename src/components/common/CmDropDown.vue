<script setup lang="ts">
interface Props {
  listItem: ListItem[]
}
interface ListItem {
  title: string
  icon?: string
  colorClass?: string
  action?: Action
}
interface Action {
  type: string
  event: string
}
interface Emit {
  (e: 'change', data: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  listItem: () => ([]),
}))

const emit = defineEmits<Emit>()
</script>

<template>
  <div class="text-center">
    <VMenu>
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
          <VListItemTitle>
            <VueFeather
              :type="item?.icon"
              :size="18"
              class="mr-2"
              :class="[item.colorClass]"
              @click="item?.action?.event ? item?.action?.event() : ''"
            />
            {{ item.title }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>
