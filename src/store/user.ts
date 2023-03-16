import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const usersStore = defineStore({
  id: 'userDetails',
  state: () => ({
    name: '',
    age: 0,
    email: '',
  }),
  actions: {
    loadUserDetails() {
      const userId = useRoute().params.id

      // Lấy chi tiết của người dùng với id tương ứng và cập nhật trạng thái của store
      // ...
    },
  },
})
