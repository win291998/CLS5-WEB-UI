<script lang="ts" setup>

</script>

<template>
  <CmDialogs
    :is-dialog-visible="props.isShow"
    :title="title"
    size="xl"
    @cancel="hidden"
    @confirm="confirm"
  />
</template>

<style lang="scss">

</style>
