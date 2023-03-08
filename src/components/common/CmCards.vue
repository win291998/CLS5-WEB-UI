<script setup  lang="ts">
import type { infImageCard, infTimeLine } from '@/typescript/interface'
import { typeCardImage, typeCardImageEnum } from '@/typescript/enums/enums'

const props = withDefaults(defineProps<Props>(), {
  image: () => ({
    type: typeCardImageEnum.undefined,
    src: '',
  }),
  timeLine: () => ({
    title: '',
    isShow: true,
    msgTimeLine: [],
  }),
  isAction: true,
})

interface Props {
  timeLine?: infTimeLine
  image?: infImageCard
  title: string
  isAction?: boolean
}
</script>

<template>
  <VContainer>
    <VRow justify="space-around">
      <VCard width="400">
        <template
          v-if="props.image.type === typeCardImageEnum.full"
          #image
        >
          <VImg
            src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg"
            cover
            class="text-white"
          />
        </template>

        <VImg
          v-if="props.image.type === typeCardImageEnum.head"
          height="200"
          src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg"
          cover
          class="text-white"
        >
          <VToolbar
            color="rgba(0, 0, 0, 0)"
            theme="dark"
          >
            <template #prepend>
              <VBtn icon="$menu" />
            </template>

            <VToolbarTitle class="text-h6">
              Messages
            </VToolbarTitle>

            <template #append>
              <VBtn icon="mdi-dots-vertical" />
            </template>
          </VToolbar>
        </VImg>

        <VCardText>
          <div
            v-if="props.title"
            class="font-weight-bold ms-1 mb-2"
          >
            {{ props.title }}
          </div>
          <slot name="text" />
          <VTimeline
            v-if="props.timeLine.isShow"
            density="compact"
            align="start"
          >
            <VTimelineItem
              v-for="message in props.timeLine.msgTimeLine"
              :key="message.time"
              :dot-color="message.color"
              size="x-small"
            >
              <div class="mb-4">
                <div class="font-weight-normal">
                  <strong>{{ message.from }}</strong> @{{ message.time }}
                </div>
                <div>{{ message.message }}</div>
              </div>
            </VTimelineItem>
          </VTimeline>
        </VCardText>
        <slot />

        <template
          v-if="props.isAction"
          #actions
        >
          <slot name="action">
            <VBtn variant="outlined">
              Button
            </VBtn>
          </slot>
        </template>
      </VCard>
    </VRow>
  </VContainer>
</template>

