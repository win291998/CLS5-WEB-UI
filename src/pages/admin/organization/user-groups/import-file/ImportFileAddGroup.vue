<script setup lang="ts">
import ComboboxService from '@/api/combobox/index'
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Action, Config } from '@/typescript/interface/import'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import ApiGroupUser from '@/api/group-user/index'

// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  // eslint-disable-next-line prefer-const
  let [code, name, description] = rowData

  return { name, code, description }
}

const combobox = reactive({
  comboboxLevel: [],
  comboboxGroupProficiency: [],
})

// config
const config = reactive<Config>(
  {
    customId: 'id',
    routerBack: 'user',
    table: ({
      header: [
        { text: 'Mã', value: 'code' },
        { text: 'Tên Nhóm', value: 'name' },
        { text: 'Mô Tả', value: 'description' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiGroupUser.DownloadFileSampleGroup,
      method: TYPE_REQUEST.POST,
      nameFile: 'UserGroup.xlsx',
    },
    importFile: {
      urlFileDefault: ApiGroupUser.ImportFileGroup,
      method: TYPE_REQUEST.POST,
      dataColumnExcel,
      paramsImport: {
        isValidate: true,
      },
    },
  },
)

// HOOK
const actions = ref<Action[]>([
  {
    title: 'Thêm từ tệp tin',
    key: 1,
  },
])
</script>

<template>
  <div>
    <CpImportFile
      title-list="Danh sách nhóm người dùng"
      title-page="Thêm nhóm người dùng từ tập tin"
      :config="config"
      custom-key-error="messErr"
      :actions="actions"
    />
  </div>
</template>

