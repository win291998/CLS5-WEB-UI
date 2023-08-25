<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'

/**
 * Xem chi tiết các loại câu hỏi
 */
interface question {
  content: string
  answers: Array<any>
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
    answers: [],
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
}))
const { t } = window.i18n()
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}
</script>

<template>
  <div class="content-view">
    <div
      v-if="showContent"
      class="text-medium-md mb-5"
      v-html="data.content"
    />
    <div
      v-if="showMedia && data.urlFile"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="data.urlFile"
      />
    </div>
    <div
      v-for="item in data.answers"
      :key="item.id"
      class="w-100"
    >
      <div
        class="box-answer "
        :class="{ hidden: !showAnswerTrue }"
      >
        <div
          v-if="item.left"
          class="box-left"
          v-html="item.left.content"
        />
        <div
          v-else
          class="box-left-empty"
        />
        <div
          v-if="item.right"
          class="box-right"
          :class="[item.left ? 'box-right' : 'box-right-empty']"
          v-html="item.right.content"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content-view{
  .view-media{
    width: 60%;
  }

  .box-answer{
    display: flex;
    width: 100%;
    margin-bottom: 12px;
    .box-left{
      padding: 16px;
      border: 2px solid rgb(var(--v-primary-600));
      border-radius: 8px 0px 0px 8px;
      border-right-width: 1px;
      width: 50%;
    }
    .box-left-empty{
      padding: 16px;
      border: unset;
      border-radius: 8px 0px 0px 8px;
      border-right-width: 1px;
      width: 50%;
    }
    .box-right{
      padding: 16px;
      border-radius: 0px 8px 8px 0px;
      border: 2px solid rgb(var(--v-primary-600));
      border-left-width: 1px;
      width: 50%;
    }
    .box-right-empty{
      padding: 16px;
      border-radius: 0px 8px 8px 0px;
      border: 2px solid rgb(var(--v-primary-600));
      width: 50%;
    }
  }
  .box-answer.hidden{
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 12px;
    .box-left{
      padding: 16px;
      border: 2px solid rgb(var(--v-primary-600));
      border-radius: 8px 0px 0px 8px;
      width: 48%;
    }
    .box-right{
      padding: 16px;
      border-radius: 0px 8px 8px 0px;
      border: 2px solid rgb(var(--v-primary-600));
      width: 48%;
    }
  }
}
</style>
