import Layout from '@/layout'
import { constantRoutes } from '@/router'

function filterAsyncRoutes(asyncRouterMap) {
  if (!asyncRouterMap) return false
  const asyncRoutes = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = require('@/viewpages/integrator/views/' + route.component + '.vue')
        if (route.component.hasOwnProperty('default')) route.component = route.component.default
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRoutes(route.children)
    }
    return true
  })
  return asyncRoutes
}

const state = {
  routes: [],
  addRoutes: [],
  currentSystemRoutes: [],
  defaultSystem: localStorage.getItem('defaultSystem')
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_CURRENT_SYSTEM_ROUTES: (state, routes) => {
    state.currentSystemRoutes = routes
  },
  SET_DEFAULT_SYSTEM: (state, index) => {
    state.defaultSystem = index
  }
}

const actions = {
  generateRoutes({ commit }, asyncRoutes) {
    return new Promise(resolve => {
      let accessedRoutes = []
      accessedRoutes = filterAsyncRoutes(asyncRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  set_currentSystemRoutes({ commit }, routes) {
    commit('SET_CURRENT_SYSTEM_ROUTES', routes)
  },
  set_defaultSystem({ commit }, index) {
    commit('SET_DEFAULT_SYSTEM', index)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
