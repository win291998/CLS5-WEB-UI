<script lang="ts" setup>
import CmTab from '@/components/common/CmTab.vue'
import CpCondParticipation from '@/components/page/Admin/course/modify/CpCondParticipation.vue'
import CpInforCourse from '@/components/page/Admin/course/modify/CpInforCourse.vue'
import CpConditionsCompletion from '@/components/page/Admin/course/modify/CpConditionsCompletion.vue'
import CpCostCourse from '@/components/page/Admin/course/modify/CpCostCourse.vue'
import CpCourseSurveyEvaluation from '@/components/page/Admin/course/modify/CpCourseSurveyEvaluation.vue'
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

  {
    key: 'completion',
    title: 'conditions-completion',
    component: CpConditionsCompletion,
  },

  {
    key: 'cost',
    title: 'cost-management',
    component: CpCostCourse,
  },

  {
    key: 'survey-course',
    title: 'survey-course',
    component: CpCourseSurveyEvaluation,
  },

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
