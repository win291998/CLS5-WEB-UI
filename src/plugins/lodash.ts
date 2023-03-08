import _ from 'lodash'

export default {
  install(app: any) {
    app.config.globalProperties.$lodash = _
  },
}
