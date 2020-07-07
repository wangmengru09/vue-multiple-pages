import request from '@/utils/request'
import { common } from './requestUrl'

// 上传文件
export function uploadFile(url, headers, data) {
  return request({
    url,
    method: 'post',
    data,
    headers,
    responeseError: false
  })
}

// 获取币种
export function getCurrency() {
  return request({
    url: common.getCurrency,
    method: 'post',
    loading: false
  })
}

// 获取集成商的所有服务
export function getIntegratorChannel() {
  return request({
    url: common.getIntegratorChannel,
    method: 'post',
    loading: false
  })
}

// 获取集成商的所有服务
export function getCountry() {
  return request({
    url: common.getCountry,
    method: 'get',
    loading: false
  })
}

// 查询ag-grid数据
export function getGridData(url, method, params, data) {
  return request({
    url,
    method,
    params,
    data,
    loading: false
  })
}

// 获取active状态
export function getActivityTypes() {
  return request({
    url: common.getActivityTypes,
    method: 'get',
    loading: false
  })
}
