<script setup lang="ts">
import CmList from '@/components/common/CmList.vue'
import CmIcon from '@/components/common/CmIcon.vue'
import { myCourseManagerStore } from '@/stores/user/course/course'
import ArraysUtil from '@/utils/ArrayUtil'

const myCourseManagerManager = myCourseManagerStore()
const { courseData } = storeToRefs(myCourseManagerManager)
const { } = myCourseManagerManager
const contentList = ref(courseData.value)
onMounted(() => {
  watch(courseData, (newValue, oldValue) => {
    if (newValue) {
      contentList.value = courseData.value?.contents
      contentList.value = ArraysUtil.formatTreeTable(ArraysUtil.unFlatMapTree(courseData.value?.contents), 'id')
      console.log(contentList.value)
    }
  }, { immediate: true })
})
</script>

<template>
  <div
    v-for="item in contentList"
    :key="item.id"
  >
    <CmList
      v-if="(item.children === null || !item.children || !item.children.length) && Number(item.contentArchiveTypeId) !== 13"
      is-custom
      :list="item.listCourseContent"
      key-label="courseContentName"
    >
      <template #default="{ listItem }">
        <div class="content-item">
          <CmIcon
            :type="2"
            bg-color="warning"
            color="warning"
            icon="solar:pen-2-linear"
            :size="12"
            class="mr-3"
          />
          <div class="content-item-label">
            {{ listItem.courseContentName }}
          </div>
        </div>
      </template>
    </CmList>
  </div>
</template>

<style scoped lang="scss">
.content-item{
  display: flex;
  .content-item-label {
    overflow-wrap: anywhere;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
