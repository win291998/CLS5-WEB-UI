import { defineStore } from 'pinia'

export const connections = defineStore('connections', () => {
  const isLoginOneDevice = ref(false)
  const signalRConnection = ref(null)
  const showModalLogout = ref(false)
  const listContact = ref([])
  const activeChatContact = ref(null)
  const activeChatMessages = ref([])
  const activeChatMessageTotal = ref(0)
  const myUserId = ref(null)

  const getMessageParams = ref({
    pageNumber: 1,
    pageSize: 20,
    userId: null,
    contactId: null,
  })

  const isShowNotification = ref(false)
  const connectionSignalRPromise = ref(null)
  const notificationQueue = ref([])
  const generalNotificationSetting = ref(null)
  const renderingNotification = ref(null)
  const isRenderingNotification = ref(false)
  const isUserLogout = ref(false)

  const totalUnseenMessages = computed(() => listContact.value.filter((contact: any) => contact.lastMessage && contact.isUnseenMessage).length)

  return {
    isLoginOneDevice,
    signalRConnection,
    showModalLogout,
    listContact,
    activeChatContact,
    activeChatMessages,
    activeChatMessageTotal,
    myUserId,
    getMessageParams,
    isShowNotification,
    connectionSignalRPromise,
    notificationQueue,
    generalNotificationSetting,
    renderingNotification,
    isRenderingNotification,
    isUserLogout,
  }
})
