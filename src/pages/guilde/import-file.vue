<script setup lang="ts">
import ApiUser from '@/api/user/index'
import ApiCombobox from '@/api/combobox/index'
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Config } from '@/typescript/interface/import'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'

// Cập nhật mã người dùng
// const dataColumnExcel = (rowData: Array<any>) => {
//   const [infor, newEmail] = rowData

//   return { infor, newEmail }
// }
// Cập nhật kpi
// const dataColumnExcel = (rowData: Array<any>) => {
//   const [infor, kpiLearn, kpiTeach] = rowData

//   return { infor, kpiLearn, kpiTeach }
// }
// Cập nhật năng lực
const dataColumnExcel = (rowData: Array<any>) => {
  console.log(rowData)

  // eslint-disable-next-line prefer-const
  let [name, groupProficiency, levelProficiencies, description] = rowData

  levelProficiencies = levelProficiencies?.split(',')
  levelProficiencies = levelProficiencies.map((level: any) => level.trim())
  console.log(name, groupProficiency, levelProficiencies, description)

  return { name, groupProficiency, levelProficiencies, description }
}

const combobox = reactive({
  comboboxLevel: [],
  comboboxGroupProficiency: [],
})

// method

const getComboboxGroupProficiency = async () => {
  const res = await MethodsUtil.requestApiCustom(ApiCombobox.GroupProficiency, TYPE_REQUEST.GET).then((value: any) => value)

  console.log(res)
  console.log(window._.isEmpty(res.data))

  if (!window._.isEmpty(res?.data))
    combobox.comboboxGroupProficiency = res.data
}

const getComboboxProficiencyLevel = async () => {
  const params = {
    keyword: '',
    pageNumber: 1,
    pageSize: 10000,
  }

  const res = await MethodsUtil.requestApiCustom(ApiCombobox.ProficiencyLevel, TYPE_REQUEST.POST, params).then((value: any) => value)

  console.log(res)
  console.log(window._.isEmpty(res.data))

  if (!window._.isEmpty(res?.data?.pageLists))
    combobox.comboboxLevel = res.data.pageLists
}

getComboboxGroupProficiency()
getComboboxProficiencyLevel()

// config
const config = reactive<Config>(

  // Cập nhật mã người dùng
  // {
  //   customId: 'id',
  //   dowloadSample: {
  //     urlFileDefault: ApiUser.GetTemplateExcelUpdateEmailUser,

  //     // urlFileDefault: ApiUser.GenerateExcelTemplateCreateUsers,
  //     paramsDowload: {
  //       typeUpdate: 2,
  //       bach: 12,
  //     },
  //     method: 'GET',
  //     nameFile: 'codeBach.xlsx',
  //     dataColumnExcel,
  //   },
  //   importFile: {
  //     urlFileDefault: ApiUser.UpdateInforUserExcel,
  //     method: 'PUT',
  //     paramsImport: {
  //       typeUpdate: 2,
  //     },
  //   },
  // },
  // Cập nhật kpi
  // {
  //   customId: 'id',
  //   table: {
  //     header: [
  //       { text: 'Thông Tin Người Dùng', value: 'infor' },
  //       { text: 'KPI học', value: 'kpiLearn' },
  //       { text: 'KPI dạy', value: 'kpiTeach' },
  //     ],
  //   },
  //   dowloadSample: {
  //     urlFileDefault: ApiUser.GetTemplateExcelUpdateKpiUser,
  //     method: 'GET',
  //     nameFile: 'KPI.xlsx',
  //     dataColumnExcel,
  //   },
  //   importFile: {
  //     urlFileDefault: ApiUser.UpdateKpiUserExcel,
  //     method: 'PUT',
  //     paramsImport: {
  //       typeUpdate: 2,
  //     },
  //   },
  // },
  // Cập nhật năng lực
  {
    customId: 'id',
    routerBack: 'user',
    table: ({
      header: [
        { text: 'Tên Năng Lực', value: 'name' },
        {
          text: 'Nhóm Năng Lực',
          value: 'groupProficiency',
          type: 'combobox',
          combobox: {
            data: computed(() => combobox.comboboxGroupProficiency),
            multiple: false,
            key: 'value',
            value: 'value',
          },
        },
        {
          text: 'Cấp Độ',
          value: 'levelProficiencies',
          type: 'combobox',
          combobox: {
            data: computed(() => combobox.comboboxLevel),
            multiple: true,
            key: 'name',
            value: 'name',
          },
        },
        { text: 'Mô Tả', value: 'description' },
      ],
    }),
    dowloadSample: {
      urlFileDefault: ApiUser.GetTemplateExcelUpdateProficiencyUser,
      method: 'POST',
      nameFile: 'Proficiency.xlsm',
      dataColumnExcel,
    },
    importFile: {
      urlFileDefault: ApiUser.UpdateProficiencyUserExcel,
      method: 'POST',
    },
  },
)

// HOOK
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
    />
  </div>
</template>

