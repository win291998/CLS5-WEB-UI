<script setup lang="ts">
import CmDialogs from '@/components/common/CmDialogs.vue'
import CmCanvas from '@/components/common/CmCanvas.vue'
import CourseService from '@/api/course/index'
import MethodsUtil from '@/utils/MethodsUtil'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import StringUtil from '@/utils/StringUtil'
import DateUtil from '@/utils/DateUtil'
import CmImg from '@/components/common/CmImg.vue'
import { Themes } from '@/typescript/class/Theme'
import CmButton from '@/components/common/CmButton.vue'

const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

interface Props {
  isDialogVisible: boolean
  courseId?: number
  courseName?: string
}

interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'confirm', data: any): void
}
const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
const isShowMdCertification = ref(false)
const isShowMdCongrats = ref(false)
async function onCancel() {
  emit('update:isDialogVisible', false)
  isShowMdCertification.value = false
  isShowMdCongrats.value = false
}
async function onConfirm() {
//
}

const serverfile = window.SERVER_FILE
const certificateInfo = ref({
  certificationId: null,
  certificationTemplateId: null,
  certificationTemplateName: null,
})
const certificatePreviewData = ref<any>({})
const user = window.userData
const modalCanvas = ref()
async function checkCertificate() {
  const res = await MethodsUtil.requestApiCustom(CourseService.GetCheckCertificateCondition, TYPE_REQUEST.GET, { courseIds: props.courseId })
  if (res?.data[0] && res?.data[0]?.statusId !== 4)
    return
  const userId = user.id
  const params = {
    DetailUserId: userId,
    typeId: 1,
  }
  const { data } = await MethodsUtil.requestApiCustom(CourseService.GetListCertificationCourse, TYPE_REQUEST.GET, params)

  if (data && data.length > 0) {
    certificateInfo.value = data.find((item: any) => item.resourceId === props.courseId)
    if (certificateInfo)
      viewCertificationUser(certificateInfo.value.certificationId, certificateInfo.value.certificationTemplateId)

    else
      isShowMdCongrats.value = true
  }
  else if (res?.data[0] && res?.data[0]?.statusId === 4) {
    isShowMdCongrats.value = true
  }
}
async function viewCertificationUser(certificateId: any, templateId: any) {
  const params = {
    userId: window.userData.id ? Number(window.userData.id) : null,
    certificationId: certificateId,
  }
  const { data } = await MethodsUtil.requestApiCustom(CourseService.GetCertificateUserInfo, TYPE_REQUEST.GET, params)
  console.log(data)
  const detailCertificate = await MethodsUtil.requestApiCustom(CourseService.GetCertificationDetail, TYPE_REQUEST.GET, { id: templateId })
  console.log(detailCertificate)

  if (detailCertificate) {
    certificatePreviewData.value = {
      ...detailCertificate.data,
      content: JSON.parse(detailCertificate.data.content),
    }
    if (data) {
      certificatePreviewData.value.certificateGuid = data?.certificateGuid
      certificatePreviewData.value.content.childs.forEach((item: any) => {
        switch (item.type) {
          case 'companyName':
            item.format.content = data.portalTitle ? data.portalTitle : ''
            break
          case 'userName':
            item.format.content = StringUtil.formatFullName(data.firstName, data.lastName)
            break
          case 'email':
            item.format.content = data.email ? data.email : ''
            break
          case 'courseName':
            item.format.content = data.resourceName ? data.resourceName : ''
            break
          case 'level':
            item.format.content = data.ratingScaleLevelName ? data.ratingScaleLevelName : ''
            break
          case 'gender':
            item.format.content = data.gender ? 'Nam' : 'Nữ'
            break
          case 'birthday':
            item.format.content = data.birthDay ? data.birthDay : ''
            break
          case 'processName':
            item.format.content = ''
            break
          case 'startDate':
            item.format.content = data.degreeDate ? DateUtil.formatDateToDDMM(data.degreeDate) : t('unlimited')
            break
          case 'endDate':
            item.format.content = data.expirationDate ? DateUtil.formatDateToDDMM(data.expirationDate) : t('unlimited')
            break
          case 'certificateNumber':
            item.format.content = data?.certificateNumber ? `${data.certificateNumber}` : ''
            break
          case 'certificateGuid':
            item.format.content = data?.certificateGuid ? `${data.certificateGuid}` : ''
            break
          case 'userCode':
            item.format.content = data?.userCode ? `${data.userCode}` : ''
            break
          default:

            // code block
        }
      })
    }
  }

  isShowMdCertification.value = true
}
function exportImg() {
  const canvas: any = document.getElementById(`canvas-${certificateInfo.value.certificationId}}`)
  if (canvas) {
    const imageUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const imgName = certificateInfo.value.certificationTemplateName
      ? `${t('certificate-management')} ${certificateInfo.value.certificationTemplateName}.png`
      : `${t('certificate-management')}.png`
    link.download = imgName
    link.href = imageUrl
    link.click()
  }
}
watch(() => props.isDialogVisible, async isShow => {
  if (isShow)
    await checkCertificate()
})
</script>

<template>
  <CmDialogs
    id="modalCanvas"
    ref="modalCanvas"
    :is-div-space="false"
    is-hide-footer
    :is-dialog-visible="isShowMdCertification"
    close-on-back
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <CmCanvas
      :id="`canvas-${certificateInfo.certificationId}}`"
      :background="certificatePreviewData.content.background"
      :width="certificatePreviewData.content.size.width"
      :height="certificatePreviewData.content.size.height"
      :content="certificatePreviewData.content.childs"
    />
    <div class="d-flex justify-end mt-4 mb-2">
      <CmButton
        :title="t('download-certificate')"
        class-name="sidebarToggle"
        @click="exportImg"
      />
    </div>
  </CmDialogs>
  <CmDialogs
    :is-dialog-visible="isShowMdCongrats"
    close-on-back
    :is-div-space="false"
    is-hide-footer
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <div class="d-flex flex-column justify-content-center align-items-center">
      <CmImg :src="Themes.imageSystem.courseComplete" />

      <h3 class="text-primary mt-2 flex-center">
        {{ t('congratulations') }} {{ StringUtil.formatFullName(user.firstName, user.lastName) }}!
      </h3>

      <p class="text-regular-md flex-center">
        {{ t('completed-course') }} {{ courseName }}
      </p>
    </div>
  </CmDialogs>
</template>
