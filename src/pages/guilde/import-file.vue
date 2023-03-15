<script setup lang="ts">
import Api from '@/api/user/index'
import CpImportFile from '@/components/page/gereral/CpImportFile.vue'
import type { Config } from '@/typescript/interface/import'

const dataColumnExcel = (rowData: Array<any>) => {
  const [infor, newEmail] = rowData

  return { infor, newEmail }
}

// const dataColumnExcel = (rowData: Array<any>) => {
//   const [userCode, userName, password, lastName, firstName, phoneNumber, passport, userType, email, status, birthday, gender, organizationStructure, title, groupUser] = rowData

//   return { userCode, userName, password, lastName, firstName, phoneNumber, passport, userType, email, status, birthday, gender, organizationStructure, title, groupUser }
// }

const config = reactive<Config>(
  {
    dowloadSample: {
      urlFileDefault: Api.GetTemplateExcelUpdateEmailUser,

      // urlFileDefault: Api.GenerateExcelTemplateCreateUsers,
      paramsDowload: {
        typeUpdate: 2,
        bach: 12,
      },
      method: 'GET',
      nameFile: 'codeBach.xlsx',
      dataColumnExcel,
    },
    importFile: {
      urlFileDefault: Api.UpdateInforUserExcel,
      method: 'PUT',
      paramsImport: {
        typeUpdate: 2,
      },
    },
  },
)
</script>

<template>
  <div>
    <CpImportFile
      :config="config"
    />
  </div>
</template>

