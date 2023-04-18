import { defineStore } from 'pinia'
import MethodsUtil from '@/utils/MethodsUtil'
import ApiUser from '@/api/user/index'
import { TYPE_REQUEST } from '@/typescript/enums/enums'
import toast from '@/plugins/toast'
import { validatorStore } from '@/stores/validatator'

export const profileUserManagerStore = defineStore('profileUserManager', () => {
  /** variable main */
  const { t } = window.i18n() // Khởi tạo biến đa ngôn ngữ
  const route = useRoute()
  const router = useRouter()

  /** data main */
  const accountInformation = ref<any>({
    academicDegreeId: null,
    academicRankId: null,
    address: '',
    avatar: '',
    birthDay: null,
    email: '',
    employmentDate: '',
    firstName: '',
    gender: true,
    lastName: '',
    levelId: null,
    listEducationUser: [],
    listExperienceUser: [],
    listGroupId: [],
    listOrganizationalStructureId: [],
    passport: '',
    password: '',
    payrollScaleId: null,
    phoneNumber: '',
    position: '',
    statusId: null,
    story: '',
    timeZoneId: null,
    userCode: '',
    userName: '',
    userTitleId: null,
    userTypeId: null,
    wardId: null,
    districtId: null,
    provinceId: null,
    workplace: '',
    listBranchId: null,
    countryId: null,
    userGroups: [],
    userBranches: [],
    kpiLearn: null,
    kpiTeach: null,
  })

  const idUpdate = ref()
  const myFormUserInfor = ref()
  const titleTable = ref()
  const isShowButton = ref(true)
  const idUser = ref()

  /**
 * Xử lý data form
 *
 */
  const storeValidate = validatorStore()
  const { schemaOption, Field, Form, useForm, yup } = storeValidate
  let schema = reactive<any>({
    lastName: schemaOption.lastName,
    firstName: schemaOption.firstName,
    email: schemaOption.email,
    userName: schemaOption.userName,
    userCode: schemaOption.userCode,
    phoneNumber: schemaOption.phoneNumber,
    kpiLearn: schemaOption.kpiLearn,
    kpiTeach: schemaOption.kpiTeach,
    userTypeIdSingle: schemaOption.userTypeIdSingle,
    statusIdSingle: schemaOption.statusIdSingle,
  })

  const schemaPass = reactive <any> ({
    password: schemaOption?.password,
  })

  if (!Number(route.params.id))
    schema = { ...schema, ...schemaPass }

  const { handleSubmit, validate, errors, submitForm, resetForm } = useForm({
    validationSchema: schema,
  })

  const { values, setValues } = useForm({
    validationSchema: schema,
    initialValues: ref(accountInformation),
  })

  /**
 *
 * Lấy dữ liệu edit
 */
  const getErrorsMessage = (errorsMess: Array<any>) => {
    let str = ''
    errorsMess.forEach(element => {
      str += `${t(element.message, element.params)}`
      str += '. '
    })

    return str
  }

  const updateListOrg = (val: any) => {
    const list: number[] = []

    val.forEach((item: any) => {
      if (item.id)
        list.push(item.id)
    })
    values.listOrganizationalStructureId = list as never
  }

  // lấy mã code
  const getAutoCode = async () => {
    await MethodsUtil.requestApiCustom(ApiUser.getAutoCode, TYPE_REQUEST.GET).then(value => {
      values.userCode = value?.data?.data
    })
  }

  const resetData = () => {
    isShowButton.value = true

    router.push({ name: 'admin-organization-users-profile-edit', params: { tabActive: 'infor', id: route?.params?.id } })

    idUpdate.value = null
    resetForm()
    idUser.value = null
    getAutoCode()
  }

  // lấy thông tin học viên

  const fectchLecturers = async (id: any) => {
    const params = { userId: id }

    idUpdate.value = id
    await MethodsUtil.requestApiCustom(ApiUser.fetchDetailUpdate, TYPE_REQUEST.GET, params).then(value => {
      accountInformation.value = value.data
      setValues(value.data)
      console.log(accountInformation)
    })
  }

  const handlesCreateUser = async (bvModalEvt: any, dataObj: any, type: any) => {
    const form: any = myFormUserInfor.value
    if (form) {
      form.validate().then(async (success: any) => {
        console.log(success)

        if (success.valid) {
          const params = dataObj

          await MethodsUtil.requestApiCustom(ApiUser.fetchCreateUser, TYPE_REQUEST.POST, params)
            .then(value => {
              console.log(value)
              if (titleTable.value?.isChange)
                titleTable.value.updateTitle(value.data)
              toast('SUCCESS', t(value.message))

              if (type === 'save') {
                router.push({ name: 'admin-organization-users-manager' })

                return
              }
              if (type === 'save-add')
                resetData()

              idUser.value = value.data

              fectchLecturers(value.data)
              idUpdate.value = value.data

              router.push({ name: 'admin-organization-users-profile-edit', params: { tabActive: 'infor', id: idUser.value } })
            })

            .catch(error => {
              console.log(error)
              toast('ERROR', t(getErrorsMessage(error)))
            })
        }
      })
    }
  }

  /**
 * update users
 *
 */
  const handleUpdateUser = async (bvModalEvt: any, dataObj: any, type: any) => {
    const form: any = myFormUserInfor.value
    console.log(myFormUserInfor)

    form.validate().then(async (success: any) => {
      console.log(success)

      if (success.valid) {
        const params = dataObj

        await MethodsUtil.requestApiCustom(ApiUser.fetchUpdateUser, TYPE_REQUEST.POST, params)
          .then(value => {
            console.log(value)

            if (titleTable.value?.isChange) {
              console.log(titleTable.value?.isChange)
              titleTable.value.updateTitle()
            }
            toast('SUCCESS', t(value.message))
            if (type === 'save') {
              router.push({ name: 'admin-organization-users-manager' })

              return
            }
            if (type === 'save-add')
              resetData()
          })
      }
    })
  }

  const handleUser = (bvModalEvt: any, type: any) => {
    values.firstName = values?.firstName.trim()
    values.lastName = values?.lastName.trim()
    values.userName = values?.userName.trim()
    console.log(values)

    if (idUpdate.value === null)
      handlesCreateUser(bvModalEvt, values, type)

    else
      handleUpdateUser(bvModalEvt, values, type)
  }

  onMounted(() => {
    console.log('onMounted')
  })
  onBeforeUnmount(() => {
    console.log('onBeforeUnmount')
  })

  return {
    idUpdate,
    isShowButton,
    accountInformation,
    myFormUserInfor,
    titleTable,
    values,
    schema,
    submitForm,
    fectchLecturers,
    handleUser,
    handlesCreateUser,
    handleUpdateUser,
    updateListOrg,
  }
})
