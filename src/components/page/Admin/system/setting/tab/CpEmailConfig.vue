<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import CmTextField from '@/components/common/CmTextField.vue'
import CmButton from '@/components/common/CmButton.vue'
import CmSwitch from '@/components/common/CmSwitch.vue'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import SystemService from '@/api/system/index'
import toast from '@/plugins/toast'

/**
 * store
 */
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()

const schema = yup.object({
  email: schemaOption.email,
  username: schemaOption.userName,
  password: schemaOption.password,
  host: schemaOption.defaultString,
  port: schemaOption.defaultNumber,
})
const schemaMail = yup.object({
  emailRecipient: schemaOption.email,
})

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()
const emailRecipient = ref()
const isPasswordVisible = ref(false)

const emailConfig = ref({
  email: null,
  username: null,
  password: null,
  host: null,
  port: null,
  isRequireSsl: false,
  isCustomSetting: false,
})
const myFormAdd = ref()

function handleCancle() {
  // router.push({ name: 'course-edit', params: { id: Number(route.params.id) }, query: { tab: 'content' } })
}
async function saveConfig(idx: number, unload: any) {
  myFormAdd.value.validate().then(async (success: any) => {
    if (success.valid) {
      MethodsUtil.requestApiCustom('EmailConfiguration', TYPE_REQUEST.POST, emailConfig.value).then(() => {
        toast('SUCCESS', t('update-register-config-success'))
        unload(idx)
      }).catch(() => {
        unload(idx)
        toast('ERROR', t('update-register-config-failed'))
      })
    }

    unload(idx)
  })
    .catch(() => {
      unload(idx)
    })
}

function exportGuide(idx: number, unload: any) {
  MethodsUtil.dowloadSampleFile('https://sfv4.cls.vn/testDevice/huong-dan-cau-hinh-mail.pdf', TYPE_REQUEST.GET, 'huong-dan-cau-hinh-mail.pdf').then(() => {
    unload(idx)
  }).catch(() => {
    unload(idx)
  })
}

async function customSettingChange(e: any) {
  console.log(e)

  if (!e) {
    MethodsUtil.requestApiCustom('EmailConfiguration', TYPE_REQUEST.GET).then((result: any) => {
      const {
        email, host, isRequireSsl, password, port, username, id,
      } = result?.data
      emailConfig.value = {
        ...emailConfig.value,
        ...{
          email, host, isRequireSsl, password, port, username, id,
        },
      }
    })
  }
}

async function getEmailConfig() {
  MethodsUtil.requestApiCustom('EmailConfiguration', TYPE_REQUEST.GET).then((result: any) => {
    if (result?.data) {
      const {
        email, host, isRequireSsl, password, port, username, id, isCustomSetting,
      } = result?.data
      emailConfig.value = {
        ...emailConfig.value,
        ...{
          email, host, isRequireSsl, password, port, username, id, isCustomSetting,
        },
      }
    }
    else {
      emailConfig.value = {
        email: null,
        username: null,
        password: null,
        host: null,
        port: null,
        isRequireSsl: false,
        isCustomSetting: false,
      }
    }
  })
    .catch(() => {
      emailConfig.value = {
        email: null,
        username: null,
        password: null,
        host: null,
        port: null,
        isRequireSsl: false,
        isCustomSetting: false,
      }
    })
}
const myFormMailTest = ref()
function sendMailTest(idx: number, unload: any) {
  myFormMailTest.value.validate().then(async (success: any) => {
    if (success.valid) {
      const params = {
        emailRecipient: emailRecipient.value,
      }
      MethodsUtil.requestApiCustom(SystemService.SendMailTest, TYPE_REQUEST.POST, params).then(() => {
        toast('SUCCESS', t('send-to-mailtest-success'))
      }).catch(() => {
        toast('ERROR', t('send-to-mailtest-faild'))
      })
    }

    unload(idx)
  })
    .catch(() => {
      unload(idx)
    })
}
function cancelConfig() {
  getEmailConfig()
  router.push({
    name: 'setting',
    query: {
      tabActive: 'setting-info',
    },
  })
}
getEmailConfig()
</script>

<template>
  <div class="mt-6">
    <div class="d-flex justify-end">
      <CmButton
        :title="t('configuration-guide')"
        icon="tabler:download"
        color="primary"
        variant="tonal"
        @click="exportGuide"
      />
    </div>
    <div>
      <CmSwitch
        v-model="emailConfig.isCustomSetting"
        :label="t('custom-configuration')"
        :type="2"
        color="primary"
        class="mbn-2"
        @update:model-value="customSettingChange"
      />
    </div>
    <Form
      ref="myFormAdd"
      :validation-schema="schema"
      @submit.prevent="submitForm"
    >
      <VRow class="flex-warp">
        <VCol
          cols="12"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="emailConfig.email"
            name="email"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :model-value="emailConfig.email"
              :text="`${t('from')}*`"
              :placeholder="t('from')"
              :disabled="!emailConfig.isCustomSetting"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="emailConfig.username"
            name="username"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :model-value="emailConfig.username"
              :text="`${t('userName')}*`"
              :placeholder="t('userName')"
              :disabled="!emailConfig.isCustomSetting"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="emailConfig.password"
            name="password"
            type="password"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :model-value="emailConfig.password"
              :text="`${t('password')}*`"
              :placeholder="t('password')"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
              :disabled="!emailConfig.isCustomSetting"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="emailConfig.host"
            name="host"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :model-value="emailConfig.host"
              :text="`${t('host')}*`"
              :placeholder="t('host')"
              :disabled="!emailConfig.isCustomSetting"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="6"
        >
          <Field
            v-slot="{ field, errors }"
            v-model="emailConfig.port"
            name="port"
            type="text"
          >
            <CmTextField
              :field="field"
              :errors="errors"
              :model-value="emailConfig.port"
              :text="`${t('port')}*`"
              :placeholder="t('port')"
              :disabled="!emailConfig.isCustomSetting"
            />
          </Field>
        </VCol>
        <VCol
          cols="12"
          sm="6"
          class="d-flex align-center"
        >
          <div class="mb-1" />
          <CmSwitch
            v-model="emailConfig.isRequireSsl"
            :label="t('Bật SSL')"
            :type="2"
            color="primary"
            class="mbn-4"
            :disabled="!emailConfig.isCustomSetting"
          />
        </VCol>
      </VRow>
      <VDivider class="my-6" />
    </Form>
    <Form
      ref="myFormMailTest"
      :validation-schema="schemaMail"
      @submit.prevent="submitForm"
    >
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <VRow>
            <VCol
              cols="12"
              sm="8"
            >
              {{ t('to-checking-mail') }}
            </VCol>
          </VRow>
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <VRow>
            <VCol
              cols="12"
              sm="8"
            >
              <Field
                v-slot="{ field, errors }"
                v-model="emailRecipient"
                name="emailRecipient"
                type="text"
              >
                <CmTextField
                  :field="field"
                  :errors="errors"
                  :model-value="emailRecipient"
                  :placeholder="t('input-to-mail')"
                />
              </Field>
            </VCol>
            <VCol
              cols="12"
              sm="4"
              class="d-flex align-top"
            >
              <div style="padding: 4px 0px; ">
                <CmButton
                  :title="t('send-to-mailtest')"
                  icon="tabler:send"
                  color="primary"
                  variant="tonal"
                  @click="sendMailTest"
                />
              </div>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </Form>
    <div class="d-flex justify-end mt-6">
      <CmButton
        :title="t('come-back')"
        color="secondary"
        variant="outlined"
        @click="cancelConfig"
      />
      <CmButton
        :title="t('save')"
        class="ml-3"
        is-load
        @click="saveConfig"
      />
    </div>
  </div>
</template>
