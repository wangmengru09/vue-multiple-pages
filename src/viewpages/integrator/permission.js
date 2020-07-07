import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// import { Message } from 'element-ui'
// import i18n from './lang'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/home', '/login', '/sessionRedirect'] // no redirect whitelist

let getAsyncRoutes

router.beforeEach(async(to, from, next) => {
  // 手动在地址栏输入地址时，如果不是当前系统的path，则自动跳转到path对应的系统
  // fixTag长度判断，是为了排除正常点击切换系统的情况
  const fixTag = store.getters.visitedViews.filter(tag => tag.meta.affix)
  const toSystemLevel = to.meta.systemLevel
  const fromSystemLevel = from.meta.systemLevel
  if ((toSystemLevel || toSystemLevel === 0) && (fromSystemLevel || fromSystemLevel === 0) && toSystemLevel !== fromSystemLevel && fixTag.length > 0) {
    const addTag = fixTag[0]
    const systemLevel = toSystemLevel
    store.dispatch('tagsView/delAllViews')
    store.dispatch('tagsView/delFixedView')
    const currentFixTag = store.state.tagsView.allFixedTagViews[systemLevel - 0]
    addTag.fullPath = currentFixTag.path
    addTag.path = currentFixTag.path
    addTag.meta = { ...currentFixTag.meta }
    store.dispatch('tagsView/addView', addTag)
    store.dispatch('permission/set_defaultSystem', !systemLevel ? 0 : systemLevel)
  }
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(store.getters.language === 'zh' ? to.meta.titleCn : to.meta.titleEn)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (!getAsyncRoutes) {
        const asyncRoutes = await store.dispatch('permission/generateRoutes', getObjArr('asyncRoutes'))
        if (!asyncRoutes) {
          await store.dispatch('user/resetToken')
          // window.location.href = process.env.VUE_APP_ETOWER_URL
          // next({ path: '/login' })
        } else {
          try {
            router.addRoutes(asyncRoutes)
          } catch {
            store.dispatch('user/resetToken').then(() => {
              // window.location.href = process.env.VUE_APP_ETOWER_URL
              // next('/login')
              // Message.error(i18n.t('message.routingError'))
            })
          }
          routerGo(to, next)
        }
      } else {
        const currentActiveMenu = store.state.permission.defaultSystem
        if (Number(currentActiveMenu) !== Number(localStorage.getItem('defaultSystem'))) {
          localStorage.setItem('defaultSystem', currentActiveMenu)
          routerGo(to, next)
        } else {
          if (localStorage.getItem('permissionMap') == null || localStorage.getItem('permissionMap') === 'undefined') {
            store.dispatch('user/resetToken').then(() => {
              // window.location.href = process.env.VUE_APP_ETOWER_URL
              NProgress.done()
              // next('/login')
              // Message.error(i18n.t('message.updateTip'))
              // setTimeout(() => {
              //   window.location.reload()
              // }, 1000)
              // NProgress.done()
            })
          } else next()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/home`)
      // window.location.href = process.env.VUE_APP_ETOWER_URL
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  const permissionId = to.meta.activeMenuId ? to.meta.activeMenuId : to.meta.id
  store.dispatch('user/set_permission', permissionId)
  if (to.path === '/') {
    const activeMenu = store.state.permission.defaultSystem
    const allFixedTagViews = store.state.tagsView.allFixedTagViews
    const path = allFixedTagViews[activeMenu].path
    router.push(path)
  }
  // finish progress bar
  NProgress.done()
})

function getObjArr(name) {
  return JSON.parse(localStorage.getItem(name))
}

async function routerGo(to, next) {
  const routes = filterCurrentSystemRoutes(getObjArr('asyncRoutes'), store.state.permission.defaultSystem - 0)
  getAsyncRoutes = routes
  store.dispatch('permission/set_currentSystemRoutes', getAsyncRoutes)
  next({
    ...to,
    replace: true
  })
}

function filterCurrentSystemRoutes(routes, index) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (!tmp.meta || (tmp.meta && (tmp.meta.systemLevel - 0) === (index - 0))) {
      if (tmp.children) {
        tmp.children = filterCurrentSystemRoutes(tmp.children, index)
      }
      res.push(tmp)
    }
  })
  return res
}
