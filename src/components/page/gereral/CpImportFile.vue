<script setup lang="ts">
import { useRouter } from 'vue-router'
import CmButton from '@/components/common/CmButton.vue'
import CmTable from '@/components/common/CmTable.vue'
import Globals from '@/constant/Globals'
import { useImportFileStore } from '@/stores/ImportFile'
import MethodsUtil from '@/utils/MethodsUtil'
import type { Config } from '@/typescript/interface/import'

// interface

interface Props {
  config: Config
}

/** ** Khởi tạo prop emit */
const props = withDefaults(defineProps<Props>(), ({
  config: () => ({
    customId: 'id',
    table: {
      header: [],
    },
  }),
}))

/** ** Khởi tạo store */
const store = useImportFileStore()
const router = useRouter()
const { paramsImport } = store
const { checkInvalidData, fileChange, updateFromFile } = store

const isEditing = ref(false)

const headers = reactive([
  { text: '', value: 'checkbox' },
  ...props?.config?.table?.header,
])

const headersInvalid = computed(() => {
  const select = {
    text: 'Select',
    value: 'select',
    thClass: 'custom-th-class',
    sortable: false,
  }

  const columns = window._.cloneDeep(headers)

  columns.shift()
  columns.unshift(select)

  return columns
})

const inputFile = ref()

watch(() => props.config, value => {
  store.$patch({
    config: {
      ...props.config,
    },
  })
}, { immediate: true })

/** Method */
const dowloadSampleFile = async () => {
  MethodsUtil.dowloadSampleFile(
    props.config?.dowloadSample?.urlFileDefault || '',
    props.config?.dowloadSample?.method || 'GET',
    props.config?.dowloadSample?.nameFile || 'file.xlsm',
    props.config?.dowloadSample?.paramsDowload || {},
  )
}

// thay đổi dữ liệu trên bảng
const changeCellvalue = (event: any, field: string, key: number) => {
  paramsImport.invalidData[key][field] = event as never
}

const handleEditTable = () => {
  isEditing.value = !isEditing.value
}

const updateFromFileHandle = async () => {
  const back = await updateFromFile()
  if (back === 'back' && props?.config?.routerBack)
    router.push({ name: props.config.routerBack })
}

const handleSelectedRows = (listSelected: any) => {
}
</script>

<template>
  <div class="cp-import-file">
    <div class="cp-import-file-valid">
      <div class="cp-import-file-header">
        <div class="cp-import-file-title">
          Danh sách người dùng hợp lệ
        </div>
        <div class="cp-import-file-action">
          <div class="cp-import-file-btn mr-3">
            <CmButton @click="dowloadSampleFile">
              Tải tập tin mẫu
            </CmButton>
          </div>
          <div class="cp-import-file-btn">
            <CmButton @click="inputFile.click()">
              Lựa chọn tập tin
            </CmButton>
            <input
              ref="inputFile"
              type="file"
              :accept="Globals.excelFileExtention"
              hidden
              @change="fileChange"
            >
          </div>
        </div>
      </div>
      <div class="cp-import-file-table">
        <CmTable
          :headers="headers"
          :items="paramsImport.validData"
          return-object
          is-import-file
          @selectedRows="handleSelectedRows"
        />
      </div>
    </div>
    <div class="cp-import-file-invalid">
      <div class="cp-import-file-header">
        <div class="cp-import-file-title">
          Danh sách người dùng không hợp lệ
        </div>
        <div class="cp-import-file-action">
          <div class="cp-import-file-btn mr-3">
            <CmButton @click="checkInvalidData">
              Kiểm tra
            </CmButton>
          </div>
          <div class="cp-import-file-btn">
            <CmButton @click="handleEditTable">
              Chỉnh sửa
            </CmButton>
          </div>
        </div>
      </div>
      <div class="cp-import-file-table">
        <CmTable
          :headers="headersInvalid"
          :items="paramsImport.invalidData"
          :is-editing="isEditing"
          is-import-file
          @changeCellvalue="changeCellvalue"
        />
      </div>
      <div class="cp-import-file-action-footer mt-3">
        <div class="cp-import-file-btn-footer mr-3">
          <CmButton @click="dowloadSampleFile">
            Quay lại
          </CmButton>
        </div>
        <div class="cp-import-file-btn-footer">
          <CmButton @click="updateFromFileHandle">
            Thêm người dùng
          </CmButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cp-import-file {
  .cp-import-file-header {
    display: flex;
    justify-content: space-between;

    .cp-import-file-title {
      color: #101828;
      font-size: 18px;
      font-weight: 500;
      line-height: 28px;
      padding-block: 20px;
      padding-inline: 0;
    }

    .cp-import-file-action {
      display: flex;
      justify-content: space-between;

      .cp-import-file-btn {
        display: flex;
        align-items: center;
        align-self: center;
      }
    }
  }

  .cp-import-file-action-footer {
    display: flex;
    justify-content: flex-end;

    .cp-import-file-btn-footer {
      display: flex;
      align-items: center;
      align-self: center;
    }
  }

  .cp-import-file-invalid {
    margin-block-start: 40px;
  }
}
</style>
