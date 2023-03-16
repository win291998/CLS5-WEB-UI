<script setup lang="ts">
import type { ClickRowArgument, Header, Item } from 'vue3-easy-data-table'
import CmAccodion from '@/components/common/CmAccodion.vue'

interface Props {
  headers: Header[]
  items?: Item[]
  rowClassName?: string
  customId?: string
}

const props = withDefaults(defineProps<Props>(), ({
  headers: () => ([]),
  items: () => ([]),
  rowClassName: '',
  customId: 'id',
}))

const headers = reactive([
  { text: 'Thông tin chi tiết', value: 'label' },
  { text: '', value: 'content' },
  { text: 'Tổ chức', value: 'option_1', width: 300 },
  { text: 'Học tập', value: 'option_2' },
])

const items = reactive([
  {
    id: 0,
    label: 'CCCD/Hộ chiếu',
    content: '01234567890',
    option_1: {
      label: 'Cơ cấu tổ chức',
      icon: 'briefcase',
      colorClass: 'color-error',
      content: [
        { content: 'Cơ cấu tổ chức' }, { content: 'Cơ cấu tổ chức' },
      ],
    },
    option_2: {
      label: 'Khóa học',
      icon: 'book-open',
      colorClass: 'color-primary',
    },
  },
  {
    id: 1,
    label: 'Lần đăng nhập gần nhất',
    content: '03-02-2023',
    option_1: {
      label: 'Nhóm người dùng',
      icon: 'users',
      colorClass: 'color-warning',
      content: [
        { content: 'Nhóm người dùng' }, { content: 'Nhóm người dùng' },
      ],
    },
    option_2: {
      label: 'Kỳ thi',
      icon: 'edit-3',
      colorClass: 'color-success',
    },
  },
  {
    id: 2,
    label: 'KPI học tập',
    content: '1026.19h/150h - 684.13%',
    option_1: {
      label: 'Chức danh',
      icon: 'check',
      colorClass: 'color-success',
      content: [
        { content: 'Chức danh' }, { content: 'Chức danh' },
      ],
    },
    option_2: {
      label: 'Khảo sát',
      icon: 'edit',
      colorClass: 'color-warning',
    },
  },
  { id: 3, label: 'Tổng thời gian học/KPI học(%)', content: '0%', option_1: null, option_2: '' },
  { id: 4, label: 'Tổng thời gian học', content: '12h 24m 5s', option_1: null, option_2: '' },
  { id: 5, label: 'Số chứng chỉ', content: '3', option_1: null, option_2: '' },
])

const showRow = (item: ClickRowArgument) => {
  console.log(item)
}
</script>

<template>
  <EasyDataTable
    ref="dataTable"
    alternating
    table-class-name="customize-table-sub"
    :headers="headers"
    :items="items"
    theme-color="#1849a9"
    fixed-expand
    hide-footer
    @click-row="showRow"
  >
    <template
      #item-option_1="context"
    >
      <CmAccodion
        v-if="context?.option_1"
        :data="context?.option_1"
      />
    </template>
    <template
      #item-option_2="context"
    >
      <div class="d-flex align-center">
        <div>
          <VAvatar
            v-if="context?.option_2?.icon"
            size="32"
            class="mr-2"
            :class="[context?.option_2?.colorClass]"
            variant="tonal"
          >
            <VueFeather
              :type="context?.option_2?.icon"
              size="14"
              class="color-dark"
            />
          </VAvatar>
        </div>
        <div>
          {{ context?.option_2?.label }}
        </div>
      </div>
    </template>
  </EasyDataTable>
</template>

<style scoped lang="scss">
@use "@/styles/variables/common/table.cm" as *;
@use "@/styles/style-global.scss" as *;

.customize-table-sub {
  /** css custom */
  // phần table
  --easy-table-border: #{$table-sub-border};   // màu viền table
  // phần header
  --easy-table-header-font-size: #{$table-sub-header-font-size};  // kích thước chữ header
  --easy-table-header-height: #{$table-sub-header-height};     // chiều cao header
  --easy-table-header-font-color: #{$table-sub-header-font-color};  // màu chữ header
  --easy-table-header-background-color: #{$table-sub-header-background-color};  // màu nền header
  --easy-table-header-item-padding: #{$table-sub-header-item-padding};  // padding header

  // phần body table
  --easy-table-row-border: #{$table-sub-row-border}; // màu các row của phần body
  --easy-table-body-even-row-font-color: #{$table-sub-body-even-row-font-color};  // màu chữ các hàng chẵn phần body
  --easy-table-body-even-row-background-color: #{$table-sub-body-even-row-background-color}; // màu nền các hàng chẵn phần body
  --easy-table-body-row-font-color: #{$table-sub-body-row-font-color};  // màu chữ các hàng lẻ phần body
  --easy-table-body-row-background-color: #{$table-sub-body-row-background-color};  // màu nền các hàng lẻ phần body
  --easy-table-body-row-height: #{$table-sub-body-row-height};// chiều cao các hàng phần body
  --easy-table-body-row-font-size: #{$table-sub-body-row-font-size};  // kích thước chữ phần body
  --easy-table-body-row-hover-font-color: #{$table-sub-body-row-hover-font-color}; // màu chữ khi hover vào các row phần body
  --easy-table-body-row-hover-background-color: #{$table-sub-body-row-hover-background-color}; // màu nền khi hover vào các row phần body
  --easy-table-body-item-padding: #{$table-sub-body-item-padding}; // padding các row phần body

  // Phần footer table
  --easy-table-footer-background-color: #{$table-sub-footer-background-color}; // màu nền phần footer
  --easy-table-footer-font-color: #{$table-sub-footer-font-color};  // màu chữ phần footer
  --easy-table-footer-font-size: #{$table-sub-footer-font-size};  // kích thước chữ phần footer
  --easy-table-footer-padding: #{$table-sub-footer-padding};  // padding phần footer
  --easy-table-footer-height: #{$table-sub-footer-height}; // chiều cao phần footer
  --easy-table-rows-per-page-selector-width: #{$table-sub-rows-per-page-selector-width}; // chiều dài phần select số lượng phần tử trên trang
  --easy-table-rows-per-page-selector-option-padding: #{$table-sub-rows-per-page-selector-option-padding}; // padding option trong select số lượng
  --easy-table-rows-per-page-selector-z-index: #{$table-sub-rows-per-page-selector-z-index}; // z-inder phần option bên trong select số lượng phần tử
  // scroll
  --easy-table-scrollbar-track-color: #{$table-sub-scrollbar-track-color}; // màu track của thanh scroll ngang table footer
  --easy-table-scrollbar-color: #{$table-sub-scrollbar-color};
  --easy-table-scrollbar-thumb-color: #{$table-sub-scrollbar-thumb-color}; // màu thanh scroll
  --easy-table-scrollbar-corner-color: #{$table-sub-scrollbar-corner-color};

  // loading
  --easy-table-loading-mask-background-color: #2d3a4f;

  overflow: hidden;
  border-start-end-radius: #{$table-sub-border-radius-size};

  /** end css custom */

  border-start-start-radius: #{$table-sub-border-radius-size};

  // box-shadow: #{$table-sub-box-shadow};

  // override class
  th:first-child {
    border-radius: #{$table-sub-border-radius-size 0 0};
  }

  th:last-child {
    border-radius: #{0 $table-sub-border-radius-size 0 0};
  }

  .vue3-easy-data-table__main {
    background-color: unset;

    .header-text {
      font-weight: $table-sub-header-font-weight;
    }
  }

  .vue3-easy-data-table__footer {
    border-radius: #{ 0 0 $table-sub-border-radius-size $table-sub-border-radius-size};
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
