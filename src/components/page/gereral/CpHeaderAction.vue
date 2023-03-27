<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import CmTextField from '@/components/common/CmTextField.vue'

/*
  isDelete: Hiện thị button delete
  disabledDelete:  Disable button delete
*/
interface Props {
  isDelete?: boolean
  disabledDelete?: boolean
  isBack?: boolean
  disabledBack?: boolean
  isApprove?: boolean
  disabledApprove?: boolean
  isFillter?: boolean
  disabledFillter?: boolean
}

const props = withDefaults(defineProps<Props>(), ({
  isDelete: false,
  disabledDelete: false,
  isBack: false,
  disabledBack: false,
  isApprove: false,
  disabledApprove: false,
  isFillter: false,
  disabledFillter: false,
}))

const emit = defineEmits<Emit>()

interface Emit {
  (e: 'click', type: string): void
}

const handleClickBtn = (type: string) => {
  emit('click', type)
}
</script>

<template>
  <VRow class="mb-3 d-flex justify-space-between">
    <VCol
      cols="12"
      md="3"
      sm="4"
    >
      <div>
        <CmButton
          v-if="isDelete"
          size="40"
          color="bg-error"
          class="mr-3"
          :disabled="disabledDelete"
          @click="handleClickBtn('delete')"
        >
          <VIcon
            icon="tabler:trash"
            color="#fff"
          />
        </CmButton>
        <CmButton
          v-if="isBack"
          :disabled="disabledBack"
          size="40"
          color="bg-error"
          class="mr-3"
          @click="handleClickBtn('back')"
        >
          <VIcon
            icon="tabler:corner-down-left"
            color="#fff"
          />
        </CmButton>
        <CmButton
          v-if="isApprove"
          :disabled="disabledApprove"
          size="40"
          color="bg-success"
          @click="handleClickBtn('approve')"
        >
          <VIcon
            icon="mdi-checkbox-marked-circle-outline"
            color="#fff"
          />
        </CmButton>
      </div>
    </VCol>
    <VSpacer />
    <VCol
      cols="12"
      md="7"
      sm="8"
    >
      <VRow>
        <VCol class="d-flex justify-end">
          <CmTextField
            label="Tìm kiếm"
            class="mr-3 header-action-field"
            prepend-inner-icon="tabler-search"
          />
          <CmButton
            v-if="isFillter"
            :disabled="disabledFillter"
            variant="outlined"
            bg-color="bg-white"
            color="color-dark-300"
            text-color="color-dark"
            @click="handleClickBtn('fillter')"
          >
            Ẩn lọc
          </CmButton>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
@use "@/styles/variables/common/input.cm" as *;

.header-action {
  &-field {
    inline-size: $input-min-width;
    max-inline-size: $input-min-width;

    // min-inline-size: $input-min-width;
  }
}
</style>
