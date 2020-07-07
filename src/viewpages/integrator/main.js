import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from '../App'
import store from '@/store'
import router from '@/router'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import 'ag-grid-enterprise'
import { LicenseManager } from 'ag-grid-enterprise'
LicenseManager.setLicenseKey('Evaluation_License_Valid_Until__24_November_2018__MTU0MzAxNzYwMDAwMA==a39c92782187aa78196ed1593ccd1527')

import '@/icons' // icon
import '@/directive/index'
import '@I/permission'
import i18n from '@/lang' // internationalization

import base from '@/utils/base'
Vue.use(base)

// 引入 ErrorMsgDialog组件
import ErrorMsgDialog from '@/components/ErrorMsgDialog/index'

// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(ErrorMsgDialog)

Vue.config.productionTip = false

const vue = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

export default vue
