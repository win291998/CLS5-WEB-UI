<script setup lang="ts">
import 'katex/dist/katex.min.css'
import katex from 'katex'
import CmPickColor from './CmPickColor.vue'

interface Emit {
  (e: 'change', key: any, value?: any): void
  (e: 'changeAlign', key: any, value?: any): void
  (e: 'order', type: any, value?: any): void
  (e: 'changeColor', key: any, option: any, value?: any): void
}

const props = withDefaults(defineProps<Props>(), ({
  statusMenu: () => ({
    bold: false,
    underline: false,
    italic: false,
    left: false,
    center: false,
    right: false,
    justify: false,
    insertOrderedList: false,
    insertUnorderedList: false,
  }),
}))

const emit = defineEmits<Emit>()

interface Props {
  statusMenu?: any
}

const activeMenu = ref<any>(props.statusMenu)
function insertA() {
  const htmlString = katex.renderToString('c = \\pm\\sqrt{a^2 + b^2}', {
    throwOnError: false,
  })
  document.execCommand('insertHTML', false, htmlString)
}

function styleFontText(key: any, value?: any) {
  activeMenu.value[key] = !activeMenu.value[key as never]
  emit('change', key, value)
}
function styleAsignText(key: any, value?: any) {
  activeMenu.value = {
    ...{
      left: false,
      center: false,
      right: false,
      justify: false,
    },
  }
  activeMenu.value[value] = !activeMenu.value[value as never]
  emit('changeAlign', key)
}
function orderList(key: any) {
  activeMenu.value = {
    ...{
      insertOrderedList: key === 'insertOrderedList' ? !activeMenu.value[key] : false,
      insertUnorderedList: key === 'insertUnorderedList' ? !activeMenu.value[key] : false,
    },
  }

  emit('order', key)
}
function changeColor(key: any, option: any, value: any) {
  emit('changeColor', key, option, value)
}
watch(() => props.statusMenu, (val: any) => {
  activeMenu.value = val
}, { deep: true })
</script>

<template>
  <div class="menu-box">
    <div class="menu-list">
      <button
        class="menu-item"
        :class="{ actived: activeMenu.bold }"
        @click="styleFontText('bold', 'strong')"
      >
        <b>B</b>
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.underline }"
        @click="styleFontText('underline', 'u')"
      >
        <u><b>U</b></u>
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.italic }"
        @click="styleFontText('italic', 'em')"
      >
        <i><b>I</b></i>
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.strikeThrough }"
        @click="styleFontText('strikeThrough', 'strike')"
      >
        <del>S</del>
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.left }"
        @click="styleAsignText('justifyLeft', 'left')"
      >
        <VIcon icon="tabler:align-left" />
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.center }"
        @click="styleAsignText('justifyCenter', 'center')"
      >
        <VIcon icon="tabler:align-center" />
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.right }"
        @click="styleAsignText('justifyRight', 'right')"
      >
        <VIcon icon="tabler:align-right" />
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.justify }"
        @click="styleAsignText('justifyFull', 'justify')"
      >
        <VIcon icon="tabler:align-justified" />
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.insertOrderedList }"
        @click="orderList('insertOrderedList')"
      >
        <VIcon icon="octicon:list-ordered-24" />
      </button>
      <button
        class="menu-item"
        :class="{ actived: activeMenu.insertUnorderedList }"
        @click="orderList('insertUnorderedList')"
      >
        <VIcon icon="material-symbols:list" />
      </button>
      <button
        class="menu-item"
      >
        <CmPickColor
          is-hide-input-color
          @change="changeColor"
        />
      </button>
      <button
        class="menu-item"
        @click="changeColor('foreColor', null, '#000')"
      >
        <VIcon icon="ic:baseline-invert-colors-off" />
      </button>
      <button
        class="menu-item"
      >
        <CmPickColor
          :type="1"
          is-hide-input-color
          @change="changeColor"
        />
      </button>
      <button
        class="menu-item"
        @click="changeColor('backColor', null, '#fff')"
      >
        <VIcon icon="cil:color-fill" />
      </button>
      <button
        class="menu-item"
        @click="insertA"
      >
        <VIcon icon="tabler:link" />
      </button>
      <button
        class="menu-item"
        @click="insertA"
      >
        <span>Math</span>
      </button>
      <div class="menu-item">
        <span>a</span>
      </div>
      <div class="mark" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-box{
  border: 1px solid rgba(var(--v-border-color));
  background-color:  rgb(var(--v-theme-surface));
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 5px;
  .menu-list{
    display: flex;
    .menu-item{
      width: fit-content;
      padding: 5px;
      min-width: 30px;
      text-align: center;
    }
    .menu-item.actived {
      color:  rgb(var(--v-primary-600)) !important;
    }
    .mask{
      border-left: 1px solid #a3a3a3;
    }
  }

}
</style>
