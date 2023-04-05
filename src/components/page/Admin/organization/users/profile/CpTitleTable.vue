<script setup lang="ts">
import { validatorStore } from '@/stores/validatator'
import toast from '@/plugins/toast'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

// Khai báo biến Emit
const emit = defineEmits<Emit>()
const CmTable = defineAsyncComponent(() => import('@/components/common/CmTable.vue'))
const CmCheckBox = defineAsyncComponent(() => import('@/components/common/CmCheckBox.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CpOrganizationSelect = defineAsyncComponent(() => import('@/components/page/gereral/CpOrganizationSelect.vue'))
const CmSelect = defineAsyncComponent(() => import('@/components/common/CmSelect.vue'))

// Cấu trúc Emit
interface Emit {
  (e: 'updateListOrg', value: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const storeValidate = validatorStore()
const { schema, Field, Form } = storeValidate

const isCourse = ref(false)
const isTrainingRoute = ref(false)

// table
const headers = reactive([
  { text: t('report.name-structure'), value: 'orgStruct', width: '40%' },
  { text: t('common.title-position'), value: 'title', width: '40%' },
  { text: '', value: 'actions', width: 150 },
])

const items = ref<any>([])

// org
const dataOrg = reactive({
  isChange: false,
})

const addOrg = () => {
  dataOrg.isChange = true
  items.value.push({
    key: items.value.length,
    id: null,
    listTitle: [],
    name: '',
    titleId: null,
    titleName: '',
  })
}

const getTitleByOrg = async (orStructureId: any) => {
  const params = {
    orStructureId,
  }

  const res = await MethodsUtil.requestApiCustom(ApiUser.GetListTitle, TYPE_REQUEST.POST, params)
    .then(value => {
      if (value?.data?.pageLists?.length > 0) {
        value.data.pageLists = value.data.pageLists.map(x => ({ value: x.id, text: x.name, orgId: x.organizationalStructureId }))

        return value.data.pageLists
      }

      return []
    })

  console.log(res)

  return res
}

const changeOrg = async (index: any, val: any) => {
  dataOrg.isChange = true

  const testIndex = items.value.findIndex((x: any) => x.id === val)
  if (testIndex >= 0 || val === null) {
    toast('WARNING', t('Cơ cấu tổ chức không được để trống và không đươc phép trùng'))

    return
  }
  const changedValue = items.value[index]
  const listTitle = await getTitleByOrg(val)

  console.log(index, val, listTitle)

  changedValue.id = val
  changedValue.titleId = null
  changedValue.listTitle = listTitle
  items.value.splice(index, 1, changedValue)
  emit('updateListOrg', items.value)
}

const changeTitle = (index: any, val: any) => {
  dataOrg.isChange = true

  const changedValue = items.value[index]

  changedValue.titleId = val
  items.value.splice(index, 1, changedValue)
}
</script>

<template>
  <VSheet
    width="100%"
    class="user-infor mx-auto no-background"
  >
    <Form>
      <label class="mb-1">{{ $t('common.auto-assign-content') }}</label>
      <VRow class="mb-5">
        <VCol
          cols="12"
          md="4"
        >
          <CmCheckBox
            v-model:model-value="isCourse"
          >
            {{ t('common.course') }}
          </CmCheckBox>
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <CmCheckBox
            v-model:model-value="isTrainingRoute"
          >
            {{ t('calendar.training-path') }}
          </CmCheckBox>
        </VCol>
      </VRow>
    </Form>
  </VSheet>
  <VSheet
    width="100%"
    class="user-infor mx-auto no-background"
  >
    <CmTable
      :headers="headers"
      :items="items"
      is-action-footer
    >
      <template #action-footer>
        <div>
          <CmButton
            variant="text"
            @click="addOrg"
          >
            <VIcon icon="tabler:plus" />
            {{ t('common.add') }}
          </CmButton>
        </div>
      </template>
      <template #rowItem="{ col, context }">
        <div v-if="col === 'orgStruct'">
          <Form>
            <Field name="orgStruct">
              <CpOrganizationSelect
                v-model="context.id"
                :text="t('report.name-structure')"
                :placeholder="t('report.name-structure')"
                :close-on-select="true"
                @update:modelValue="changeOrg(context.key, $event)"
              />
            </Field>
          </Form>
        </div>
        <div v-if="col === 'title'">
          <div v-if="context.id">
            <CmSelect
              v-model="context.statusId"
              :text="t('common.title-position')"
              :placeholder="t('common.title-position')"
              :items="context.listTitle"
              item-value="key"
              custom-key="value"
              @update:model-value="changeTitle(context.key, $event)"
            />
          </div>
        </div>
      </template>
    </CmTable>
  </VSheet>
</template>

<style lang="scss" scoped>
@use "/src/styles/style-global" as *;
</style>

