<script setup lang="ts">
interface Props {
  title?: string
  subTitle?: string
  isDialogVisible: boolean
  type: number
  icon?: string
  variant?: string
  color?: string
  className?: string
  buttonOkName?: string
  buttonCancleName?: string
  isHideFooter?: boolean
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  buttonOkName: 'common.ok-title',
  buttonCancleName: 'common.cancel-title',
  isHideFooter: false,
}))

const emit = defineEmits<Emit>()
const CmCard = defineAsyncComponent(() => import('@/components/common/CmCard.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
}

const onCancel = () => {
  emit('confirm', false)
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <VRow
    justify="center"
    class="dialog-common"
  >
    <VDialog
      :model-value="props.isDialogVisible"
      width="800"
      @update:model-value="updateModelValue"
    >
      <CmCard backgroud="bg-white">
        <template #title>
          <VCardTitle>
            {{ title }}
            <slot name="title" />
          </VCardTitle>

          <VCardSubtitle>
            {{ subTitle }}
            <slot name="sub-title" />
          </VCardSubtitle>
        </template>

        <template #text>
          <slot name="content" />
        </template>
        <VDivider class="mb-1" />
        <template #actions>
          <div class="d-flex justify-end my-3 w-100">
            <CmButton
              variant="outlined"
              bg-color="bg-white"
              color="dark"
              text-color="color-dark"
              @click="onCancel"
            >
              {{ t(buttonCancleName) }}
            </CmButton>

            <CmButton
              variant="elevated"
              :color="color "
              @click="onConfirmation"
            >
              {{ t(buttonOkName) }}
            </CmButton>
          </div>
        </template>
      </CmCard>
    </VDialog>
  </VRow>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;

.v-card-actions {
  padding-block: 12px;
  padding-inline: 24px;
}

.v-card-item {
  border-block-end: 1px solid $color-line-default;
}
</style>
