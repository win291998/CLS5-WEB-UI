<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import CpCondParticipation from '@/components/page/Admin/course/modify/CpCondParticipation.vue'
import CpInforCourse from '@/components/page/Admin/course/modify/CpInforCourse.vue'
import { courseInforManagerStore } from '@/stores/admin/course/infor'

/** lib */
const route = useRoute()

/**
 * Store
 */
const storeCourseInforManager = courseInforManagerStore()
const { idCourse } = storeToRefs(storeCourseInforManager)
const { getDetailCourse } = storeCourseInforManager

if (route?.params?.id) {
  idCourse.value = Number(route?.params.id)
  getDetailCourse()
}
const listtab = ref([
  {
    key: 'infor',
    title: 'infor_course',
    component: CpInforCourse,
  },

  {
    key: 'participation',
    title: 'course-attend-dk',
    component: CpCondParticipation,
  },

  // {
  //   key: 'topic-survey',
  //   title: 'topic-survey',
  //   component: CpManagerTopic,
  //   dataTab: {
  //     typeId: 6,
  //   },
  // },
  // {
  //   key: 'topic-question',
  //   title: 'ShareService_TopicQuestion',
  //   component: CpManagerTopic,
  //   dataTab: {
  //     typeId: 4,
  //   },
  // },
  // {
  //   key: 'training-route',
  //   title: 'topic-training-route',
  //   component: CpManagerTopic,
  //   dataTab: {
  //     typeId: 1,
  //   },
  // },
  // {
  //   key: 'topic-forum',
  //   title: 'topic-forum',
  //   component: CpManagerTopic,
  //   dataTab: {
  //     typeId: 7,
  //   },
  // },
])
</script>

<template>
  <CmTab
    :list-tab="listtab"
    label="tab"
  />
</template>
