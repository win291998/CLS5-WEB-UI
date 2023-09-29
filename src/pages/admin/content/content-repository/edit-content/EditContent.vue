<script lang="ts" setup>
import CourseService from '@/api/course'
import toast from '@/plugins/toast'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'

const CpEditAudio = defineAsyncComponent(() => import('@/components/page/Admin/content/content-repository/edit-content/type/CpEditAudio.vue'))
const CpEditContent = defineAsyncComponent(() => import('@/components/page/Admin/content/content-repository/edit-content/type/CpEditContent.vue'))
const CpEditDocument = defineAsyncComponent(() => import('@/components/page/Admin/content/content-repository/edit-content/type/CpEditDocument.vue'))
const CpEditIframeContent = defineAsyncComponent(() => import('@/components/page/Admin/content/content-repository/edit-content/type/CpEditIframeContent.vue'))
const CpEditScorm = defineAsyncComponent(() => import('@/components/page/Admin/content/content-repository/edit-content/type/CpEditScorm.vue'))
const CpEditVideo = defineAsyncComponent(() => import('@/components/page/Admin/content/content-repository/edit-content/type/CpEditVideo.vue'))

const route = useRoute()
const router = useRouter()
const component = ref()
const { t } = window.i18n()
onMounted(() => {
  switch (route.params?.type) {
    case 'text-content':
      component.value = CpEditContent
      break
    case 'video-content':
      component.value = CpEditVideo
      break
    case 'document-content':
      component.value = CpEditDocument
      break
    case 'audio-content':
      component.value = CpEditAudio
      break
    case 'scorm-content':
      component.value = CpEditScorm
      break
    case 'iframe-content':
      component.value = CpEditIframeContent
      break
    default:
      break
  }
})

const contentData = ref({
  acceptDownload: false,
  archiveTypeId: null as number | null,
  authorModel: [],
  courseId: 0,
  description: '',
  isApprove: false,
  isPdf: true,
  isRewind: true,
  name: '',
  themeticId: 0,
  time: null as number | null,
  timeTypeId: null as number | null,
  topicCourseId: null as number | null,
  url: null,
  urlFileName: '',
})
async function editContent(data: Any, unload: any) {
  let res
  if (route.params.id)
    res = MethodsUtil.requestApiCustom(CourseService.PostUpdateContent, TYPE_REQUEST.POST, contentData.value)
  else
    res = MethodsUtil.requestApiCustom(CourseService.PostCreateContent, TYPE_REQUEST.POST, contentData.value)
  res.then((result: Any) => {
    toast('SUCCESS', t(result.message))
    router.push({ name: 'content-repository' })
    unload()
  }).catch((err: Any) => {
    toast('ERROR', window.getErrorsMessage(err.response.data.errors, t))
    unload()
  })
}

function getDetailContent() {
  MethodsUtil.requestApiCustom(CourseService.GetContentArchiveById, TYPE_REQUEST.GET, { id: route.params.id }).then((res: Any) => {
    contentData.value = res?.data
  })
}

onMounted(() => {
  console.log(route.params.id)

  if (route.params.id)
    getDetailContent()
})
</script>

<template>
  <div>
    <Component
      :is="component"
      v-model:content="contentData"
      @update:content="editContent"
    />
  </div>
</template>
