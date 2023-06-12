<script lang="ts" setup>
import CpManaging from '@/components/page/gereral/CpManaging.vue'
import CmTab from '@/components/common/CmTab.vue'
import type { Tab } from '@/typescript/interface'
import CpMdEditUser from '@/components/page/gereral/CpMdEditUser.vue'
import CpOrganization from '@/components/page/gereral/CpOrganization.vue'
import UserService from '@/api/user'
import CourseService from '@/api/course'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import { asignUserManagerStore } from '@/stores/admin/course/asignUser'
import StringJwt from '@/utils/Jwt'

/**
 * Store
 */
const storeAsignUserManager = asignUserManagerStore()
const { queryParams } = storeToRefs(storeAsignUserManager)
const { } = storeAsignUserManager

const { t } = window.i18n()
const route = useRoute()
const listTab: Tab[] = [
  {
    key: 'assign-user',
    title: 'user',
    component: CpManaging,
    dataTab: {
      titlePage: t('user-list'),
      customId: 'id', // id table select
      keySearch: 'searchKey',
      isShowExportExcel: false,
      isShowOrg: false,
      header: [
        { text: '', value: 'checkbox' },
        { text: t('Full_Name'), value: 'fullName', width: 300, isFullName: true },
        { text: t('Email'), value: 'email' },
        { text: t('Register_Date'), value: 'registeredDate', isDate: true, type: 'custom' },
        { text: t('organization'), value: 'organization', type: 'menu' },
        { text: '', value: 'actions', width: 50 },
      ],
      params: queryParams,
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditUser,
      apiList: {
        api: CourseService.PostListInfoByCourse,
        method: TYPE_REQUEST.POST,
      },
      apiAdd: {
        api: CourseService.PostAddUserCourse,
        method: TYPE_REQUEST.POST,
        apiModal: CourseService.PostListUserCourse,
        methodModal: TYPE_REQUEST.POST,
        params: {
          courseId: route.params.id,
        },
        customKey: 'userModel',
      },
      apiDelete: {
        api: UserService.PostDeleteUserFromEvent,
        method: TYPE_REQUEST.POST,
        label: 'listEventCalendarUserId',
        params: {},
      },
    },
  },
  {
    key: 'group-user',
    title: 'group-management',
    component: CpManaging,
    dataTab: {
      titlePage: t('user-list'),
      customId: 'id', // id table select
      keySearch: 'searchData',
      isShowExportExcel: false,
      header: [
        { text: '', value: 'checkbox' },
        { text: t('user-group-name'), value: 'fullName', width: 300, isFullName: true },
        { text: t('Email'), value: 'email' },
        { text: t('Register_Date'), value: 'registeredDate', isDate: true, type: 'custom' },
        { text: t('organization'), value: 'organization', type: 'menu' },
        { text: '', value: 'actions', width: 50 },
      ],
      params: queryParams,
      actionsTable: [
        {
          id: 2,
          name: 'QuestionService.ActionDelete',
        },
      ],
      componentEdit: CpMdEditUser,
      apiList: {
        api: CourseService.PostListInfoByCourse,
        method: TYPE_REQUEST.POST,
      },
      apiAdd: {
        api: CourseService.PostAddUserCourse,
        method: TYPE_REQUEST.POST,
        apiModal: CourseService.PostListUserCourse,
        methodModal: TYPE_REQUEST.POST,
        params: {
          courseId: route.params.id,
        },
        customKey: 'userModel',
      },
      apiDelete: {
        api: UserService.PostDeleteUserFromEvent,
        method: TYPE_REQUEST.POST,
        label: 'listEventCalendarUserId',
        params: {},
      },
    },
  },
  {
    key: 'organizational-structure',
    title: 'organizational-structure-management',
    component: CpOrganization,
    dataTab: {
      apiList: {
        api: CourseService.GetOrganizationalStructure,
        method: TYPE_REQUEST.GET,
        params: {
          role: StringJwt.getRole(),
        },
      },
      apiAdd: {
        api: CourseService.PostOrgCourse,
        method: TYPE_REQUEST.POST,
        params: {
          courseId: route.params.id,
          listModelNew: [],
          listModelOld: [],
        },
      },
      apiDetail: {
        api: CourseService.GetListOrganizationalStructure,
        method: TYPE_REQUEST.GET,
        params: {
          id: route.params.id,
        },
      },
      routerCancel: 'course-list',

    },
  },
]
onMounted(() => {
  queryParams.value.id = Number(route.params.id)
})
</script>

<template>
  <div
    class="mb-5 mt-4"
  >
    <CmTab
      :list-tab="listTab"
      type="underline"
      label="assign"
    />
  </div>
</template>
