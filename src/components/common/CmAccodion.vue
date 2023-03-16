<script setup lang="ts">
import GlobalUtil from '@/utils/Global'

interface Props {
  data: dataAccodion
}
interface dataAccodion {
  label: string
  icon?: string
  colorClass?: string
  value?: string
  content: any
}
interface Emit {
  (e: 'change', data: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    label: 'Title',
    content: 'Content',
  }),
}))

const emit = defineEmits<Emit>()
const panel = ref([])

console.log(window._.isArray({}))
</script>

<template>
  <div>
    <!--
      <div class="text-center d-flex pb-4">
      <VBtn
      class="ma-2"
      @click="all"
      >
      All
      </VBtn>
      <VBtn
      class="ma-2"
      @click="none"
      >
      None
      </VBtn>
      </div>

      <div class="pb-4">
      v-model {{ panel }}
      </div>
    -->

    <VExpansionPanels
      v-model="panel"
      class="no-background"
      multiple
    >
      <VExpansionPanel
        :value="props.data?.value || props.data?.label"
      >
        <template #title>
          <div>
            <VAvatar
              size="32"
              class="mr-2"
              :class="[props.data?.colorClass]"
              variant="tonal"
            >
              <VueFeather
                :type="props.data?.icon"
                size="14"
                :class="[props.data?.colorClass]"
              />
            </VAvatar>
          </div>
          <span class="text-regular-sm">{{ props.data?.label }}</span>
          <slot
            class="text-regular-sm"
            name="title"
          />
        </template>
        <template #text>
          <div
            v-if="GlobalUtil.checkTypeContent(props.data.content) === 'array'"
          >
            <div
              v-for="(listItem, idItem) in props.data.content"
              :key="idItem"
              class="mb-2"
            >
              <div
                v-if="listItem?.icon"
                class="icon-item"
              >
                <VueFeather
                  :type="listItem?.icon"
                  size="14"
                  :class="[props.data?.colorClass]"
                />
              </div>
              <div
                v-if="listItem.content"
                class="content-item text-regular-sm"
              >
                {{ listItem.content }}
              </div>
            </div>
          </div>
          <div
            v-else
            class="text-regular-sm mb-2"
          >
            {{ props.data?.content }}
          </div>
          <slot
            name="text"
            class="text-regular-sm"
          />
        </template>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.v-expansion-panel {
  background-color: unset !important;
}

.v-expansion-panel__shadow {
  box-shadow: unset !important;
}

.v-expansion-panel:not(:first-child)::after {
  border-block-start-style: unset !important;
}

.v-expansion-panel-text__wrapper {
  padding-inline: 40px 16px !important;
}
</style>
