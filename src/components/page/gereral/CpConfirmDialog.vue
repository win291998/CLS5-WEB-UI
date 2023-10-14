<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import { DialogType } from '@/constant/data/notification.json'
import type { sizeDialog } from '@/typescript/enums/enums'

interface Props {
  keyModal?: string
  confirmationMsg: string
  confirmationMsgSubTitle?: string
  isDialogVisible: boolean
  type: number
  minWidth?: number
  maxWidth?: number
  icon?: string
  variant?: string
  color?: string
  className?: string
  buttonOkName?: string
  buttonCancleName?: string
  isHideFooter?: boolean
  persistent?: boolean // ngăn không cho tắt modal
  size?: typeof sizeDialog[] | string
  isOk?: boolean
  isCancle?: boolean
  appendToBody?: boolean

}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', value: boolean, key?: string): void
}

const props = withDefaults(defineProps<Props>(), ({
  type: 0,
  variant: 'outlined',
  buttonOkName: 'ok-title',
  buttonCancleName: 'cancel-title',
  isHideFooter: false,
  persistent: false,
  minWidth: 400,
  maxWidth: 400,
  size: 'sm',
  isOk: true,
  isCancle: true,
  appendToBody: false,
}))

const emit = defineEmits<Emit>()

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

const prefixColor = computed(() => {
  if (props.variant === 'outlined')
    return 'color'

  return 'btn'
})

function checkTypeDialog(type: number) {
  return DialogType[type]
}

function updateModelValue(val: boolean) {
  emit('update:isDialogVisible', val)
}

function onConfirmation() {
  emit('confirm', true, props?.keyModal)
  updateModelValue(false)
}

function onCancel() {
  // emit('confirm', false)
  emit('update:isDialogVisible', false)
}
const sizeModal = computed(() => {
  switch (props.size) {
    case 'sm':
      return 500
    case 'md':
      return 700
    case 'lg':
      return 800
    case 'xl':
      return 1162
    default:
      break
  }
})
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VDialog
    :width="sizeModal"
    :min-width="sizeModal"
    :max-width="sizeModal"
    :model-value="props.isDialogVisible"
    :persistent="persistent"
    :attach="appendToBody"
    @update:model-value="updateModelValue"
  >
    <VCard class=" pa-6">
      <VCardText class="text-center noti-content">
        <div class="d-flex justify-center mb-5">
          <div class="icon-noti-lg">
            <VIcon
              :icon="icon || checkTypeDialog(type).icon"
              :variant="variant"
              :class="[`${prefixColor}-${color || checkTypeDialog(type).color}`, className]"
              class="noti-zindex"
              :size="checkTypeDialog(type).size"
            />
            <span
              class="ring1"
              :class="[`ring1-type-${type}`]"
            />
            <span
              class="ring2"
              :class="[`ring2-type-${type}`]"
            />
          </div>
        </div>

        <div class="text-semibold-lg text-title-noti mb-2">
          <span v-html="props.confirmationMsg" />
        </div>
        <div class="text-regular-sm text-title-sub-noti">
          <div v-html="props.confirmationMsgSubTitle" />
          <div>
            <slot name="sub-title" />
          </div>
        </div>
      </VCardText>

      <VCardText>
        <slot />
      </VCardText>

      <VCardActions
        v-if="!isHideFooter"
        class="align-center justify-center gap-2 noti-content"
      >
        <CmButton
          v-if="isCancle"
          variant="outlined"
          bg-color="bg-white"
          color="dark"
          text-color="color-dark"
          class="w-50"
          @click="onCancel"
        >
          {{ t(buttonCancleName) }}
        </CmButton>

        <CmButton
          v-if="isOk"
          variant="elevated"
          class="w-50"
          :color="color || checkTypeDialog(type).color"
          @click="onConfirmation"
        >
          {{ t(buttonOkName) }}
        </CmButton>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
@use "@/styles/style-global.scss" as *;
.v-dialog {
  .v-card{
    border-radius: 12px !important;
  }
}
.text-title-noti {
  color: $color-gray-900;
}

.text-title-sub-noti {
  color: $color-gray-500;
}
</style>
