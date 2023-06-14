<script lang="ts" setup>
import { contentManagerStore } from '@/stores/admin/course/content'
import MethodsUtil from '@/utils/MethodsUtil'
import { StatusTypeCourse } from '@/constant/data/status.json'
import DateUtil from '@/utils/DateUtil'
import CmTableGroup from '@/components/common/CmTableGroup.vue'

const CpActionHeaderPage = defineAsyncComponent(() => import('@/components/page/gereral/CpActionHeaderPage.vue'))
const CpMdFeedBack = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdFeedBack.vue'))
const CmChip = defineAsyncComponent(() => import('@/components/common/CmChip.vue'))
const CpConfirmDialog = defineAsyncComponent(() => import('@/components/page/gereral/CpConfirmDialog.vue'))
const CpHeaderAction = defineAsyncComponent(() => import('@/components/page/gereral/CpHeaderAction.vue'))
const CmButton = defineAsyncComponent(() => import('@/components/common/CmButton.vue'))
const CmDropDown = defineAsyncComponent(() => import('@/components/common/CmDropDown.vue'))

/** store */
/**
 * Store
 */
const storeContentManager = contentManagerStore()
const { items, isShowModelFeedback, feedbackContent, isShowDialogNotiDelete, disabledDelete, disabledEdit } = storeToRefs(storeContentManager)
const { getListContentCourse, confirmDialogDelete, handlerActionHeader, handleSearch, selectedRows, deleteItems, actionItemUserReg, checkMove } = storeContentManager

const groupOptions = {
  allowEmptySelect: false,
  collapsable: false,
  enabled: false,
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const headers = reactive([
  { text: '', value: 'checkbox' },
  { text: t('content'), value: 'name', key: true },
  { text: t('author-name'), value: 'fullname', type: 'custom' },
  { text: t('type-content'), value: 'contentArchiveTypeName', type: 'custom' },
  { text: t('status'), value: 'statusId', type: 'custom' },
  { text: t('duration-time'), value: 'time', type: 'custom' },
  { text: t('create-day'), value: 'registerDate', type: 'custom' },
  { text: '', value: 'actions', width: 150 },
])
const actionUpdate = [
  {
    title: t('Update-user-info'),
    icon: 'tabler:folder-plus',
    action: () => {
      // router.push({ name: 'admin-organization-user-import-file-update-user-infor' })
    },
  },
  {
    title: t('update-tile-from-file'),
    icon: 'tabler:folder-plus',
    action: () => {
      // router.push({ name: 'admin-organization-user-import-file-update-user-title' })
    },
  },

]
function handleClickRow(e: any) {
  // console.log(e)
}

function splitRow() {
  // console.log(headers)
  headers.splice(1, 1)
}

// hàm trả về các loại action từ header filter
function handleClickBtn(type: string) {
  switch (type) {
    // case 'fillter':
    //   isShowFilter.value = !isShowFilter.value
    //   break
    case 'delete':
      deleteItems()
      break

      // case 'edit':
      //   approveCourses()
      //   break

    default:
      break
  }
}
onMounted(async () => {
  await getListContentCourse()
})
</script>

<template>
  <div class="mt-6">
    <div>
      <CpActionHeaderPage
        :title="t('content-list')"
      >
        <template #actions>
          <div
            cols="12"
            md="3"
            class="d-flex justify-end  mr-2"
          >
            <CmButton
              :title="t('setting-point')"
              color="primary"
              variant="tonal"
              @click="handlerActionHeader('setting-point')"
            />
          </div>
          <div
            cols="12"
            md="3"
            class="d-flex justify-end  mr-2"
          >
            <CmButton
              :title="t('approve-content')"
              color="success"
              @click="handlerActionHeader('setting-point')"
            />
          </div>
          <div
            cols="12"
            md="3"
            class="d-flex justify-end  mr-2"
          >
            <CmDropDown
              :title="t('add-content')"
              variant="tonal"
              color="primary"
              :list-item="actionUpdate"
              :type="2"
              icon="tabler:chevron-down"
            />
          </div>
        </template>
      </CpActionHeaderPage>
    </div>
    <div>
      <CpHeaderAction
        is-delete
        :is-fillter="false"
        :disabled-delete="disabledDelete"
        @click="handleClickBtn"
        @search="handleSearch"
      >
        <template #actionLeft>
          <CmButton
            :disabled="disabledEdit"
            size="40"
            color="primary"
            @click="handleClickBtn('edit')"
          >
            <VIcon icon="fe:edit" />
          </CmButton>
        </template>
      </CpHeaderAction>
    </div>
    <CmTableGroup
      :group-options="groupOptions"
      :headers="headers"
      :items="items"
      custom-id="courseContentId"
      disiable-pagination
      @handleClickRow="handleClickRow"
      @update:selected="selectedRows"
    >
      <template #rowItem="{ col, context }">
        <div v-if="col === 'contentArchiveTypeName'">
          {{ t(context[col]) }}
        </div>
        <div v-if="col === 'time'">
          {{ DateUtil.formatSecond(context.time) }}
        </div>
        <div v-if="col === 'registerDate'">
          <span>{{ DateUtil.formatDateToDDMM(context.registerDate) }}</span>
        </div>
        <div v-if="col === 'statusId'">
          <CmChip
            class="ma-2"
            :color="MethodsUtil.checkStatus(context[col], StatusTypeCourse)?.color"
          >
            <VIcon
              start
              icon="carbon:dot-mark"
              size="12"
            />
            <span>{{ t(MethodsUtil.checkStatus(context[col], StatusTypeCourse)?.name) }}</span>
          </CmChip>
        </div>
      </template>
      <template #actionDrop="{ context }">
        <VListItem
          :disabled="!checkMove(context, true)"
          @click="actionItemUserReg([{ name: 'MoveUp' }, context])"
        >
          <VListItemTitle>
            <VIcon
              icon="tabler:corner-left-up"
              :size="18"
              class="mr-2"
              color="purple"
            />
            <span>{{ t('MoveUp') }}</span>
          </VListItemTitle>
        </VListItem>
        <VListItem
          :disabled="!checkMove(context, false)"
          @click="actionItemUserReg([{ name: 'MoveDown' }, context])"
        >
          <VListItemTitle>
            <VIcon
              icon="tabler:corner-right-down"
              :size="18"
              class="mr-2"
              color="purple"
            />
            <span>{{ t('MoveDown') }}</span>
          </VListItemTitle>
        </VListItem>
      </template>
    </CmTableGroup>
    <CpMdFeedBack
      v-model:is-show-modal-feed-back="isShowModelFeedback"
      :data-feed-back="feedbackContent"
    />
    <CpConfirmDialog
      v-model:is-dialog-visible="isShowDialogNotiDelete"
      :type="2"
      variant="outlined"
      :max-width="400"
      :confirmation-msg-sub-title="t('warning-delete-course')"
      :confirmation-msg="t('Delete-course')"
      @confirm="confirmDialogDelete"
    />
  </div>
</template>
