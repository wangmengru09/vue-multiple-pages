import Vue from 'vue'
import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import i18n from '@/lang/index'
import Qs from 'qs'
// import Router from '@/router/index'

// create an axios instance
const timeout = 20000
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout, // request timeout
  loading: true, // 是否启用全局的loading
  responeseError: true // 是否启用全局的错误信息拦截
})

let loadingInstance
let isShowSessionOut = false

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.loading) {
      loadingInstance = Loading.service({
        text: i18n.t('common.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, .6)'
      })

      // 长时间请求无响应，自动关闭loading
      setTimeout(() => {
        loadingInstance.close()
      }, timeout)
    }
    // do something before request is sent
    if (!config.headers.sessionId && store.getters.token) {
      config.headers['sessionId'] = getToken()
    }
    let language = ''
    if (store.getters.language === 'zh') {
      language = 'zh_CN'
    } else if (store.getters.language === 'en') {
      language = 'en_US'
    }
    config.headers['lang'] = language

    config.paramsSerializer = (params) => {
      return Qs.stringify(params, { indices: false })
    }

    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (loadingInstance) loadingInstance.close()
    return new Promise((resolve) => {
      if (response.data.code === '0014') {
        if (isShowSessionOut) return Promise.reject(i18n.t('common.sessionTimeout'))
        isShowSessionOut = true
        MessageBox.alert(i18n.t('common.sessionTimeout'), {
          confirmButtonText: i18n.t('navbar.loginIn'),
          callback: () => {
            isShowSessionOut = false
            store.dispatch('user/resetToken').then(() => {
              // const { path, query } = Router.currentRoute
              // const email = store.getters.userInfo.email
              // Router.push({ name: 'login', params: { path, query, email }})
              window.location.reload()
              window.location.href = process.env.VUE_APP_ETOWER_URL
            })
          }
        })
        return Promise.reject(i18n.t('common.sessionTimeout'))
      } else if (response.config.responeseError && response.data.code !== '0') {
        if (response.data.errors && response.data.errors.length > 0) Vue.prototype.$openErrorMessage(response.data.errors)
        else {
          Message({
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
        }
        return
      }
      resolve(response.data)
    })
  },
  error => {
    if (loadingInstance) loadingInstance.close()
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
