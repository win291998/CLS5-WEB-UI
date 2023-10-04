<script lang="ts" setup>
import QuestionService from '@/api/question'
import CpModificationQuestion from '@/components/page/gereral/page/CpModificationQuestion.vue'
import { load } from '@/stores/loadComponent.js'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import type { Any } from '@/typescript/interface'
import MethodsUtil from '@/utils/MethodsUtil'

const store = load()
const { unLoadComponent } = store
const { t } = window.i18n()

const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
if (route.name === 'question-edit' && Number(route.params.id)) {
  getInforQuestion()
  isEdit.value = true
}
isEdit.value = route?.name === 'question-edit'

const dataQuestion = ref<Any | null>({
  id: null,
  content: '',
  isGroup: false,
  urlFile: null,
  isAutoApprove: true,
  levelId: null,
  typeId: 1,
  topicId: null,
  answers: [],
  questions: [],
})
async function postData(value: any, id: any) {
  await MethodsUtil.requestApiCustomV5(QuestionService.AddQuestion, isEdit.value ? TYPE_REQUEST.PUT : TYPE_REQUEST.POST, value)
    .then(({ data, status }: any) => {
      window.notificationApiStatus(status, t)
      unLoadComponent(id)
      onCancel()
    })
}
async function getInforQuestion() {
  await MethodsUtil.requestApiCustomV5(QuestionService.GetDetailQuestion(Number(route.params.id)), TYPE_REQUEST.GET).then(({ data }: any) => {
    dataQuestion.value = data
  })
}
function onCancel() {
  router.push({ name: 'question-list' })
}
</script>

<template>
  <CpModificationQuestion
    v-model:data="dataQuestion"
    :is-edit="isEdit"
    @update:data="postData"
    @cancel="onCancel"
  />
</template>
