<script setup lang="ts">
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface Props {
  options?: any
  src?: string
  isSecure?: boolean
  serverCode?: string
}

const props = withDefaults(defineProps<Props>(), ({
}))
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const videoPlayer = ref()
const player = ref<any>(null)
const urlFile = ref<any>(props.serverCode ? `${SERVERFILE}/${props.serverCode}/preview?folderVideo=${props.src}` : `${SERVERFILE}/sfv4/preview?folderVideo=${props.src}`)

onMounted(() => {
  // player.value = videojs(videoPlayer.value)
  const videoElement = videoPlayer.value
  const options = {
    // Cấu hình Video.js tại đây
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
    },
  }
  player.value = videojs(videoElement, options, () => {
    if (props.isSecure) {
      console.log(options)
      const hls = player.value.tech(true)
      console.log(player.value)
      console.log(player.value.tech(true))
      console.log(hls)

      if (hls) {
        hls.xhr.beforeRequest = (optionsItem: any) => {
          console.log(optionsItem)

          const fileName = optionsItem.uri.replace(/^.*[\\\/]/, '')
          optionsItem.headers = optionsItem.headers || {}
          optionsItem.headers.Role = fileName
          optionsItem.headers.Accepts = props.src
          optionsItem.headers.Authorization = `Bearer ${window.localStorage.getItem('accessToken')}`

          console.log(window.localStorage.getItem('accessToken'))

          return options
        }
      }
    }
    else {
      player.value.play()
    }
  })
})
</script>

<template>
  <div class="w-100 h-100">
    <video
      id="my_video"
      ref="videoPlayer"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      data-setup="{}"
    >
      <source
        :src="isSecure === true ? urlFile : `${SERVERFILE}${src}`"
        type="application/x-mpegURL"
      >
    </video>
  </div>
</template>

<style lang="css" scoped>
.video-js {
  max-height: 600px;
  max-width: 100%;
  width: 100%;
}
</style>
