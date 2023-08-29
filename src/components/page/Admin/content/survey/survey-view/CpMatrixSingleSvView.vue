<script setup lang="ts">
/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  [name: string]: any
}
interface Props {
  data: question
  showContent: boolean
  showMedia: boolean
  showAnswerTrue: boolean
}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
}))
const { t } = window.i18n()
</script>

<template>
  <div class="view-Matrix-sg">
    <table width="100%">
      <tr class="tb-catg">
        <th>TIÊU ĐỀ</th>
        <th>Mức 1</th>
        <th>Mức 2</th>
      </tr>
      <tr class="tb-header">
        <th>Điểm</th>
        <th>10</th>
        <th>10</th>
      </tr>
      <tr class="tb-row">
        <td colspan="3">
          Sum: $180
        </td>
      </tr>
      <tr>
        <td>Nội dung 1</td>
        <td>Francisco Chang</td>
        <td>Mexico</td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss">
.view-Matrix-sg{
  table{
    border-collapse: collapse;
  }
  tr.tb-catg > th{
    padding-block: 16px;
    color: rgb(var(--v-gray-900));
    /* Text md/Medium */
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  }
  .tb-catg > th:first-child{
    padding-left: 16px;
  }
  .tb-catg > th:last-child{
    padding-right: 16px;
  }
  tr.tb-header{
    background: rgb(var(--v-primary-25));
    > th:first-child {
      padding-left: 16px;
    }
    > th:last-child {
      padding-right: 16px;
    }
    > th{
      padding-block: 8px;
      color: rgb(var(--v-gray-900));
      /* Text md/Medium */
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
    }
  }
  tr td{
    display:table-cell  !important;
  }
  tr.tb-row{
    > th:first-child {
      padding-left: 16px;
    }
  }
}
</style>
