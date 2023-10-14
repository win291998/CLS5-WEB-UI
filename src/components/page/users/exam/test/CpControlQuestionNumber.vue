<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'
import { myExamManagerStore } from '@/stores/user/exam/exam'

// const props = withDefaults(defineProps<Props>(), ({
// }))

const emit = defineEmits<Emit>()

// interface Props {

//   // questions?: any
// }

/** ** Interface */
interface Emit {
  (e: 'startExam'): void
}
const { t } = window.i18n()
const route = useRoute()
const router = useRouter()
const myExamManagerManager = myExamManagerStore()
const { questionStore, totalQuestion } = storeToRefs(myExamManagerManager)
const { confirmSubmit, handleClickQuestion } = myExamManagerManager

function totalIsAnswered() {
  return questionStore.value?.filter((item: any) => item.isAnswered).length
}
</script>

<template>
  <div class="mt-point">
    <div class="text-bold-lg mb-4 text-center">
      Danh sách câu hỏi
    </div>
    <div class="mt-point-list mxn-2">
      <div
        v-for="(item, idx) in questionStore"
        :key="idx"
        class="mt-point-item flex-center"
        :class="{ 'item-select': item.isAnswered, 'item-flag': item.isMark }"
        @click="handleClickQuestion(item)"
      >
        {{ idx + 1 }}
      </div>
    </div>
    <div class="d-flex flex-wrap">
      <div class="d-flex align-items-center mr-4 my-2">
        <div class="mr-2">
          <VIcon
            icon="tabler:square-filled"
            color="primary"
            size="16"
          />
        </div>
        <div>{{ t('answered') }}</div>
      </div>
      <div class="d-flex align-items-center mr-4 my-2">
        <div class="mr-2">
          <VIcon
            icon="tabler:square"
            size="16"
          />
        </div>
        <div>{{ t('no-answer') }}</div>
      </div>
      <div class="d-flex align-items-center my-2">
        <div class="mr-2">
          <VIcon
            icon="tabler:square"
            color="warning"
            size="16"
          />
        </div>
        <div>{{ t('mark') }}</div>
      </div>
    </div>
    <div class="text-semibold-md text-center my-6">
      {{ t("total-question-answered") }}: {{ totalIsAnswered() }}/{{ totalQuestion }} {{ t('sentence').toLowerCase() }}
    </div>
    <CmButton
      color="success"
      class="w-100 mt-2"
      :title="t('submit')"
      @click="confirmSubmit"
    />
    <CmButton
      color="secondary"
      variant="outlined"
      class="w-100 mt-2"
      :title="t('Màn hình kết quả')"
      @click="router.push({ name: 'my-test-result', params: { id: route.params.id } })"
    />
  </div>
</template>
