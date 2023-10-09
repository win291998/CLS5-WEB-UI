<script setup lang="ts">
import CmChip from '@/components/common/CmChip.vue'
import CmAudio from '@/components/common/CmAudio.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmVideoUpload from '@/components/common/CmVideoUpload.vue'
import { myExamManagerStore } from '@/stores/user/exam/exam'
import DateUtil from '@/utils/DateUtil'
import { Themes } from '@/typescript/class/Theme'
import CmAvatar from '@/components/common/CmAvatar.vue'
import { avatar } from '@/constant/Globals'

const props = withDefaults(defineProps<Props>(), ({
  isProgress: false,
}))

const emit = defineEmits<Emit>()
interface Props {
  isProgress?: boolean
}

/** ** Interface */
interface Emit {
  (e: 'startExam'): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const route = useRoute()
const SERVERFILE = process.env.VUE_APP_BASE_SERVER_FILE
const myExamManagerManager = myExamManagerStore()
const { examData, timeServer, totalQuestion, cameraRef, isSharingCamera, isSharingFullScreen } = storeToRefs(myExamManagerManager)
const { grantPermissionsCamera, grantSharingScreenPermission } = myExamManagerManager
const urlFile = ref('')

const time = ref(0)
const totalTime = ref()
const isStart = ref(false)
const prettyTime = computed(() => {
  const thour: number = time.value / 3600
  const hours = parseInt(`${thour}`, 10)

  const tminute = (time.value - hours * 3600) / 60
  const minutes = parseInt(`${tminute}`, 10)
  const secondes = time.value - hours * 3600 - minutes * 60
  return `${hours > 9 ? hours : `0${hours}`}:${
    minutes > 9 ? minutes : `0${minutes}`
  }:${secondes > 9 ? secondes : `0${secondes}`}`
})

// thiết lập data
function initData() {
  const startTime: any = new Date(examData.value.startTime)
  const currentTime: any = timeServer.value ? new Date(timeServer.value) : new Date()
  const duration = Math.floor((startTime - currentTime) / 1000)

  if (duration > 0) {
    totalTime.value = duration
    time.value = duration
    startTimer()
  }
  else {
    isStart.value = true
  }
}

// đếm thời gian bắt đầu làm bài
function startTimer() {
  let timer: any = null
  if (!timer) {
    timer = setInterval(() => {
      if (time.value > 0) {
        time.value -= 1
      }
      else {
        clearInterval(timer)
        isStart.value = true
      }
    }, 1000)
  }
}
function startExam() {
  emit('startExam')
}
function openPermissionsCamera(idx: number, unload: any) {
  grantPermissionsCamera()
  setTimeout(() => {
    unload(idx)
  }, 1000)
}
function openPermissionsScreen(idx: number, unload: any) {
  grantSharingScreenPermission()
  setTimeout(() => {
    unload(idx)
  }, 1000)
}

const video = ref()
onMounted(() => {
  initData()
  cameraRef.value = video.value
})
</script>

<template>
  <div class="my-intro">
    <div class="my-title">
      <div class="flex-center">
        <CmChip
          color="success"
          class="mb-2"
        >
          <div class="text-medium-md color-success">
            {{ prettyTime }}
          </div>
        </CmChip>
      </div>
      <div class="flex-center text-bold-lg">
        {{ examData.examName }}
      </div>
      <div class="flex-center text-semibold-md">
        {{ examData.testName }}
      </div>
    </div>
    <div class="mi">
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          {{ t('total-questions') }}
        </div>
        <div class="mi-item-content text-bold-lg color-primary">
          {{ totalQuestion }} {{ t('question') }}
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          Thời gian làm bài
        </div>
        <div class="mi-item-content text-bold-lg color-primary">
          {{ examData.minuteOfWork }} {{ t('minute').toLowerCase() }}
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          {{ t('require-point') }}
        </div>
        <div class="mi-item-content text-bold-lg color-primary">
          {{ examData.archivePoint }} {{ t('point').toLowerCase() }}
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          {{ t('start-time') }}
        </div>
        <div class="mi-item-content text-bold-lg color-primary">
          {{ DateUtil.formatTimeToHHmm(examData.startTime) }} {{ DateUtil.formatDateToDDMM(examData.startTime) }}
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          {{ t('end-time') }}
        </div>
        <div class="mi-item-content text-bold-lg color-primary">
          {{ DateUtil.formatTimeToHHmm(examData.endTime) }} {{ DateUtil.formatDateToDDMM(examData.endTime) }}
        </div>
      </div>
      <div class="mi-item">
        <div class="mi-item-label text-medium-sm mb-2">
          {{ t('number-test-again') }}
        </div>
        <div class="mi-item-content text-bold-lg color-primary">
          {{ examData.numberOfRetake }}  {{ t('turns').toLowerCase() }}
        </div>
      </div>
    </div>
    <div class="desc mt-8">
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <div class="text-semibold-lg color-text-900">
            {{ t('exam-regulations') }}
          </div>
          <div class="mt-4 desc-text">
            {{ examData.description }}
          </div>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <div class="text-semibold-lg color-text-900">
            {{ t('check-audios') }}
          </div>
          <div class="mt-4">
            <CmAudio
              src="/testDevice/testAudio.mp3"
              width="70%"
            />
          </div>
        </VCol>
      </VRow>
    </div>
    <div class="desc mt-8">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <div class="text-semibold-lg color-text-900">
            Kiểm tra video
          </div>
          <div class="mt-4 screen-16-9">
            <CmVideoUpload
              v-model="Themes.imageSystem.examVideo"
              :disabled="true"
              is-size-full
              :is-rounded="true"
            />
          </div>
          <div class="mt-4">
            <CmButton
              v-if="!isSharingFullScreen"
              title="Cấp quyền chia sẻ màn hình"
              variant="tonal"
              color="primary"
              is-load
              class="mr-2"
              @click="openPermissionsScreen"
            />
            <CmButton
              v-if="isSharingFullScreen"
              title="Đã chia sẻ màn hình"
              variant="tonal"
              icon="prime-check-circle"
              color="success-700"
              :size-icon="20"
              is-load
            />
            <CmButton
              v-if="isSharingFullScreen === false"
              title="Không chia sẻ màn hình"
              variant="tonal"
              icon="tabler:circle-x"
              color="error"
              :size-icon="20"
              is-load
            />
          </div>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <div class="text-semibold-lg color-text-900">
            Kiểm tra camera
          </div>
          <div class="mt-4 screen-16-9">
            <video
              ref="video"
              :hidden="isSharingCamera !== true"
              class="video-content w-100 h-100"
            />
            <CmAvatar
              v-show="!isSharingCamera"
              color="secondary"
              :is-classic-border="true"
              :is-text="!isSharingCamera"
              :text="t('no-device')"
              rounded
              :size="avatar.size"
              class="cm-video-input w-100 h-100"
            />
          </div>
          <div class="mt-4">
            <CmButton
              v-if="!isSharingCamera"
              title="Cấp quyền chia sẻ camera"
              variant="tonal"
              color="primary"
              is-load
              class="mr-2"
              @click="openPermissionsCamera"
            />
            <CmButton
              v-if="isSharingCamera"
              title="Đã chia sẻ camera"
              variant="tonal"
              icon="prime-check-circle"
              color="success-700"
              :size-icon="20"
              is-load
            />
            <CmButton
              v-if="isSharingCamera === false"
              title="Không chia sẻ camera"
              variant="tonal"
              icon="tabler:circle-x"
              color="error"
              :size-icon="20"
              is-load
            />
          </div>
        </VCol>
      </VRow>
    </div>
    <div class="flex-center mt-8">
      <CmButton
        :disabled="!isProgress"
        :title="!isProgress ? 'Đang tạo đề' : 'Bắt đầu làm bài'"
        :color="!isProgress ? 'warning' : 'primary'"
        is-load
        @click="startExam"
      />
    </div>
    <div
      v-if="!isProgress"
      class="color-warning flex-center text-medium-sm mt-1"
    >
      Vui lòng chờ trong ít phút
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables/global" as *;
.my-intro{
  .video-content{
    object-fit: cover;
    border: 4px solid $color-white;
    box-shadow: $box-shadow-lg;
    border-radius: 8px;
  }
  .mi{
    display: flex;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    .mi-item{
      width: 100%;
      padding: 1rem;
      background-color:  rgb(var(--v-primary-50));
      border-radius: 8px;
      margin-bottom: 1rem;
      text-wrap: nowrap;
    }
    .mi-item:not(:last-child){
      margin-right: unset;
    }
  }
  .desc{
    .desc-text{
      text-align: justify;
    }
    .screen-16-9{
      width: 100%;
      max-width: 30rem;
      height: 16rem;
    }
  }
}
@media (min-width: 376px) {
  .my-intro{
    .mi{
      .mi-item{
        width: calc(( 100% - 1.5rem * 1 ) / 2 );
      }
      .mi-item:not(:last-child):nth-of-type(odd){
        margin-right: 1.5rem;
      }
    }
  }
}
@media (min-width: 576px) {
  .my-intro{
    .desc{
      .screen-16-9{
        width: 80%;
        max-width: 30rem;
        height: 16rem;
      }
    }
  }
}
@media (min-width: 767px) {
  .my-intro{
    .mi{
      display: flex;
      justify-content: center;
      .mi-item{
        width: auto;
        min-width: calc(( 100% - 1.5rem * 5 ) / 6);
      }
      .mi-item:not(:last-child){
        margin-right: 1.5rem;
      }
      .mi-item:not(:last-child):nth-of-type(even){
        margin-right: 1.5rem;
      }
    }
  }
}
</style>
