import request from '@/utils/request'
import { finance } from '../requestUrl'

// 改变税费的状态
export const updateTaxStatus = (params) => {
  return request({
    url: finance.updateTaxStatus,
    method: 'post',
    params
  })
}

// 保存税费配置
export const saveTax = (url, method, data) => {
  return request({
    url,
    method,
    data
  })
}

// 查询一个税费详情
export const getOneTax = (params) => {
  return request({
    url: finance.getOneTax,
    method: 'post',
    params
  })
}

// 查询税费配置状态
export const getTaxStatus = () => {
  return request({
    url: finance.getTaxStatus,
    method: 'get',
    loading: false
  })
}

// 查询费率区间类型
export const getTaxRangeType = () => {
  return request({
    url: finance.getTaxRangeType,
    method: 'get',
    loading: false
  })
}
