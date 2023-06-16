<script lang="ts" setup>
import { contentManagerStore } from '@/stores/admin/course/content'
import { courseApproveManagerStore } from '@/stores/admin/course/approve'
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
const CpMdRatioPointContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdRatioPointContent.vue'))
const CpContentApprove = defineAsyncComponent(() => import('@/components/page/Admin/course/modify/content/CpContentApprove.vue'))
const CpActionFooterEdit = defineAsyncComponent(() => import('@/components/page/gereral/CpActionFooterEdit.vue'))
const CpMdUpdateThematicContent = defineAsyncComponent(() => import('@/components/page/Admin/course/modal/CpMdUpdateThematicContent.vue'))

/** store */
/**
 * Store
 */
const storeContentManager = contentManagerStore()
const { items, isShowModelFeedback, feedbackContent, isShowDialogNotiDelete, disabledDelete, disabledEdit, data, viewMode, isShowModalUpdateThematic } = storeToRefs(storeContentManager)
const { getListContentCourse, confirmDialogDelete, handlerActionHeader, showUpdateThematicModal, handleSearch, selectedRows, deleteItems, actionItemUserReg, checkMove, approveContent } = storeContentManager
const storeCourseApproveManager = courseApproveManagerStore()
const { idModalSendRatioPoint } = storeToRefs(storeCourseApproveManager)
const groupOptions = {
  allowEmptySelect: false,
  collapsable: false,
  enabled: false,
}

/** lib */
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const router = useRouter()

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
const actionApprove = [
  {
    title: t('chosen-content'),
    icon: 'prime-check-circle',
    action: approveMultiContent,
  },
  {
    title: t('sent-content'),
    icon: 'tabler:send',
    action: () => {
      viewMode.value = 'approve'
    },
  },

]
function handleClickRow(e: any) {
  // console.log(e)
}

async function approveMultiContent() {
  const listId = data.value.selectedRowsIds.map((item: any) => ({
    id: item,
  }))
  await approveContent(listId).then(() => {
    getListContentCourse()
  })
}
function onCancel() {
  router.replace({ name: 'admin-course' })
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

    case 'edit':
      showUpdateThematicModal()
      break

    default:
      break
  }
}
onMounted(async () => {
  await getListContentCourse()
})
onUnmounted(() => {
  viewMode.value = 'view'
})
</script>

<template>
  <div
    v-if="viewMode === 'view'"
    class="mt-6"
  >
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
            <CmDropDown
              :title="t('approve-content')"
              variant="tonal"
              color="success"
              :list-item="actionApprove"
              :type="2"
              icon="tabler:chevron-down"
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
    <div class="mb-6">
      <CmTableGroup
        key-check-parent-row="contentArchiveTypeId"
        :value-check-parent-row="13"
        :group-options="groupOptions"
        :headers="headers"
        :items="items"
        custom-id="courseContentId"
        disiable-pagination
        @handleClickRow="handleClickRow"
        @update:selected="selectedRows"
      >
        <template #rowItem="{ col, context }">
          <div v-if="col === 'fullname'">
            {{ MethodsUtil.formatFullName(context.firstName, context.lastName) }}
          </div>
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
    </div>
    <div>
      <CpActionFooterEdit
        is-cancel
        :title-cancel="t('come-back')"
        @onCancel="onCancel"
      />
    </div>
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
    <CpMdRatioPointContent
      v-model:is-dialog-visible="idModalSendRatioPoint"
    />
    <CpMdUpdateThematicContent
      v-model:isShowModalUpdateThematic="isShowModalUpdateThematic"
    />
  </div>
  <div
    v-else-if="viewMode === 'approve'"
    class="mt-6"
  >
    <CpContentApprove />
  </div>
</template>
