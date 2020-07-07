import request from '@/utils/request'
import { finance } from '../requestUrl'

export const updateRateCardStatus = (data) => {
  return request({
    url: finance.updateRateCardStatus,
    method: 'put',
    data
  })
}

export const getOneRateCard = (params) => {
  return request({
    url: finance.getOneRateCard,
    method: 'get',
    params
  })
}

export const getChargeZoneOptions = () => {
  return request({
    url: finance.getChargeZoneOptions,
    method: 'get',
    loading: false
  })
}

// 新增价卡
export const addRateCard = (data) => {
  return request({
    url: finance.addRateCard,
    method: 'post',
    data
  })
}

// 编辑时-修改价卡信息
export const updateRateCardInfo = (data) => {
  return request({
    url: finance.updateRateCardInfo,
    method: 'put',
    data
  })
}

// 编辑时- 添加/修改 价卡detail
export const operateCardDetail = (url, method, data) => {
  return request({
    url,
    method,
    data
  })
}

// 编辑时-删除价卡details
export const deleteRateCardDetails = (data) => {
  return request({
    url: finance.deleteRateCardDetails,
    method: 'delete',
    data
  })
}

// 编辑时-查询detail的items
export const queryRateDetailItems = (params) => {
  return request({
    url: finance.queryRateDetailItems,
    method: 'get',
    params,
    loading: false
  })
}
