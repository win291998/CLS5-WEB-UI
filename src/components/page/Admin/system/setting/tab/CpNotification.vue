<script lang="ts" setup>
import CpConfigurationAll from './notification/CpConfigurationAll.vue'
import CpNotificationGeneral from './notification/CpNotificationGeneral.vue'
import SharedService from '@/api/shared'
import CmButton from '@/components/common/CmButton.vue'
import CmMenu from '@/components/common/CmMenu.vue'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any, Tab } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'
import CmTab from '@/components/common/CmTab.vue'
import CpActionFooterEdit from '@/components/page/gereral/CpActionFooterEdit.vue'
import toast from '@/plugins/toast'

interface Item {
  id: any
  code: string
  isShow: boolean
  name: string
  icon: string
  items: Item[]
}

const { t } = window.i18n()
const listMenu = ref<Item[]>([])

function getMenuNotification() {
  MethodsUtil.requestApiCustom(SharedService.GetListNotification, TYPE_REQUEST.GET).then((result: Any) => {
    result.data.items.forEach((element: Item) => {
      element.isShow = false
    })
    listMenu.value = result.data.items
  })
}
getMenuNotification()
const tab = ref('all')
const type = computed(() => {
  if (tab.value && tab.value === 'mail')
    return 2
  return 1
})

const listTab: Tab[] = [
  {
    key: 'all',
    title: 'configuration-all',
  },
  {
    key: 'mail',
    title: 'configuration-mail',
  },
]
const isGeneral = ref(true)
const configuration = ref()
function getDataDetail(val: Any) {
  isGeneral.value = false
  getDetailNotify(val.id)
  configuration.value.getListKeyword({ ...val, type: type.value })
}
function typeActive(val: string) {
  tab.value = val
}

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

const dataNotify = ref<Notify>({})
function getDetailNotify(id: number) {
  MethodsUtil.requestApiCustom(`${SharedService.GetListNotification}/${id}`, TYPE_REQUEST.GET).then((res: Any) => {
    dataNotify.value = res.data
  })
}

async function updateNotify(unload: any) {
  await MethodsUtil.requestApiCustom(SharedService.PutUpdateNotification, TYPE_REQUEST.PUT, dataNotify.value).then((result: Any) => {
    toast('SUCCESS', t('USR_UpdateSuccess'))
    getMenuNotification()
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
  })
  unload()
}
</script>

<template>
  <div
    class="mt-2"
  >
    <CmMenu
      style="min-height: 500px;"
      :items="listMenu"
      @change="getDataDetail"
    >
      <template #header>
        <CmButton
          variant="tonal"
          class="w-100"
          :title="t('configuration')"
          @click=" isGeneral = true"
        />
      </template>
      <template #content>
        <div class="ml-6">
          <div
            v-if="isGeneral === false"
          >
            <CmTab
              :list-tab="listTab"
              label="tab"
              is-un-query
              type="underline"
              @activeTab="typeActive"
            />
            <CpConfigurationAll
              v-if="tab === 'all'"
              ref="configuration"
              v-model:notify="dataNotify"
            />
          </div>

          <CpNotificationGeneral
            v-if="tab === 'all' && isGeneral === true"
            :items="listMenu"
          />
        </div>
      </template>
    </CmMenu>
    <CpActionFooterEdit
      is-save
      @on-save="(idx, unload) => { updateNotify(unload) }"
    />
  </div>
</template>
