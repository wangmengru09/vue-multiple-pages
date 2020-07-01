import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

function saveObjArr(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}
function getObjArr(name) {
  return JSON.parse(localStorage.getItem(name))
}

const userInfo = getObjArr('userInfo') ? getObjArr('userInfo') : {}

const state = {
  token: getToken(),
  name: userInfo.username,
  avatar: '',
  userInfo: userInfo,
  permissions: [],
  partyInfo: getObjArr('partyInfo') ? getObjArr('partyInfo') : {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSION: (state, permission) => {
    state.permissions = permission
  },
  SET_USERINFO: (state, info) => {
    state.userInfo = info
  }
}

const actions = {
  set_permission({ commit }, activeMenuId) {
    let permission = []
    if (activeMenuId) {
      const permissionMap = getObjArr('permissionMap')
      permission = permissionMap[activeMenuId] ? permissionMap[activeMenuId] : []
    }
    commit('SET_PERMISSION', permission)
  },
  // user login 缓存session
  login({ commit }, data) {
    return new Promise((resolve, reject) => {
      const userInfo = data.authUserVO
      const permissionInfo = data.partyVo
      const permissionMap = data.permissionSignMap
      if (!userInfo) {
        reject('Verification failed, please Login again.')
      }
      const { sessionId } = userInfo
      commit('SET_TOKEN', sessionId)
      setToken(sessionId)
      commit('SET_USERINFO', userInfo)
      commit('SET_NAME', userInfo.username)
      saveObjArr('userInfo', userInfo)
      saveObjArr('partyInfo', permissionInfo)
      saveObjArr('permissionMap', permissionMap)
      resolve(userInfo)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 单独处理退出接口，不论接口成功与否，都直接清除缓存并退出
      axios.get(process.env.VUE_APP_BASE_API + '/logout?sessionId=' + state.token)
        .then(res => {})
        .catch(error => {
          console.log(error)
        })
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', [])
      commit('SET_PERMISSION', [])
      removeToken()
      localStorage.removeItem('asyncRoutes')
      localStorage.removeItem('partyInfo')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('permissions')
      resetRouter()
      resolve()
    })
  },

  // get userInfo
  set_userInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      const userInfo = data.authUserVO
      const permissionInfo = data.partyVo
      const permissionMap = data.permissionSignMap
      if (!userInfo) {
        reject('Verification failed, please Login again.')
      }
      const { sessionId } = userInfo
      commit('SET_TOKEN', sessionId)
      setToken(sessionId)
      commit('SET_USERINFO', userInfo)
      commit('SET_NAME', userInfo.username)
      saveObjArr('userInfo', userInfo)
      saveObjArr('partyInfo', permissionInfo)
      saveObjArr('permissionMap', permissionMap)
      resolve(userInfo)
    })
  },
  set_token({ commit }, sessionId) {
    commit('SET_TOKEN', sessionId)
    setToken(sessionId)
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resetRouter()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

