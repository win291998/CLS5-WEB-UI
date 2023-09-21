<script lang="ts" setup>
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import SharedService from '@/api/shared'
import CmDropDown from '@/components/common/CmDropDown.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

interface Props {
  notify: Notify
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits<Emit>()
const { t } = window.i18n()
interface Notify {
  code?: string
  emailCanvas?: any
  emailTemplate?: string
  emailTemplateCusto?: string
  eventDbId?: number
  eventId?: number
  id?: number
  interval?: number | null
  isMailSending?: true
  isMobileNotification?: true
  isWebNotification?: true
  notificationTemplate?: string
  remind?: number | null
  time?: number | null
}
interface Emit {
  (e: 'update:notify', val: Notify): void
}
const dataNotify = ref<Notify>({})
watch(() => props.notify, (val: Notify) => {
  dataNotify.value = val
}, { immediate: true })

interface Keyword {
  code: string
  eventDbId: number
  eventId: number
  id: number
  name: string
  typeId: number
}

const keywords = ref<Keyword[]>([])
function getListKeyword({ eventId, type }: any) {
  MethodsUtil.requestApiCustom(SharedService.GetListKeywordNotify, TYPE_REQUEST.GET, { eventId, type }).then((res: Any) => {
    keywords.value = res.data
  })
}

function handleAddKey(code: string) {
  if (code) {
    const el = document.getElementById('content')?.getElementsByClassName('v-field__input')[0] as any
    const start = el.selectionStart
    const end = el.selectionEnd
    const content = el.value
    const before = content.substring(0, start)
    const after = content.substring(end, content.length)
    dataNotify.value.notificationTemplate = before + code + after
    el.selectionStart = start + code.length
    el.selectionEnd = start + code.length
    el.focus()
  }
}

defineExpose({
  getListKeyword,
})
</script>

<template>
  <VRow>
    <VCol cols="9">
      <div class="mt-6">
        <div class="text-medium-sm">
          Loại thông báo
        </div>
        <VRow class="mt-4">
          <VCol
            lg="3"
            cols="6"
          >
            <CmCheckBox
              v-model:model-value="dataNotify.isMailSending"
              label="Gửi email"
              @update:model-value="emit('update:notify', dataNotify)"
            />
          </VCol>
          <VCol
            lg="3"
            cols="6"
          >
            <CmCheckBox
              v-model:model-value="dataNotify.isWebNotification"
              label="Thông báo hệ thống"
              @update:model-value="emit('update:notify', dataNotify)"
            />
          </VCol>
          <VCol
            lg="3"
            cols="6"
          >
            <CmCheckBox
              v-model:model-value="dataNotify.isMobileNotification"
              label="Thông báo app mobile"
              @update:model-value="emit('update:notify', dataNotify)"
            />
          </VCol>
        </VRow>
      </div>
    </VCol>
    <VCol cols="3">
      <div class="d-flex align-center w-100 h-100">
        <CmButton
          variant="tonal"
          title="Mặc định"
        />
      </div>
    </VCol>
  </VRow>
  <div class="d-flex">
    <div class="w-75">
      <CmTextField
        id="content"
        v-model:model-value="dataNotify.notificationTemplate"
        text="Nội dung thông báo"
        @update:model-value="emit('update:notify', dataNotify)"
      />
    </div>
    <div
      class="w-25 d-flex align-end ml-2"
      style="height: inherit;"
    >
      <CmDropDown
        :title="t('add-key-word')"
        color="primary"
        custom-key="name"
        class="mb-1"
        variant="flat"
        :list-item="keywords"
        :type="2"
        icon="tabler:chevron-down"
        @click="handleAddKey($event.code)"
      />
    </div>
  </div>
</template>
