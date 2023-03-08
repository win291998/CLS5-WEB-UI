/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import lodash from '@/plugins/lodash'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@/styles/styles.scss'
import { globals } from '@/typescript/global/property'
import { globalsReadOnly } from '@/typescript/global/property.read'
import windowDefineProperty from '@/typescript/global/public/propertyGlobal.public'
import '@core/scss/template/index.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueFeather from 'vue-feather'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

loadFonts()

// Create vue app
const app = createApp(App)

app.provide('globals', globals)
app.provide('globalsReadOnly', globalsReadOnly)
app.component(VueFeather.name, VueFeather)

windowDefineProperty(app)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(lodash)
app.use(i18n)
app.component('EasyDataTable', Vue3EasyDataTable)

// Mount vue app
app.mount('#app')
