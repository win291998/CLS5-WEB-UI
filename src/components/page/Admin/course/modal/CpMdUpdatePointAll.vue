<script setup lang="ts">
import CmTextField from '@/components/common/CmTextField.vue'
import StringUtil from '@/utils/StringUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
})
const emit = defineEmits<Emit>()
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
interface Props {
  isShowModal: boolean
  qrCode?: any
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
}
const pointSetting = ref<null | number>(null)

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
async function onCancel() {
  emit('update:isShowModal', false)
}
async function onConfirm() {
  // emit('update:isShowModal', false)
}

// thay đổi điểm
function changePoint(event: any) {
  pointSetting.value = StringUtil.decimalToFixed(Number(event), 4)
  console.log(pointSetting.value)
}
</script>

<template>
  <div>
    <CmDialogs
      :title="t('update-point')"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      :is-dialog-visible="isShowModal"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <CmTextField
        v-model="pointSetting"
        type="number"
        :min="0"
        :max="100"
        is-null-number
        :maxlength="3"
        @change="changePoint(pointSetting)"
      />
    </CmDialogs>
  </div>
</template>

<style lang="scss">
.box-zoom{
  background-color: #fff;
  border-radius: 12px;
  .box-img-qr {
    width: 600px;
  }
}
</style>
