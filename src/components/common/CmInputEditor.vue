<script setup lang="ts">
import CmInputEditorMenu from './CmInputEditorMenu.vue'

interface Emit {
  (e: 'update:modelValue', value: any): void
}
interface Props {
  modelValue: any
  text?: any
  isDebounce?: boolean
}
const propsValue = withDefaults(defineProps<Props>(), ({
  modelValue: '',
  text: '',
  isDebounce: true,
}))
const emit = defineEmits<Emit>()
const inputEditor = ref()

/**
 * method
 */
// thay đổi dữ liệu data update
const handleChangeValue = window._.debounce((val: any) => {
  console.log(inputEditor.value.innerHTML)
  emit('update:modelValue', inputEditor.value.innerHTML)
}, propsValue?.isDebounce ? 500 : 0)

onMounted(() => {
  inputEditor.value.innerHTML = propsValue.modelValue
})
watch(() => propsValue.modelValue, (val: any) => {
  inputEditor.value.innerHTML = val
}, { deep: true })
</script>

<template>
  <div>
    <!--
      <div>
      <ToolBarEditor
      :is-show-input="isShowInput"
      :actived-tool="activedTool"
      :data-side-bar="dataSideBar"
      @handerStyleText="execCommand"
      @addItemToTemplateMail="addItemToTemplateMailText"
      />
      </div>
    -->
    <div
      v-if="propsValue.text"
      class="mb-1"
    >
      <label
        class="text-label-default"
      >{{ propsValue.text }}</label>
    </div>
    <div>
      <CmInputEditorMenu />
    </div>
    <div
      id="inputEditor"
      ref="inputEditor"
      contenteditable="true"
      class="input-math border box-textarea p-1"
      @input="handleChangeValue"
    />
    <!--
      :style="`textAlign:${textAlign}; color:${generalConfig.textColor};`"
      @input="handleChangeValue"
      @mousedown="mousedowns"
      @click="dblclickEditText"
    -->
  </div>
</template>

<style scoped>
  .input-math{
    padding: 10px;
    min-height: 200px;
    margin-top: -1px;
    border: 1px solid rgba(var(--v-border-color)) !important;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  .input-math:focus{
    outline: unset !important;
  }
</style>
