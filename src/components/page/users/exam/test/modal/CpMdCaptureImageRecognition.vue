<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import { myExamManagerStore } from '@/stores/user/exam/exam'
import CmButton from '@/components/common/CmButton.vue'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  isConnected: true,
})

const emit = defineEmits<Emit>()

interface Props {
  isShowModal: boolean
}
interface Emit {
  (e: 'update:isShowModal', data: boolean): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const myExamManagerManager = myExamManagerStore()

// const { } = storeToRefs(myExamManagerManager)
const { submitIdentified, hideModalCapture } = myExamManagerManager

const streaming = ref(false)
const video = ref()
const canvas = ref()
const photo = ref()
const width = ref(320) // We will scale the photo width to this
const height = ref(460)
const isCaptured = ref(false)
const imgDataBlob = ref<any>(null)
const isHandling = ref(false)
const wrapper = ref()
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE

function cancelModal() {
  emit('update:isShowModal', false)

  hideModalCapture()
  isHandling.value = false
}
function open() {
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        video.value.srcObject = stream
        video.value.play()
      })

    video.value.addEventListener(
      'canplay',
      (ev: any) => {
        if (!streaming.value) {
          const factor = video.value.videoWidth / video.value.videoHeight // tỷ lệ khung hình
          const widthClient = document.body.clientWidth > 500
            ? 500
            : document.body.clientWidth
          wrapper.value.style.height = `${widthClient / factor}px`
          streaming.value = true
        }
      },
      false,
    )
  }

  clearphoto()
}

// xóa ảnh
function clearphoto() {
  const context = canvas.value.getContext('2d')
  context.fillStyle = '#AAA'
  context.fillRect(0, 0, canvas.value.width, canvas.value.height)

  const data = canvas.value.toDataURL('image/png')
  photo.value.setAttribute('src', data)
  isCaptured.value = false
}

// chụp ảnh
function takepicture() {
  const context = canvas.value.getContext('2d')
  if (width.value && height.value) {
    canvas.value.width = video.value.offsetWidth

    canvas.value.height = (video.value.offsetWidth * 3) / 4
    canvas.value.getContext('2d', { alpha: false, desynchronized: true, willReadFrequently: true }).drawImage(video.value, 0, 0)
    context.drawImage(
      video.value,
      0,
      0,
      video.value.offsetWidth,
      canvas.value.height,
    )

    canvas.value.toBlob(async (blob: any) => {
      // lấy đuôi file
      const typeImage = blob.type.split('/')
      blob.name = `screenshot ${new Date().getTime()}.${typeImage[1]}`
      const file = new File([blob], blob.name, {
        type: blob.type,
      })
      imgDataBlob.value = {
        files: file,
        isSecure: false,
      }
    }, 'image/jpeg', 1)
    const data = canvas.value.toDataURL('image/png')
    photo.value.setAttribute('src', data)
    isCaptured.value = true
  }
  else {
    // clearphoto()
  }
}

function accept(idx: number, unload: any) {
  setTimeout(() => {
    unload(idx)
  }, 500)
}

// gửi ảnh
async function sendImage() {
  isHandling.value = true

  await MethodsUtil.uploadFile(imgDataBlob.value).then(value => {
    if (value?.fileOrigin) {
      if (value && value?.fileOrigin) {
        submitIdentified(value?.fileOrigin)

        emit('update:isShowModal', false)
      }
      else {
        clearphoto()
        toast('WARNING', t('image-not-save'))
      }
      isHandling.value = false
    }
  })
}
onMounted(() => {
  watch(() => props.isShowModal, isShow => {
    if (isShow) {
      watch(video, val => {
        if (val)
          open()
      })
    }
  }, { immediate: true })
})
</script>

<template>
  <CmDialogs
    size="sm"
    :is-div-space="false"
    :is-cancle="false"
    :is-ok="false"
    :is-dialog-visible="isShowModal"
    append-to-body
    justify="center"
    class="capture"
    @confirm="accept"
    @cancel="cancelModal"
  >
    <div class="d-flex">
      <div class="ml-5 d-flex justify-center text-bold-lg">
        {{ t("required-image-recognition") }}
      </div>
    </div>
    <div
      ref="wrapper"
      class="capture-wrapper"
    >
      <div class="image-content">
        <video
          v-show="!isCaptured"
          ref="video"
          class="video-content"
        >
          Video stream not available.
        </video>
        <div class="image-output">
          <img
            v-show="isCaptured"
            ref="photo"
            alt="The screen capture will appear in this box."
          >
        </div>
        <canvas
          ref="canvas"
          class="canvas-content"
        />
      </div>
    </div>
    <template #actions>
      <div class="flex-center">
        <CmButton
          v-if="isCaptured"
          variant="outlined"
          color="secondary"
          icon="tabler:refresh-alert"
          :size-icon="24"
          :tooltip="t('re-capture')"
          @click="clearphoto"
        />
        <CmButton
          v-if="!isCaptured"
          variant="elevated"
          color="primary"
          is-load
          icon="tabler:capture"
          :size-icon="24"
          :tooltip="t('capture')"
          @click="takepicture"
        />
        <CmButton
          v-if="isCaptured"
          variant="elevated"
          color="success"
          is-load
          icon="tabler:send"
          :tooltip="t('send-image')"
          :size-icon="24"
          @click="sendImage"
        />
      </div>
    </template>
  </CmDialogs>
</template>

<style lang="scss">
.capture-modal {
  .modal-body {
    padding: 0;
  }
}
.capture-wrapper {
  position: relative;
  width: 500px;
  height: 468px;
  max-width: 100%;
  border-radius: 8px;
  .btn-close {
    border: 0px;
    font-size: 2rem;
    font-weight: 400;
    line-height: 1;
    color: #5e5873;
    position: absolute;
    top: 0px;
    right: 0;
    padding: 0.2rem 0.62rem;
    background-color: #fff;
    box-shadow: 0 5px 20px 0 rgb(34 41 47 / 10%);
    border-radius: 0.357rem;
    transform: translate(25%, -25%);
    opacity: 1;
    &:focus {
      outline: 0px;
    }
  }
  .capture-recognition {
    padding: 10%;
    height: 100%;
    position: relative;
    .inner {
      width: 100%;
      height: 100%;
      .inner-top-left {
        position: absolute;
        top: 10%;
        left: 10%;
        width: 22px;
        height: 22px;
        border-top: 2px solid var(--customPrimary);
        border-left: 2px solid var(--customPrimary);
      }
      .inner-top-right {
        position: absolute;
        top: 10%;
        right: 10%;
        width: 22px;
        height: 22px;
        border-top: 2px solid var(--customPrimary);
        border-right: 2px solid var(--customPrimary);
      }
      .inner-bottom-left {
        position: absolute;
        bottom: 10%;
        left: 10%;
        width: 22px;
        height: 22px;
        border-bottom: 2px solid var(--customPrimary);
        border-left: 2px solid var(--customPrimary);
      }
      .inner-bottom-right {
        position: absolute;
        bottom: 10%;
        right: 10%;
        width: 22px;
        height: 22px;
        border-bottom: 2px solid var(--customPrimary);
        border-right: 2px solid var(--customPrimary);
      }
      .camera-capture {
        width: 42px;
        height: 42px;
        background: rgba(30, 30, 30, 0.12);
        border-radius: 50%;
        position: absolute;
        bottom: 31px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          width: 22px;
          height: 22px;
        }
      }
      .description {
        color: #fff;
        position: absolute;
        bottom: -40px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        transform: translateX(-10%);
      }
    }
    .action {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 10px;
      width: 100%;
      right: 0;
    }
  }
  .image-content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0%;
    border-radius: 6px;
    overflow: hidden;
    .video-content {
      width: 100%;
      height: 100%;
    }
    .image-output {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .canvas-content {
      display: none;
    }
  }
  .mask {
    position: absolute;
    background: rgba(30, 30, 30, 0.12);
    &.top {
      top: 0;
      width: 100%;
      height: 15%;
    }
    &.right {
      right: 0;
      top: 15%;
      width: 15%;
      height: 70%;
    }
    &.bottom {
      bottom: 0;
      width: 100%;
      height: 15%;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      background: linear-gradient(
        180deg,
        rgba(30, 30, 30, 0.12) 0%,
        rgba(0, 0, 0, 0.85) 100%
      );
    }
    &.left {
      left: 0;
      top: 15%;
      width: 15%;
      height: 70%;
    }
  }
}
@media (max-width: 375px) {
  .capture-wrapper {
    .action {
      flex-direction: column;
      .btn-left {
        margin-right: 0px !important;
      }
      .btn {
        margin-top: 10px;
      }
    }
  }
}
.capture .v-card-text{
overflow-y: unset !important;
}
</style>
