<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClickRowArgument, Header, Item } from 'vue3-easy-data-table'
import CmPagination from './CmPagination.vue'
import svgChecked from '@/assets/images/svg/checkbox-tick.svg?raw'
import svgIndeterminate from '@/assets/images/svg/indeterminate.svg?raw'
import Globals from '@/constant/Globals'

interface groupOptions {
  allowEmptySelect?: boolean
  collapsable?: boolean
  enabled?: boolean
}
interface Props {
  groupOptions?: groupOptions
  headers: Header[]
  items?: Item[]
  rowClassName?: string
  pageSize?: number
  isEditing?: boolean
}
interface Emit {
  (e: 'handleClickRow', dataRow: object): void
  (e: 'selectedRows', dataRow: object): void
  (e: 'itemSelected', dataRow: object): void
  (e: 'checkedAll', checkedAll: boolean, data: object): void
  (e: 'changeCellvalue', field: string, key: number): void

}

const props = withDefaults(defineProps<Props>(), ({
  headers: () => ([]),
  items: () => ([]),
  groupOptions: () => ({
    allowEmptySelect: false,
    collapsable: false,
    enabled: false,
  }),
  isEditing: false,
  rowClassName: '',
  pageSize: Globals.PAGINATION_PAGE_SIZE_DEFAULT,
}))

const emit = defineEmits<Emit>()

// $ref dataTable
const dataTable = ref()

const selectedRows = ref<any>([])

const selectedAll = computed(() => {
  if (props?.groupOptions?.enabled === true) {
    let count = 0
    props.items?.forEach(element => {
      if (element.children)
        count += element?.children?.length

      else
        count += 1
    })

    return (
      selectedRows.value
          && selectedRows.value?.length > 0
          && selectedRows.value?.length === count
    )
  }

  return (selectedRows.value && selectedRows.value.length > 0 && selectedRows.value.length === props.items.length)
})

const indeterminate = computed(() => {
  if (props.groupOptions.enabled === true) {
    let count = 0
    props.items?.forEach(element => {
      if (element.children)
        count += element?.children?.length

      else
        count += 1
    })

    return (
      selectedRows.value
          && selectedRows.value.length > 0
          && selectedRows.value.length < count
    )
  }

  return (
    selectedRows.value
        && selectedRows.value.length > 0
        && selectedRows.value.length < props.items.length
  )
})

const pageSize = ref(props.pageSize) // số lượng item trên 1 page
const currentPage = ref<number>(Globals.PAGINATION_CURRENT_PAGE) // item hiện tại

/** method */
// click chọn tất cả hoặc bỏ tất cả
const checkedAll = (value: any) => {
  selectedRows.value = []

  if (props.groupOptions.enabled === true) {
    if (!value) {
      props.items?.forEach(element => {
        if (element.children) {
          element.children?.forEach((child: any) => {
            child.isSelected = true
            selectedRows.value.push(child.id)
          })
        }
        else {
          element.isSelected = true
          selectedRows.value.push(element.id)
        }
      })
    }
    else {
      selectedRows.value = []
    }
  }
  else {
    selectedRows.value = !value ? props.items.map(item => item.id) : []
    props.items?.forEach(element => {
      if (!(element.isDisabled && element.isDisabled === true))
        element.isSelected = !value
    })
  }

  emit('checkedAll', !value, selectedRows)
}

/** event */
// sự kiện click vào hàng
const showRow = (item: ClickRowArgument) => {
  emit('handleClickRow', item)
}

// sự kiện click chọn item
const checkedItem = (event: boolean, item: any) => {
  emit('itemSelected', item)
  emit('selectedRows', selectedRows)
}

// Cập nhật table theo pagination
const updatePage = (paginationNumber: number) => {
  dataTable.value.updatePage(paginationNumber)
}

// Cập nhật số lượng item trên  table theo pagination
const updateRowsPerPageSelect = (e: number) => {
  dataTable.value.updateRowsPerPageActiveOption(e)
}

// thay đổi số lượng item trên trang
const pageSizeChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  updatePage(page)
  updateRowsPerPageSelect(size)
}

// kiểm tra cột lỗi
const isErrorcell = (field: string, data: any) => {
  return data.errors?.filter(x => x.location.toLowerCase() === field.toLowerCase()).length > 0
}

// thay đổi dữ liệu trên bảng
const changeCellvalue = (event: any, field: string, rowData: object) => {
  emit('changeCellvalue', event, field, rowData)
}
</script>

<template>
  <div class="table-box">
    <EasyDataTable
      ref="dataTable"
      alternating
      table-class-name="customize-table"
      :headers="headers"
      :items="items"
      :rows-per-page="pageSize"
      theme-color="#1849a9"
      item-key="id"
      fixed-expand
      hide-footer
      :body-row-class-name="rowClassName"
      @click-row="showRow"
    >
      <template
        #header-checkbox="header"
      >
        <div
          class="customize-header"
        >
          <VCheckbox
            v-model="selectedAll"
            :indeterminate="indeterminate"
            :label="header.text"
            :class="{ indeterminate }"
            :true-icon="() => {
              return h('div', { innerHTML: svgChecked })
            }"
            :indeterminate-icon="() => {
              return h('div', { innerHTML: svgIndeterminate })
            }"
            ripple
            @change="checkedAll(selectedAll)"
          />
        </div>
      </template>

      <template #header-select />
      <!--
        header => nội dung cột
        context  => nội dung hàng
      -->
      <template
        v-for="(items, id) in headers"
        #[`item-${items.value}`]="context"
        :key="id"
      >
        <span
          v-if="items.value === 'select' && context.isSuccess === false"
        >
          <VueFeather
            type="alert-triangle"
            size="18"
            class="color-icon-error"
          />
          <VTooltip
            activator="parent"
            location="bottom"
          >
            {{ context.messageErr }}
          </VTooltip>
        </span>

        <div
          v-else-if="items.value === 'checkbox'"
          class="player-wrapper"
        >
          <VCheckbox
            v-if="!context?.children?.length"
            v-model="selectedRows"
            multiple
            :value="context.id"
            :true-icon="() => {
              return h('div', { innerHTML: svgChecked })
            }"
            @change="checkedItem(selectedRows, context)"
          />
        </div>
        <VTextField
          v-else-if="isErrorcell(items.value, context) && isEditing"
          v-model="context[items.value]"
          class="input-edit-cell"
          type="text"
          :error="context.errors.length"
          @update:modelValue="changeCellvalue($event, items.value, context.key)"
        />

        <span
          v-else
          :class="{
            'color-text-error': isErrorcell(items.value, context),
          }"
        >
          {{ context[items.value] }}
        </span>
      </template>
    </EasyDataTable>
    <div class="customize-footer">
      <CmPagination
        :total-items="items.length"
        :current-page="currentPage"
        @pageClick="pageSizeChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables/common/table.cm" as *;
@use "@/styles/style-global.scss" as *;

// *****************************emplement**********************************************************//
.customize-table {
  /** css custom */
  // phần table
  --easy-table-border: #{$table-border};   // màu viền table
  // phần header
  --easy-table-header-font-size: #{$table-header-font-size};  // kích thước chữ header
  --easy-table-header-height: #{$table-header-height};     // chiều cao header
  --easy-table-header-font-color: #{$table-header-font-color};  // màu chữ header
  --easy-table-header-background-color: #{$table-header-background-color};  // màu nền header
  --easy-table-header-item-padding: #{$table-header-item-padding};  // padding header

  // phần body table
  --easy-table-row-border: #{$table-row-border}; // màu các row của phần body
  --easy-table-body-even-row-font-color: #{$table-body-even-row-font-color};  // màu chữ các hàng chẵn phần body
  --easy-table-body-even-row-background-color: #{$table-body-even-row-background-color}; // màu nền các hàng chẵn phần body
  --easy-table-body-row-font-color: #{$table-body-row-font-color};  // màu chữ các hàng lẻ phần body
  --easy-table-body-row-background-color: #{$table-body-row-background-color};  // màu nền các hàng lẻ phần body
  --easy-table-body-row-height: #{$table-body-row-height};// chiều cao các hàng phần body
  --easy-table-body-row-font-size: #{$table-body-row-font-size};  // kích thước chữ phần body
  --easy-table-body-row-hover-font-color: #{$table-body-row-hover-font-color}; // màu chữ khi hover vào các row phần body
  --easy-table-body-row-hover-background-color: #{$table-body-row-hover-background-color}; // màu nền khi hover vào các row phần body
  --easy-table-body-item-padding: #{$table-body-item-padding}; // padding các row phần body

  // Phần footer table
  --easy-table-footer-background-color: #{$table-footer-background-color}; // màu nền phần footer
  --easy-table-footer-font-color: #{$table-footer-font-color};  // màu chữ phần footer
  --easy-table-footer-font-size: #{$table-footer-font-size};  // kích thước chữ phần footer
  --easy-table-footer-padding: #{$table-footer-padding};  // padding phần footer
  --easy-table-footer-height: #{$table-footer-height}; // chiều cao phần footer
  --easy-table-rows-per-page-selector-width: #{$table-rows-per-page-selector-width}; // chiều dài phần select số lượng phần tử trên trang
  --easy-table-rows-per-page-selector-option-padding: #{$table-rows-per-page-selector-option-padding}; // padding option trong select số lượng phần tử
  --easy-table-rows-per-page-selector-z-index: #{$table-rows-per-page-selector-z-index}; // z-inder phần option bên trong select số lượng phần tử
  // scroll
  --easy-table-scrollbar-track-color: #{$table-scrollbar-track-color}; // màu track của thanh scroll ngang table footer
  --easy-table-scrollbar-color: #{$table-scrollbar-color};
  --easy-table-scrollbar-thumb-color: #{$table-scrollbar-thumb-color}; // màu thanh scroll
  --easy-table-scrollbar-corner-color: #{$table-scrollbar-corner-color};

  // loading
  --easy-table-loading-mask-background-color: #2d3a4f;

  overflow: hidden;
  border-start-end-radius: #{$table-border-radius-size};

  /** end css custom */

  border-start-start-radius: #{$table-border-radius-size};

  // box-shadow: #{$table-box-shadow};

  // override class
  th:first-child {
    border-radius: #{$table-border-radius-size 0 0};
  }

  th:last-child {
    border-radius: #{0 $table-border-radius-size 0 0};
  }

  .vue3-easy-data-table__main {
    background-color: unset;

    .header-text {
      font-weight: $table-header-font-weight;
    }
  }

  .vue3-easy-data-table__footer {
    border-radius: #{ 0 0 $table-border-radius-size $table-border-radius-size};
  }

  .indeterminate {
    color: #{$color-checkbox-indeterminate} !important;
    opacity: 1 !important;
  }
}

.hide-expand .expand-icon {
  visibility: hidden !important;
}

.hide-expand .can-expand {
  pointer-events: none;
}
</style>

