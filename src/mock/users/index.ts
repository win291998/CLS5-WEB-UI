import ApiUser from '@/api/user/index'
import ComboboxService from '@/api/combobox/index'
import { orgStructCb } from '@/mock/dataApi/combobox.json'

export const listUser: any = {
  code: 200,
  data: {
    pageLists: [
      {
        avatar: '/DataFile/2021/4/29/localhost/1010/Image/fol-zVlAHx/origin.jpg',
        email: 'kinhdoanh@gmail.com',
        firstName: 'Mr',
        id: 3,
        lastName: 'Thai',
        organizationalStructureName: 'Trung tâm Elearning',
        phoneNumber: '0123456789',
        registeredDate: '2021-02-19T15:57:53.0376168',
        statusName: 'IdentityService_Active',
        userCode: 'kinhdoanh',
        userName: 'kinhdoanh',
        userTitleName: 'Trưởng Phòng Đấu thầu',
        userTypeName: 'Administrator',
        group: 'Nhóm 1000 người dùng',
        orgModels: [{
          parentName: null,
          level: 1,
          categoryTitleName: null,
          userId: 11474,
          name: 'cctc 50nd',
          titleName: '1a',
          orgId: 5704,
        }, {
          parentName: null,
          level: 1,
          categoryTitleName: null,
          userId: 11474,
          name: 'cctc 50nd',
          titleName: '1a',
          orgId: 5704,
        }],
        groupModels: [
          {
            userId: 11509,
            name: 'Nhóm huỳnh test thêm khóa học, cctc',
            groupId: 340,
          },
        ],
        authorId: 0,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'tathien@gmail.com',
        firstName: 'Học Viên',
        id: 10,
        lastName: 'Nguyễn',
        organizationalStructureName: 'Trung tâm Elearning',
        phoneNumber: '',
        registeredDate: '2021-06-13T10:58:39.6650041',
        statusName: 'IdentityService_Active',
        userCode: 'Ng@chv123@',
        userName: 'tathien',
        userTitleName: 'Trưởng Phòng Đấu thầu',
        userTypeName: 'Administrator',
        group: 'Nhóm 1000 người dùng',
        authorId: 1,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'ngochv1234@gmail.com',
        firstName: 'Học Viên',
        id: 12,
        lastName: 'Ngọc',
        organizationalStructureName: 'Trung tâm Elearning',
        phoneNumber: '',
        registeredDate: '2021-06-13T11:04:40.2954402',
        statusName: 'IdentityService_Active',
        userCode: 'Ng@chv1234@',
        userName: 'ngochv1234',
        userTitleName: 'Trưởng Phòng Đấu thầu',
        userTypeName: 'test123',
        group: 'Nhóm 1000 người dùng',
        authorId: 1,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'linhpm@huongvietgroup.com',
        firstName: 'Linh',
        id: 17,
        lastName: 'Pham',
        organizationalStructureName: null,
        phoneNumber: '',
        registeredDate: '2021-06-14T01:05:04.9277923',
        statusName: 'IdentityService_Active',
        userCode: 'abc1',
        userName: 'linhpm@huongvietgroup.com',
        userTitleName: null,
        userTypeName: 'Giáo viên',
        group: null,
        authorId: 14,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'quypn@gmail,com',
        firstName: 'Quy',
        id: 18,
        lastName: 'Pham',
        organizationalStructureName: null,
        phoneNumber: '',
        registeredDate: '2021-06-14T01:11:56.5921854',
        statusName: 'IdentityService_Active',
        userCode: 'abc001',
        userName: 'quypn',
        userTitleName: null,
        userTypeName: 'Giáo viên',
        group: null,
        authorId: 14,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'huynhgn@gmail.com',
        firstName: 'Huynh',
        id: 19,
        lastName: 'Giang ',
        organizationalStructureName: 'Trung tâm Elearning',
        phoneNumber: '',
        registeredDate: '2021-06-14T01:12:38.5828939',
        statusName: 'IdentityService_Active',
        userCode: 'abc002',
        userName: 'huynhgn',
        userTitleName: 'Trưởng Phòng Đấu thầu',
        userTypeName: 'Giáo viên',
        group: 'Nhóm 1000 người dùng',
        authorId: 14,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '/DataFile/2021/6/18/localhost/1/Image/fol-Zhxarw/origin.jpg',
        email: 'phongnv@gmail.com',
        firstName: 'Phong',
        id: 24,
        lastName: 'Nguyễn',
        organizationalStructureName: '4000nguoi',
        phoneNumber: '0123456789',
        registeredDate: '2021-06-14T10:30:54.8547243',
        statusName: 'IdentityService_Active',
        userCode: 'phongnv',
        userName: 'phongnv',
        userTitleName: 'duc',
        userTypeName: 'test123',
        group: 'Nhóm 1000 người dùng',
        authorId: 1,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'dmd@gmail.com',
        firstName: 'Minh',
        id: 40,
        lastName: 'Đặng Đồng',
        organizationalStructureName: '4000nguoi',
        phoneNumber: '',
        registeredDate: '2021-06-18T09:20:29.2261332',
        statusName: 'IdentityService_Active',
        userCode: 'hocvien',
        userName: 'Mr.Dong',
        userTitleName: 'duc',
        userTypeName: 'Giáo viên',
        group: 'Nhóm 1000 người dùng',
        authorId: 1,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'phongnv1106@gmail.com',
        firstName: 'Phong 1106',
        id: 41,
        lastName: 'Nguyễn Văn',
        organizationalStructureName: '4000nguoi',
        phoneNumber: '0123456789',
        registeredDate: '2021-06-18T09:23:45.7315401',
        statusName: 'IdentityService_Active',
        userCode: 'phongnv1106',
        userName: 'phongnv1106',
        userTitleName: 'duc',
        userTypeName: 'Học viên',
        group: 'Nhóm 1000 người dùng',
        authorId: 1,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
      {
        avatar: '',
        email: 'a@gmail.com',
        firstName: 'A',
        id: 42,
        lastName: 'Nguyễn ',
        organizationalStructureName: '4000nguoi',
        phoneNumber: '1111111111',
        registeredDate: '2021-06-18T10:17:38.4880726',
        statusName: 'IdentityService_Active',
        userCode: 'a',
        userName: 'a12345',
        userTitleName: 'duc',
        userTypeName: 'test123',
        group: 'Nhóm 1000 người dùng',
        authorId: 1,
        actions: [
          {
            id: 4,
            name: 'QuestionService.ActionViewDetail',
          },
          {
            id: 8,
            name: 'QuestionService.ActionViewReport',
          },
          {
            id: 1,
            name: 'QuestionService.ActionEdit',
          },
          {
            id: 13,
            name: 'QuestionService.IssuePasswords',
          },
          {
            id: 14,
            name: 'QuestionService.ChangeStatus',
          },
          {
            id: 2,
            name: 'QuestionService.ActionDelete',
          },
        ],
      },
    ],
    totalRecord: 5074,
  },
  errors: null,
  message: '',
  params: [],
}

export const fetchData = async (url = '', method = 'GET', payload?: any) => {
  switch (url) {
    case ApiUser.UsersList:
      return await window._.cloneDeep(listUser)
      break
    case ComboboxService.AllOrgStruct:
      return await window._.cloneDeep(orgStructCb)
      break

    default:
      break
  }
}
