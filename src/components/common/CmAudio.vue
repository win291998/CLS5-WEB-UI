<script setup lang="ts">
interface Props {
  src?: string
  fileFolder?: string
  serverCode?: any
  width?: number | string
}
const props = withDefaults(defineProps<Props>(), ({
  src: '',
  width: 50,
}))
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
</script>

<template>
  <div>
    <audio
      id="audio-controls"
      controls
      :src="SERVERFILE + src"
    />
  </div>
</template>
