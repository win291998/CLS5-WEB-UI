<script setup lang="ts">
import CmButton from '@/components/common/CmButton.vue'

const props = withDefaults(defineProps<Props>(), ({
}))

const emit = defineEmits<Emit>()

interface Props {

  questionStore?: any
  totalQuestion?: any
}

/** ** Interface */
interface Emit {
  (e: 'confirmSubmit'): void
  (e: 'handleClickQuestion', question: any, isConfirm?: boolean, pos?: number): void
}
const { t } = window.i18n()
const route = useRoute()
const router = useRouter()

function totalIsAnswered() {
  return props.questionStore?.filter((item: any) => item.isAnswered).length
}
</script>

<template>
  <div class="cm-point">
    <div class="text-bold-lg mb-4 text-center">
      Danh sách câu hỏi
    </div>
    <div class="cm-point-list mxn-2">
      <div
        v-for="(item, idx) in questionStore"
        :key="idx"
        class="cm-point-item flex-center"
        :class="{ 'item-select': item.isAnswered, 'item-flag': item.isMark }"
        @click="() => emit('handleClickQuestion', item, true, idx)"
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
      @click="() => emit('confirmSubmit')"
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

<style lang="scss">
  .cm-point{
      padding: 24px;
      border-radius: 8px;
      border: 1px solid rgb(var(--v-gray-300));
      background:  rgb(var(--v-gray-50));
    .cm-point-list{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .cm-point-item{
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 2px solid rgb(var(--v-gray-500));
        background: #fff;
        margin: 8px ;
        &.item-select{
          color: #fff;
          border: 2px solid rgb(var(--v-primary-600));
          background:  rgb(var(--v-primary-600));
        }
        &.item-flag{
          border: 2px solid rgb(var(--v-warning-500));
        }
      }
    }
  }
</style>
