<script setup lang="ts">
import CmInputEditorMenu from './CmInputEditorMenu.vue'
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
    <div>
      <CmInputEditorMenu />
    </div>
    <div
      id="inputEditor"
      ref="inputEditor"
      contenteditable="true"
      class="input-math border box-textarea p-1"
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
  }
  .input-math:focus{
    outline: unset !important;
  }
</style>
