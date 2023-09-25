<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import { typeDialog } from '@/constant/Globals'
import { courseManagerStore } from '@/stores/admin/course/course'
import CmSelect from '@/components/common/CmSelect.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import ExamService from '@/api/exam'
import CmCheckBox from '@/components/common/CmCheckBox.vue'

const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  excludeIds: [],
})

const emit = defineEmits<Emit>()

const CmIconNoti = defineAsyncComponent(() => import('@/components/common/CmIconNoti.vue'))
const CmDialogs = defineAsyncComponent(() => import('@/components/common/CmDialogs.vue'))
const CmTextField = defineAsyncComponent(() => import('@/components/common/CmTextField.vue'))

interface Props {
  isShowModal: boolean
  excludeIds?: any
  id: number
}
interface Emit {
  (e: 'update:isShowModal', value: any): void
  (e: 'saveChange', data: any): void
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const storecourseManager = courseManagerStore()
const { resetStatecoppyData } = storecourseManager

/** setting validate */
const schema = yup.object({
  name: schemaOption.defaultString,
})

const myFormCoppy = ref()

/** state */
const LABEL = Object.freeze({
  TITLE: t('coppy-exam'),
  TITLE1: `${t('exam-name')}*`,
})
const coppyData = ref({
  id: null,
  name: '',
  testExamIds: [],
  isLeaner: false,
  isTeacher: false,
  isSupervisor: false,
  isTestCode: false,
  isCost: false,
  isShift: false,
})

/** method */
async function onCancel() {
  emit('update:isShowModal', false)
}
async function onConfirm(idx: number, unload: any) {
  myFormCoppy.value.validate().then(async (success: any) => {
    if (success.valid) {
      emit('saveChange', coppyData.value)
      setTimeout(() => {
        unload(idx)
      }, 1000)
    }
  }).catch(() => {
    setTimeout(() => {
      unload(idx)
    }, 1000)
  })
}
const groupExamTestCombobox = ref([])
async function getGroupExamTestCombobox() {
  if (!groupExamTestCombobox.value.length) {
    await MethodsUtil.requestApiCustom(ExamService.GetGroupExamTestCombobox(props.id), TYPE_REQUEST.GET).then((value: any) => {
      console.log(value)
      groupExamTestCombobox.value = value.data
    })
  }
}
watch(() => props.isShowModal, isShow => {
  if (!isShow)
    resetStatecoppyData()
})
</script>

<template>
  <div>
    <CmDialogs
      :is-dialog-visible="isShowModal"
      :button-ok-name="t('save')"
      close-on-back
      persistent
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <template #title>
        <div class="pt-2">
          <div class="mb-3">
            <CmIconNoti
              :type="2"
              :size="1"
            />
          </div>
          <div
            class="d-flex align-center"
            :class="`justify-${typeDialog}`"
          >
            {{ t(LABEL.TITLE) }}
          </div>
        </div>
      </template>

      <Form
        ref="myFormCoppy"
        :validation-schema="schema"
        @submit.prevent="submitForm"
      >
        <Field
          v-slot="{ field, errors }"
          v-model="coppyData.name"
          name="name"
          type="text"
        >
          <CmTextField
            :field="field"
            :errors="errors"
            :text="LABEL.TITLE1"
            :placeholder="LABEL.TITLE1"
            class="mb-4"
          />
        </Field>
        <CmSelect
          v-model="coppyData.testExamIds"
          multiple
          append-to-body
          :items="groupExamTestCombobox"
          custom-key="value"
          item-value="key"
          :text="t('exam-title')"
          :placeholder="t('exam-title')"
          class="mb-4"
          @open="getGroupExamTestCombobox"
        />
        <div class="mb-2 text-medium-sm">
          {{ t('copy-component') }}
        </div>

        <VRow>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.isTeacher"
              :label="t('Teacher')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.isSupervisor"
              :label="t('monitor')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.isLeaner"
              :label="t('candidate')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.isTestCode"
              :label="t('test-code')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.isShift"
              :label="t('poetry')"
            />
          </VCol>
          <VCol
            cols="12"
            sm="6"
          >
            <CmCheckBox
              v-model="coppyData.isCost"
              :label="t('cost-management')"
            />
          </VCol>
        </VRow>
      </Form>
    </CmDialogs>
  </div>
</template>
