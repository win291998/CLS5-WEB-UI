<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const items = route?.meta?.breadcrumb
</script>

<template>
  <div v-if="route.meta.breadcrumb && route.meta.breadcrumb.length">
    <VBreadcrumbs
      :items="items"
      class="breadcrumb"
    >
      <template #title="{ item }">
        <div>
          <VIcon
            v-if="item.icon"
            :icon="item.icon"
            :size="24"
            class="color-icon-default"
          />
          <span :to="item.to"> {{ item.title }}</span>
        </div>
      </template>
      <template #divider>
        <VIcon
          icon="mdi-chevron-right"
          size="16"
        />
      </template>
    </VBreadcrumbs>
  </div>
</template>

<style lang="scss">
@use "/src/styles/variables/global" as *;

.breadcrumb {
  padding-inline-start: 0 !important;

  .v-breadcrumbs-item--disabled {
    color: $color-primary-700;
    opacity: 1 !important;
  }
}
</style>
