<script setup lang="ts">
withDefaults(defineProps<Props>(), ({
  totalPage: 1,
  currentPage: 1,
}))

const emit = defineEmits<Emit>()

// interface
interface Props {
  totalPage: number
  currentPage: number
}
interface Emit {
  (e: 'setToPage', data: string | number): void
  (e: 'zoomOut'): void
  (e: 'zoomIn'): void
}

/**
 * lib
 */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

function enterNumber(e: any) {
  e.target.blur()
}
function changeValue(e: any) {
  emit('setToPage', Number.parseInt(e.target.value))
}
</script>

<template>
  <div class="document-control-pdf d-flex align-self-center">
    <VIcon
      :title="t('back-to-first-page')"
      class="icon"
      icon="tabler:square-rounded-chevrons-left-filled"
      @click="$emit('setToPage', 'first')"
    />
    <VIcon
      :title="t('back-to-previous-page')"
      class="icon"
      icon="tabler:square-rounded-chevron-left-filled"
      @click="$emit('setToPage', 'previous')"
    />
    <input
      :value="currentPage"
      type="number"
      class="current-page-number"
      @keyup.enter="enterNumber"
      @change="changeValue"
    >
    <span class="ml-1">/</span>
    <span class="ml-1">{{ totalPage }}</span>
    <VIcon
      :title="t('go-to-next-page')"
      class="icon"
      icon="tabler:square-rounded-chevron-right-filled"
      @click="$emit('setToPage', 'next')"
    />
    <VIcon
      :title="t('go-to-last-page')"
      class="icon"
      icon="tabler:square-rounded-chevrons-right-filled"
      @click="$emit('setToPage', 'last')"
    />
    <!-- tabler:zoom-out-filled _ solar:minimalistic-magnifer-zoom-out-bold -->
    <VIcon
      :title="t('Thu nhỏ')"
      class="icon"
      icon="solar:rounded-magnifer-zoom-out-bold"
      @click="$emit('zoomOut')"
    />
    <!-- tabler:zoom-in-filled _ solar:rounded-magnifer-zoom-in-bold -->
    <VIcon
      :title="t('Phóng to')"
      class="icon"
      icon="solar:minimalistic-magnifer-zoom-in-bold"
      @click="$emit('zoomIn')"
    />
  </div>
</template>

<style lang="scss" scoped>
.document-control-pdf {
  position: fixed;
  z-index: 1;
  bottom: 1.5rem;
  left: 50%;
  width: auto;
  height: 38px;
  align-items: center;
  padding: 0 10px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 65%);
  color: white;
  transform: translateX(-50%);

  .icon {
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }

  .current-page-number {
    width: 48px;
    height: 30px;
    box-sizing: border-box;
    padding-right: 3px;
    padding-left: 3px;
    border: 1px solid #D6D8DE;
    border-radius: 6px;
    background: rgba(#6e6e6e, .75);
    color: #fff;
    text-align: center;
  }
}
</style>
