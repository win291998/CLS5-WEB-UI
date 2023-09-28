<script setup lang="ts">
import CmAccodion from '@/components/common/CmAccodion.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'
import CmTextField from '@/components/common/CmTextField.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import CmSelect from '@/components/common/CmSelect.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import MethodsUtil from '@/utils/MethodsUtil'
import SystemService from '@/api/system/index'
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'
import apiPermission from '@/api/permission/index'
import { comboboxStore } from '@/stores/combobox'
import CpOrganizationSelect from '@/components/page/gereral/CpOrganizationSelect.vue'

const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schemaOption, Field, Form, useForm, yup } = storeValidate
const { submitForm } = useForm()
const models = ref([
  {
    value: 1,
    label: t('setting-login-private'),
    colorClass: 'color-warning',
    content: [],
  },
  {
    value: 2,
    label: t('setting-login-provider'),
    colorClass: 'color-warning',
    content: [],
  },
  {
    value: 3,
    label: t('setting-register-provider'),
    colorClass: 'color-warning',
    content: [],
  },
])

/** info */
const myFormInfor = ref()
const schemaInfo = yup.object({
  authenticationKey: schemaOption.defaultString,
  redirectUrl: schemaOption.defaultString,
})
const info = ref({
  id: null,
  authenticationKey: '',
  isAuthentication: false,
  redirectUrl: '',
})
async function getSystemConfig() {
  await MethodsUtil.requestApiCustom(SystemService.ConfigAuth, TYPE_REQUEST.GET).then((result: any) => {
    info.value = result.data
  })
}
async function saveInfo(idx: number, unload: any) {
  myFormInfor.value.validate().then(async (success: any) => {
    if (success.valid) {
      if (info.value.redirectUrl.includes(window.location.hostname)) {
        toast('WARNING', t('unlink-noti-sys'))
        unload(idx)
        return
      }
      await MethodsUtil.requestApiCustom(SystemService.ConfigAuth, TYPE_REQUEST.PUT, info.value).then((result: any) => {
        toast('SUCCESS', t('USR_UpdateSuccess'))
        setTimeout(() => {
          unload(idx)
        }, 1000)
      }).catch((err: any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
        setTimeout(() => {
          unload(idx)
        }, 1000)
      })
    }
    else {
      setTimeout(() => {
        unload(idx)
      }, 1000)
    }
  })
}
function cancelInfo() {
  getSystemConfig()
}
getSystemConfig()

/** info */

/** Communication */
const myFormExternalLogin = ref()
const schemaExternalLogin = yup.object({
  clientId: schemaOption.defaultString,
  clientSecret: schemaOption.defaultString,
})
const emptyExternalLogin = {
  clientId: null,
  clientSecret: null,
  isActived: false,
  provider: 'Google',
}
const externalLoginList = ref([])
const selectedProvider = ref({
  clientId: null as null | string,
  clientSecret: null as null | string,
  isActived: false,
  provider: null as null | string,
})
const comboboxProvider = ref([])
async function getComboboxProvider() {
  if (!window._.isEmpty(comboboxProvider.value))
    return
  await MethodsUtil.requestApiCustom(SystemService.LoginProvider, TYPE_REQUEST.GET).then((result: any) => {
    comboboxProvider.value = result.data.map((item: any) => ({
      key: item,
      value: item,
    }))
  })
}
async function getExternalLogin() {
  await MethodsUtil.requestApiCustom(SystemService.ConfigExternalLogin, TYPE_REQUEST.GET).then((result: any) => {
    externalLoginList.value = result.data
  })
}
function handleChangeProvider(val: any) {
  const selectProvider = externalLoginList.value.find((x: any) => x.provider === val)
  if (selectProvider) {
    selectedProvider.value = selectProvider
    return
  }
  selectedProvider.value = emptyExternalLogin
  selectedProvider.value.provider = val
}
async function saveExternalLogin(idx: number, unload: any) {
  myFormExternalLogin.value.validate().then(async (success: any) => {
    if (success.valid) {
      await MethodsUtil.requestApiCustom(SystemService.ConfigExternalLogin, TYPE_REQUEST.PUT, selectedProvider.value).then(() => {
        toast('SUCCESS', t('USR_UpdateSuccess'))
        setTimeout(() => {
          unload(idx)
        }, 1000)
      }).catch((err: any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
        setTimeout(() => {
          unload(idx)
        }, 1000)
      })
    }
    else {
      setTimeout(() => {
        unload(idx)
      }, 1000)
    }
  })
}
function cancelCommun() {
  getExternalLogin()
  selectedProvider.value = {
    clientId: null as null | string,
    clientSecret: null as null | string,
    isActived: false,
    provider: null as null | string,
  }
}
getExternalLogin()

/** Communication */

/** register */
const myFormRegis = ref()
const schemaRegis = yup.object({
  typeId: schemaOption.defaultSelectSingle,
  userTypeId: schemaOption.defaultSelectSingle,
})
const registerConfig = ref({
  typeId: null,
  userTypeId: null,
  groupId: null,
  organizationalStructureId: null,
  titleId: null,
})
const comboboxRegister = [
  {
    key: 1,
    value: t('from-admin'),
  },
  {
    key: 2,
    value: t('direct-approve'),
  },
  {
    key: 3,
    value: t('direct-no-approve'),
  },
]
const store = comboboxStore()
const { titleUserCombobox, groupUserCombobox } = storeToRefs(store)

const { fetchTitlesUsersCombobox, fetchGroupUserCombobox } = store
const comboboxUserType = ref<any[]>([])
async function getComboboxUserType() {
  if (comboboxUserType.value.length)
    return
  const { data } = await MethodsUtil.requestApiCustom(apiPermission.comboboxUserType, TYPE_REQUEST.GET)
  comboboxUserType.value = data
}
const isRenderOrg = ref(false)
function handleChangeOrg(val: any) {
  registerConfig.value.titleId = null
  if (!val)
    titleUserCombobox.value = []

  else
    fetchTitlesUsersCombobox(registerConfig.value.organizationalStructureId)
}
async function getRegisterConfig() {
  await MethodsUtil.requestApiCustom(SystemService.GetRegisterConfig, TYPE_REQUEST.GET).then((result: any) => {
    registerConfig.value = result.data
    if (registerConfig.value.userTypeId)
      getComboboxUserType()
    if (registerConfig.value.groupId && !comboboxUserType.value.length)
      fetchGroupUserCombobox()
    if (registerConfig.value.organizationalStructureId) {
      isRenderOrg.value = true
      fetchTitlesUsersCombobox(registerConfig.value.organizationalStructureId)
    }
  })
}

async function saveRegister(idx: number, unload: any) {
  myFormRegis.value.validate().then(async (success: any) => {
    if (success.valid) {
      await MethodsUtil.requestApiCustom(SystemService.UpdateRegisterConfig, TYPE_REQUEST.POST, registerConfig.value).then(() => {
        toast('SUCCESS', t('USR_UpdateSuccess'))
        setTimeout(() => {
          unload(idx)
        }, 1000)
      }).catch((err: any) => {
        toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
        setTimeout(() => {
          unload(idx)
        }, 1000)
      })
    }
    else {
      setTimeout(() => {
        unload(idx)
      }, 1000)
    }
  })
}
function cancelRegister() {
  getRegisterConfig()
  registerConfig.value = {
    typeId: null,
    userTypeId: null,
    groupId: null,
    organizationalStructureId: null,
    titleId: null,
  }
}
getRegisterConfig()

/** register */
</script>

<template>
  <div class="mt-6">
    <div class="b-container">
      <CmAccodion
        is-open
        is-bg-active
        :is-default="false"
        is-border
        :data="models"
      >
        <template #titleData="{ context }">
          <div class="text-medium-md">
            {{ context.label }}
          </div>
        </template>
        <template #textData="{ context }">
          <div
            v-if="context.value === 1"
            class="mln-7"
          >
            <Form
              ref="myFormInfor"
              :validation-schema="schemaInfo"
              @submit.prevent="submitForm"
            >
              <div class="pt-2 pb-6">
                <CmCheckBox
                  v-model="info.isAuthentication"
                  class="mr-2"
                >
                  {{ t('permision-login') }}
                </CmCheckBox>
                <VRow>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <Field
                      v-slot="{ field, errors }"
                      v-model="info.authenticationKey"
                      name="authenticationKey"
                      type="text"
                    >
                      <CmTextField
                        :field="field"
                        :errors="errors"
                        :model-value="info.authenticationKey"
                        :disabled="!info.isAuthentication"
                        :text="t('auth-lock')"
                        :placeholder="t('auth-lock')"
                      />
                    </Field>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <Field
                      v-slot="{ field, errors }"
                      v-model="info.redirectUrl"
                      name="redirectUrl"
                      type="text"
                    >
                      <CmTextField
                        :model-value="info.redirectUrl"
                        :field="field"
                        :errors="errors"
                        :disabled="!info.isAuthentication"
                        :text="t('link-login-private')"
                        :placeholder="t('link-login-private')"
                      />
                    </Field>
                  </VCol>
                </VRow>
              </div>
              <div class="pt-6 pb-3">
                <CpActionFooterEdit
                  is-cancel
                  is-save
                  :title-cancel="t('cancel-title')"
                  @on-cancel="cancelInfo"
                  @on-save="saveInfo"
                />
              </div>
            </Form>
          </div>
          <div
            v-if="context.value === 2"
            class="mln-7 border-bottom"
          >
            <Form
              ref="myFormExternalLogin"
              :validation-schema="schemaExternalLogin"
              @submit.prevent="submitForm"
            >
              <div class="pt-2 pb-6">
                <VRow>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <CmSelect
                      :model-value="selectedProvider.provider"
                      :items="comboboxProvider"
                      item-value="key"
                      :text="t('Communication')"
                      custom-key="value"
                      @open="getComboboxProvider"
                      @update:model-value="handleChangeProvider"
                    />
                  </VCol>
                  <VCol
                    v-if="selectedProvider.provider"
                    cols="12"
                    md="6"
                  >
                    <div class="mb-7 d-none d-md-block" />
                    <div>
                      <CmCheckBox
                        v-model="selectedProvider.isActived"
                        class="mr-2"
                      >
                        {{ t('login-platform') }}
                      </CmCheckBox>
                    </div>
                  </VCol>
                </VRow>
                <VRow v-if="selectedProvider.provider">
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <Field
                      v-slot="{ field, errors }"
                      v-model="selectedProvider.clientId"
                      name="clientId"
                      type="text"
                    >
                      <CmTextField
                        :model-value="selectedProvider.clientId"
                        :field="field"
                        :errors="errors"
                        :text="`${t('code-member')}*`"
                        :disabled="!selectedProvider.isActived"
                        :placeholder="t('code-member')"
                      />
                    </Field>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <Field
                      v-slot="{ field, errors }"
                      v-model="selectedProvider.clientSecret"
                      name="clientSecret"
                      type="text"
                    >
                      <CmTextField
                        :model-value="selectedProvider.clientSecret"
                        :field="field"
                        :errors="errors"
                        :text="`${t('auth-lock')}*`"
                        :disabled="!selectedProvider.isActived"
                        :placeholder="t('auth-lock')"
                      />
                    </Field>
                  </VCol>
                </VRow>
              </div>

              <div
                v-if="selectedProvider.provider"
                class="pt-6 pb-3"
              >
                <CpActionFooterEdit
                  is-cancel
                  is-save
                  :title-cancel="t('cancel-title')"
                  @on-cancel="cancelCommun"
                  @on-save="saveExternalLogin"
                />
              </div>
            </Form>
          </div>
          <div
            v-if="context.value === 3"
            class="mln-7"
          >
            <Form
              ref="myFormRegis"
              :validation-schema="schemaRegis"
              @submit.prevent="submitForm"
            >
              <div class="pt-2 pb-6">
                <VRow>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <Field
                      v-slot="{ field, errors }"
                      v-model="registerConfig.typeId"
                      name="typeId"
                    >
                      <CmSelect
                        :model-value="registerConfig.typeId"
                        :field="field"
                        :errors="errors"
                        :items="comboboxRegister"
                        :text="`${t('sign-up')} *`"
                        item-value="key"
                        custom-key="value"
                        :placeholder="t('sign-up')"
                      />
                    </Field>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <Field
                      v-slot="{ field, errors }"
                      v-model="registerConfig.userTypeId"
                      name="userTypeId"
                    >
                      <CmSelect
                        :model-value="registerConfig.userTypeId"
                        :field="field"
                        :errors="errors"
                        :items="comboboxUserType"
                        :text="`${t('default-usertype')} *`"
                        item-value="key"
                        custom-key="value"
                        :placeholder="t('default-usertype-choose')"
                        @open="getComboboxUserType"
                      />
                    </Field>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <CmSelect
                      v-model="registerConfig.groupId"
                      :items="groupUserCombobox"
                      :text="t('default-user-group')"
                      :placeholder="t('default-user-group-choose')"
                      item-value="id"
                      custom-key="name"
                      @open="fetchGroupUserCombobox"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <CpOrganizationSelect
                      v-model="registerConfig.organizationalStructureId"
                      :text="t('default-org-struct')"
                      :max-height="200"
                      :is-render="isRenderOrg"
                      :placeholder="t('default-org-struct-choose')"
                      @update:modelValue="handleChangeOrg"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <CmSelect
                      v-model="registerConfig.titleId"
                      :disabled="!registerConfig.organizationalStructureId"
                      :items="titleUserCombobox"
                      :text="t('default-user-title')"
                      :placeholder="t('default-user-title-choose')"
                      item-value="key"
                      custom-key="value"
                    />
                  </VCol>
                </VRow>
              </div>
            </Form>

            <div class="pt-6 pb-3">
              <CpActionFooterEdit
                is-cancel
                is-save
                :title-cancel="t('cancel-title')"
                @on-cancel="cancelRegister"
                @on-save="saveRegister"
              />
            </div>
          </div>
        </template>
      </CmAccodion>
    </div>
  </div>
</template>
