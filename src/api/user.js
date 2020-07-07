import request from '@/utils/request'
import { user } from './requestUrl'

export function login(params) {
  return request({
    url: user.login,
    method: 'post',
    params,
    responeseError: false
  })
}

// sessionId 获取用户信息
export function getUserInfo(headers) {
  return request({
    url: user.getUserInfo,
    method: 'get',
    headers
  })
}
