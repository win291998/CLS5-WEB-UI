<script setup lang="ts">
import GlobalUtil from '@/utils/Global'

interface Props {
  data: dataAccodion[]
  customKey?: string
  classNameLabel?: Array<any>
  isOpen?: boolean
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
  data: () => ([{
    label: 'Title',
    content: 'Content',
  }]),
  customKey: 'content',
  classNameLabel: () => ([]),
  isOpen: false,
}))

const emit = defineEmits<Emit>()

const checkAllValue = () =>
  props.data.map(item => item.value)

const panel = props.isOpen ? ref(checkAllValue()) : ref([])
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
        v-for="(item, index) in data"
        :key="index"
        :value="item.value || item.label"
      >
        <template #title>
          <div>
            <VAvatar
              size="32"
              class="mr-2"
              :class="[item.colorClass]"
              variant="tonal"
            >
              <VIcon
                v-if="item.icon"
                :icon="item.icon"
                size="14"
                :class="[item.colorClass]"
              />
            </VAvatar>
          </div>
          <span
            :class="[props.classNameLabel[0]]"
            class="text-regular-sm"
          >{{ item.label }}</span>
          <slot
            class="text-regular-sm"
            name="title"
          />
        </template>
        <template #text>
          <div
            v-if="GlobalUtil.checkTypeContent(item.content) === 'array'"
          >
            <div
              v-for="(listItem, idItem) in item.content"
              :key="idItem"
              class="mb-2"
            >
              <div
                v-if="listItem?.icon"
                class="icon-item"
              >
                <VIcon
                  :icon="listItem?.icon"
                  size="14"
                  :class="[item?.colorClass]"
                />
              </div>
              <div
                v-if="listItem[customKey]"
                class="content-item text-regular-sm"
                :class="[props.classNameLabel[1]]"
              >
                {{ listItem[customKey] }}
              </div>
            </div>
          </div>
          <div
            v-else
            class="text-regular-sm mb-2"
          >
            {{ item?.content }}
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
