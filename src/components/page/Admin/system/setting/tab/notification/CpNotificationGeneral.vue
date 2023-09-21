<script lang="ts" setup>
import type { Item } from 'vue3-easy-data-table'
import CmTable from '@/components/common/CmTable.vue'
import CmCheckBox from '@/components/common/CmCheckBox.vue'

interface Props {
  items: Item[]
}
const props = withDefaults(defineProps<Props>(), {})
const { t } = window.i18n()
const headers = [
  { text: t('group-content'), value: 'name', type: 'custom' },
  { text: t('notification-content'), value: 'content', type: 'custom' },
  { text: t('send-mail'), value: 'mail', type: 'custom' },
  { text: t('system-notification'), value: 'system', type: 'custom' },
  { text: t('Mobile App'), value: 'mobile', type: 'custom' },
]
</script>

<template>
  <div class="general-configuration">
    <CmTable
      :items="items"
      :headers="headers"
      is-border-row
      style="height: auto;"
    >
      <template #rowItem="{ col, context }">
        <div
          v-if="col === 'name'"
        >
          {{ t(context.code) }}
        </div>
        <div v-if="col === 'content'">
          <div
            v-for="(content, index) in context.items"
            :key="`content${index}`"
            class="column-child"
          >
            <div class="d-flex justify-between ">
              <div class="text-break">
                {{ t(content.code) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="col === 'mail'">
          <div
            v-for="(item, index) in context.items"
            :key="`sendMail${index}`"
            class="column-child"
          >
            <div class="d-flex justify-center w-100">
              <CmCheckBox
                v-model="item.isMailSending"
                :disabled="item.isMailSending !== null ? false : true"
              />
            <!-- @change="changeValue(context.originalIndex, index, $event, 'isMailSending')" -->
            </div>
          </div>
        </div>
        <div v-if="col === 'system'">
          <div
            v-for="(item, index) in context.items"
            :key="`sendSystem${index}`"
            class="column-child"
          >
            <div class="d-flex justify-center w-100">
              <CmCheckBox
                v-model="item.isMailSending"
                :disabled="item.isMailSending !== null ? false : true"
              />
            <!-- @change="changeValue(context.originalIndex, index, $event, 'isMailSending')" -->
            </div>
          </div>
        </div>
        <div v-if="col === 'mobile'">
          <div
            v-for="(item, index) in context.items"
            :key="`sendMobile${index}`"
            class="column-child"
          >
            <div class="d-flex justify-center w-100">
              <CmCheckBox
                v-model="item.isMailSending"
                :disabled="item.isMailSending !== null ? false : true"
              />
            <!-- @change="changeValue(context.originalIndex, index, $event, 'isMailSending')" -->
            </div>
          </div>
        </div>
      </template>
    </CmTable>
  </div>
</template>

<style lang="scss">
@use "/src/styles/style-global" as *;
.general-configuration {
  .direction-left {
    padding-right: 0 !important;
  }

  .column-child:first-child{
    border-top: none;
    margin: -0.6em -0.75em 0 -0.75em;
  }
  .column-child:last-child{
    border-top: 1px solid $color-gray-200;
    margin: 0 -0.75em -0.75em -0.75em;
  }
  .column-child:first-child:last-child{
    border-top: none;
    margin: -0.75em -0.75em -0.75em -0.75em;
  }
  .column-child{
    border-top: 1px solid $color-gray-200;
    padding: 0.75em 0.75em 0.75em 0.75em;
    margin: 0 -0.75em 0 -0.75em;
    height: 60px;
    display: flex;
    align-items: center;
  }
}
</style>
