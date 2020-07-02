import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenuId: '123456'       if set id, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: resolve => require(['@/layout/index.vue'], resolve),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: resolve => require(['@I/views/redirect/index.vue'], resolve)
      }
    ]
  },
  {
    path: '/home',
    name: 'homepage',
    component: resolve => require(['@I/views/homepage/index.vue'], resolve),
    hidden: true
  },
  {
    path: '/login',
    name: 'login',
    component: resolve => require(['@I/views/login/index.vue'], resolve),
    hidden: true
  },
  {
    path: '*',
    component: resolve => require(['@I/views/404'], resolve),
    hidden: true
  },
  {
    path: '/',
    component: resolve => require(['@/layout/index.vue'], resolve),
    hidden: true
  },
  {
    path: '/sessionRedirect',
    name: 'SessionRedirect',
    component: resolve => require(['@I/views/sessionRedirect/index.vue'], resolve),
    hidden: true
  },
  {
    path: '/integrator',
    name: 'IntegratorDashboardParent',
    redirect: '/integrator/dashboard',
    meta: {
      breadCrumb: false,
      icon: 'dashboard',
      systemLevel: 3,
      titleCn: 'list',
      titleEn: 'Dashboard',
      id: '011'
    },
    component: Layout,
    children: [
      {
        name: 'IntegratorDashboard',
        path: 'dashboard',
        component: resolve => require(['@I/views/dashboard/integrator.vue'], resolve),
        meta: {
          affix: true,
          icon: 'dashboard',
          systemLevel: 3,
          titleCn: '首页',
          titleEn: 'Dashboard',
          id: '012'
        }
      }
    ]
  },
  {
    path: '/list',
    redirect: '/list/index',
    meta: {
      icon: 'dashboard',
      systemLevel: 3,
      titleCn: 'list',
      titleEn: 'list',
      id: '020'
    },
    component: Layout,
    children: [
      {
        path: 'index',
        component: resolve => require(['@/viewpages/shipper/views/list/index.vue'], resolve),
        meta: {
          icon: 'dashboard',
          systemLevel: 3,
          titleCn: 'list',
          titleEn: 'list',
          id: '021'
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 */
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
