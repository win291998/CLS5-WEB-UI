<script setup lang="ts">
import CpMediaContent from '@/components/page/gereral/CpMediaContent.vue'
import CmButton from '@/components/common/CmButton.vue'

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
  isShuffle: boolean
  disabled?: boolean // trạng thái chọn
  isShowAnsTrue: boolean // hiện thị câu đúng
  isShowAnsFalse: boolean // hiện thị câu sai
  isSentence?: boolean // trạng thái câu
  isHideNotChoose?: boolean // ẩn hiện thị đáp án các câu không chọn
  typeShow?: number // trạng thái hiện thị
  numberQuestion?: number | null
  totalPoint?: number | null
  point?: number | null
  customKeyValue?: string
  isReview?: boolean
  isGroup?: boolean // câu trong nhóm

}
const props = withDefaults(defineProps<Props>(), ({
  data: () => ({
    content: '',
    answers: [],
  }),
  showContent: true,
  showMedia: true,
  showAnswerTrue: true,
  isShuffle: true,
  disabled: false,
  isSentence: false,
  isShowAnsTrue: false,
  isShowAnsFalse: false,
  isHideNotChoose: false,
  numberQuestion: 0,
  totalPoint: 0,
  point: 0,
  customKeyValue: 'answeredValue',
}))
const emit = defineEmits<Emit>()
interface Emit {
  (e: 'update:model-value', val: any): void
  (e: 'update:data', val: any): void
  (e: 'update:isAnswered', val: any): void
  (e: 'update:isDataChange', val?: any): void
}
const { t } = window.i18n()
function getIndex(position: number) {
  return `${String.fromCharCode(65 + position - 1)}.`
}

const questionValue = ref<question>({
  content: '',
  answers: [],
})
function checkAnsTrueClass(detalAns: any) {
  return (props.isShowAnsTrue && (detalAns.correctAnswer === detalAns[props.customKeyValue]) && (!props.isHideNotChoose || (props.isHideNotChoose && detalAns[props.customKeyValue])))
}
function checkAnsFalseClass(detalAns: any) {
  return (props.isShowAnsFalse && !detalAns.isTrue && detalAns[props.customKeyValue])
}

/** **drag drop */
const dragElement = ref<any>(null)
const positions = ref<any>({
  x: null,
  y: null,
})
function dragDelta(evt: any) {
  // console.log(evt)
}

// clone đối tượng kéo thêm vào đối tượng chứa
function startDrag(evt: any) {
  if (props.isReview)
    return

  // this.$emit('saveDragSelectQuestionId', this.questionId)
  dragElement.value = evt.target.cloneNode(true)
  dragElement.value.id = `drag${dragElement.value.id.replace('answer', '')}`
  evt.dataTransfer.setData('sourceId', dragElement.value.id)
}

// kết thúc kéo thả
function dragEnd(evt: any) {
  // if (isReview.value || this.isPreview)
  //   return
  if (props.isReview)
    return
  dragElement.value.parentNode?.removeChild(dragElement.value)
  dragElement.value = null
  evt.target.style.opacity = '1'
}

// thả

function drop(evt: any) {
  // if (this.isReview || this.isPreview)
  //   return
  // if (this.dragSelectedQuestionId !== this.questionId)
  //   return
  const dataTrangferId = evt.dataTransfer.getData('sourceId')
  const target = evt.target.closest('.matching-answer-wrapper')
  const rightItems = target.getElementsByClassName('box-right')
  const leftItems = target.getElementsByClassName('box-left')

  if (leftItems.length === 0)
    return

  if (rightItems.length > 0) {
    const dropItem = rightItems[0]
    const dragItem = document.getElementById(
      `answer${dataTrangferId.replace('drag', '')}`,
    )

    if (dropItem && dragItem) {
      // check parent node để thay đổi trạng thái giao diện nối hay không nối
      const dropParent = dropItem.parentNode
      const dragParent = dragItem.parentNode

      target.classList.remove('hover')

      // check vị trí kéo (posDrag) và vị trí thả (posDrop) để lưu vị trí thay đổi answeredValue
      const posDrop = Number(dropItem.getAttribute('data-position'))
      const posDrag = Number(dragItem.getAttribute('data-position'))

      // check id answer của thành phần được kéo và thả vào
      const idDropItem = Number(dropItem.id.replace('answer', ''))
      const idDragItem = Number(dragItem.id.replace('answer', ''))

      // tìm kiếm vị trí đáp án và hoán đổi giá trị
      const cloneData = window._.cloneDeep(props.data)
      let indexDrop: any = null
      let indexDrag: any = null
      cloneData.answers.forEach((item: any, index: number) => {
        if (item.id === idDropItem)
          indexDrop = index

        if (item.id === idDragItem)
          indexDrag = index
      })

      const cloneDataDrop = window._.cloneDeep(cloneData.answers[indexDrop])

      cloneData.answers[indexDrop] = {
        ...cloneData.answers[indexDrop],
        content: cloneData.answers[indexDrag].content,
        id: cloneData.answers[indexDrag].id,
        answeredValue: posDrop,
        matched: true,
      }

      cloneData.answers[indexDrag] = {
        ...cloneData.answers[indexDrag],
        content: cloneDataDrop.content,
        id: cloneDataDrop.id,
        answeredValue: posDrag,
        matched: cloneData.answers[indexDrag].matched,
      }

      // cập nhật dữ liệu câu hỏi
      cloneData.isAnswered = !!cloneData.answers.filter((item: any) => item?.matched).length
      emit('update:isAnswered', cloneData.isAnswered)
      emit('update:data', cloneData)
      nextTick(() => {
        emit('update:isDataChange', true)
      })
    }
  }

  // // emit data lưu local storage
  // if (this.isPreview === false) {
  //   const container = evt.target.closest('.matching-container')
  //   if (container) {
  //     const answers = container.getElementsByClassName(
  //       'matching-answer-wrapper',
  //     )
  //     const answersData = []
  //     let i = 1
  //     answers.forEach(element => {
  //       const left = element.getElementsByClassName('left-item')
  //       const right = element.getElementsByClassName('right-item')
  //       answersData.push({
  //         left:
  //               left.length > 0
  //                 ? Number(left[0].id.replace('answer', ''))
  //                 : null,
  //         right:
  //               right.length > 0
  //                 ? Number(right[0].id.replace('answer', ''))
  //                 : null,
  //         isMatched:
  //               right.length > 0
  //                 ? right[0].classList.contains('matched')
  //                 : null,
  //         position: i,
  //       })
  //       i += 1
  //     })
  //     this.$emit('valueChange', answersData)
  //   }
  // }
}

// khi kéo qua đối tượng
function dragOver(evt: any) {
  // if (this.isReview || this.isPreview) return
  // if (this.dragSelectedQuestionId !== this.questionId) return
  if (props.isReview)
    return
  const target = evt.target.closest('.matching-answer-wrapper')
  if (!target.classList.contains('hover'))
    target.classList.add('hover')
}

// khi kéo rời khỏi đối tượng
function dragLeave(evt: any) {
  // if (this.isReview || this.isPreview) return
  if (props.isReview)
    return
  const target = evt.target.closest('.matching-answer-wrapper')
  if (target.classList.contains('hover'))
    target.classList.remove('hover')
}

/** **drag drop */
function handlePinQs() {
  const dataClone = ref(props.data)
  questionValue.value.isMark = !questionValue.value.isMark
  dataClone.value.isMark = !dataClone.value.isMark
  emit('update:isDataChange', false)
  emit('update:data', dataClone.value)
}

watch(() => props.data, val => {
  const answers: any[] = []
  const temp = window._.cloneDeep(val)
  temp?.answers.forEach((element: any) => {
    const position = element.position - 1
    if (position > -1) {
      if (answers[position] === undefined) {
        answers[position] = {
          left: null as any,
          right: null as any,
        }
      }

      if (element.isTrue === false) {
        answers[position].left = element
      }
      else {
        answers[position].right = element
        if (props.showAnswerTrue) {
          setTimeout(() => {
            if (!window._.isEmpty(answers[position].right))
              answers[position].right.matched = !!answers[position].right.answeredValue
            if (!window._.isEmpty(answers[position].left))
              answers[position].left.matched = !!answers[position].right.answeredValue
          }, 0)
        }
      }
    }
  })
  temp.answers = answers
  questionValue.value = temp
  questionValue.value.isAnswered = questionValue.value.answers.filter((item: any) => item.right?.matched).length
  emit('update:isAnswered', questionValue.value.isAnswered)
}, { immediate: true })
</script>

<template>
  <div class="content-view">
    <div
      v-if="isSentence"
      class="mb-4"
    >
      <span class="text-bold-md color-primary">{{ t('sentence') }} {{ numberQuestion }} - {{ point }}/{{ totalPoint }} {{ t('scores') }}</span>
      <CmButton
        v-if="!isGroup"
        class="ml-3"
        icon="ic:round-bookmark-border"
        :color="questionValue.isMark ? 'warning' : 'secondary'"
        color-icon="white"
        is-rounded
        :size="36"
        :size-icon="20"
        @click="handlePinQs"
      />
    </div>
    <div
      v-if="showContent"
      class="text-medium-md mb-5 color-text-900"
      v-html="questionValue.content"
    />
    <div
      v-if="showMedia && questionValue.urlFile"
      class="view-media mb-5"
    >
      <CpMediaContent
        :disabled="true"
        :src="questionValue.urlFile"
      />
    </div>

    <div class="matching-container">
      <div
        v-for="(item, idx) in questionValue.answers"
        :key="item.id"
        class="w-100 matching-answer-wrapper"
        @drop.prevent="drop"
        @dragover.prevent="dragOver"
        @dragleave="dragLeave"
      >
        <div
          class="box-answer"
          :class="
            {
              ansTrue: checkAnsTrueClass(item),
              ansFalse: checkAnsFalseClass(item),
              unMatched: showAnswerTrue ? false : !item.right?.matched,
            }
          "
        >
          <div
            v-if="item.left"
            class="box-left d-flex justify-space-between"
          >
            <div
              v-html="item.left.content"
            />
            <div
              v-if="isShuffle"
              :title="item?.left?.isShuffle ? t('allowed-shuffle') : t('not-allowed-shuffle')"
            >
              <VIcon
                icon="iconamoon:playlist-shuffle-light"
                :size="20"
                :color="item?.left?.isShuffle ? 'primary' : ''"
              />
            </div>
          </div>

          <div
            v-else
            class="box-left-empty"
          />
          <div
            v-if="item.right"
            :id="`answer${item.right.id}`"
            class=" position-relative box-right d-flex justify-space-between drag-item-wrapper"
            :data-position="idx + 1"
            :draggable="!isReview"
            @dragstart="startDrag($event)"
            @drag.prevent="dragDelta"
            @dragend="dragEnd"
          >
            <div
              v-html="item.right.content"
            />
            <div
              v-if="isShuffle"
              :title="item?.right?.isShuffle ? t('allowed-shuffle') : t('not-allowed-shuffle')"
            >
              <VIcon
                icon="iconamoon:playlist-shuffle-light"
                :size="20"
                :color="item?.right?.isShuffle ? 'primary' : ''"
              />
            </div>
          </div>
        </div>
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
  .box-answer.unMatched{
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
.matching-answer-wrapper {
  &.hover {
    .box-left {
      border: 2px solid purple !important;
    }
  }
}
</style>
