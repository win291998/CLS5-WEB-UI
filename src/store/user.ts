import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import AuthUtil from '@/auth'

export const userData = defineStore({
  id: 'userData',
  state: () => ({
    userData: AuthUtil.getUserData(),
  }),
  actions: {
    loadUserDetails() {
      const userId = useRoute().params.id

      // Lấy chi tiết của người dùng với id tương ứng và cập nhật trạng thái của store
      // ...
    },
  },
})
