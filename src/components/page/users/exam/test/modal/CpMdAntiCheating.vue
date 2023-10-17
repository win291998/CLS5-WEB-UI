<script lang="ts" setup>
import CmDialogs from '@/components/common/CmDialogs.vue'
import { DialogType } from '@/constant/data/notification.json'
import { myExamManagerStore } from '@/stores/user/exam/exam'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  isConnected: true,
})

const emit = defineEmits<Emit>()

interface Props {
  isShowModal: boolean
  isConnected?: boolean
  isNotice?: boolean
  data: any
}
interface Emit {
  (e: 'update:isShowModal', data: boolean): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const route = useRoute()
const router = useRouter()
const myExamManagerManager = myExamManagerStore()
const { isSharingFullScreen } = storeToRefs(myExamManagerManager)
const { acceptAntiCheating } = myExamManagerManager
function cancelModal() {
  emit('update:isShowModal', false)
}
function checkTypeDialog(type: number) {
  return DialogType[type]
}

const interval = ref<any>(null)
const second = ref(20)
function autoSwitchTime() {
  if (!interval.value) {
    interval.value = setInterval(() => {
      second.value -= 1
      if (second.value < 0) {
        clearInterval(interval.value)
        interval.value = null
        cancelModal()
        router.push({ name: 'list-my-exam' })
      }
    }, 1000)
    return second.value
  }
  return second.value
}

function accept(idx: number, unload: any) {
  setTimeout(() => {
    unload(idx)
  }, 500)
  if (props.data?.isSuspended) {
    router.push({ name: 'list-my-exam' })
    return
  }
  if (props.isNotice) {
    acceptAntiCheating(true)
    return
  }
  if (!props.data?.isSuspended)
    acceptAntiCheating()
}
const type = ref(1)
watch(() => props.isShowModal, isShow => {
  if (isShow)
    type.value = props.data.isSuspended ? 2 : 1
})
</script>

<template>
  <CmDialogs
    :disabled-ok=" !isConnected && !data.isWarning"
    :is-div-space="false"
    :is-cancle="false"
    :is-dialog-visible="isShowModal"
    append-to-body
    :button-ok-name="t(data.isWarning || data.isSuspended ? 'ok-title' : 'i-accept')"
    justify="center"
    @confirm="accept"
    @cancel="cancelModal"
  >
    <template #title>
      <div class="d-flex justify-center mb-5 mt-4">
        <div class="icon-noti-lg text-center">
          <VIcon
            :icon="checkTypeDialog(type).icon"
            :color="checkTypeDialog(type).color"
            class="noti-zindex"
            :size="checkTypeDialog(type).size"
          />
          <span
            class="ring1"
            :class="[`ring1-type-${type}`]"
          />
          <span
            class="ring2"
            :class="[`ring2-type-${type}`]"
          />
        </div>
      </div>

      <div
        class="d-flex justify-center text-bold-xl  mt-6"
        :class="[data.isSuspended ? 'color-error' : 'color-warning']"
      >
        {{ t(data.isSuspended ? 'notification' : data.isWarning ? 'warning' : 'notice') }}
      </div>
    </template>
    <div
      v-if="data.isSuspended"
      class="px-4"
    >
      <p class="mb-25 mt-50 text-center">
        {{ $t('you-have-suspended') }}
      </p>
      <p
        v-if="Object.hasOwn(data, 'numberWarning') && Object.hasOwn(data, 'maximumViolation')"
        class="mb-25 mt-50 text-center"
      >
        <span>Số lần vi phạm: <span>{{ data.numberWarning }}</span>/<span>{{ data.maximumViolation }}</span></span>
      </p>
      <p
        class="mb-25 text-center"
      >
        <span>{{ t('auto-switch-to-list-exam') }}</span>
        <span class="time-down">{{ ` (${autoSwitchTime()}s)` }}</span>
      </p>
    </div>
    <div
      v-else-if="!data.isWarning"
      class="px-4 anti-cheating-modal"
    >
      <p class="caption text-medium-md color-text-900">
        {{ t('exam') }} {{ t('no-cheating-title') }}
      </p>
      <div class="ml-6 mb-4">
        <ul>
          <li v-if="data?.notPageSwitching">
            {{ t('no-change-tab-noti') }}
          </li>
          <li v-if="data?.isFullScreen">
            {{ t('no-escape-fullscreen-noti') }}
          </li>
        </ul>
      </div>
      <p v-if="data.maximumViolation">
        {{ t('maximun-violation') }}
        <span class="text-primary font-weight-bold">{{ data.maximumViolation }}</span>
        {{ t('violation-time') }}
      </p>
      <p>{{ t('number-violation') }} <span class="text-primary">{{ data.numberWarning }}</span> <span v-if="data.maximumViolation">/ {{ data.maximumViolation }}</span></p>
      <div
        v-if="data.notPageSwitching || data.isFullScreen"
        class="notify-hide-share-screen"
      >
        <p
          v-if="isSharingFullScreen"
          class="text-warning mb-50"
        >
          {{ t('please-hide-taskbar-share-screen') }}
        </p>
        <p class="text-warning mb-25">
          {{ t('you-doing-exam') }}
        </p>
        <ul class="pl-2 ml-25 mb-0">
          <li class="text-warning mb-25">
            {{ t('you-will-be-violation-warning') }}
          </li>
          <li class="text-warning mb-0">
            {{ t('you-will-be-violation-report') }}
          </li>
        </ul>
      </div>
    </div>
    <div
      v-else
      class="mt-2 px-4 anti-cheating-modal"
    >
      <div v-if="Object.keys(data).length">
        <p v-if="data.notPageSwitching && data.isFullScreen">
          {{ t('no-allow-violation') }}
        </p>
        <p v-else-if="data.notPageSwitching">
          {{ t('no-allow-violation-change-tab') }}
        </p>
        <p v-else-if="data.isFullScreen">
          {{ t('no-allow-violation-no-fullscreen') }}
        </p>
      </div>
      <p>{{ t('number-violation') }} <span class="text-primary">{{ data.numberWarning }}</span> <span v-if="data.maximumViolation">/ {{ data.maximumViolation }}</span></p>
      <p v-if="data.maximumViolation">
        {{ t('warning-maximum-violation') }}
      </p>
      <div
        v-if="data.notPageSwitching || data.isFullScreen"
        class="notify-hide-share-screen"
      >
        <p class="text-warning mb-50">
          {{ t('you-doing-exam') }}
        </p>
        <ul class="pl-2 ml-25 mb-0">
          <li class="text-warning mb-25">
            {{ t('you-will-be-violation-warning') }}
          </li>
          <li class="text-warning mb-0">
            {{ t('you-will-be-violation-report') }}
          </li>
        </ul>
      </div>
    </div>
  </CmDialogs>
</template>

<style lang="scss">
.text-title{
  color:  rgb(var(--v-gray-900));
}
.anti-cheating-modal {
  .notify-hide-share-screen {
    background-color:  rgb(var(--v-warning-50));
    padding: 2rem;
    border-radius: 6px;
  }
}
</style>
