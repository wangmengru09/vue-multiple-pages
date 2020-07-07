import request from '@/utils/request'
import { finance } from '../requestUrl'

export const getOneSurcharge = (params) => {
  return request({
    url: finance.getOneSurcharge,
    method: 'get',
    params
  })
}

export const getSurchargeUnit = () => {
  return request({
    url: finance.getSurchargeUnit,
    method: 'get',
    loading: false
  })
}

export const updateSurchargeStatus = (data) => {
  return request({
    url: finance.updateSurchargeStatus,
    method: 'put',
    data
  })
}

export const operateSurcharge = (url, method, data) => {
  return request({
    url,
    method,
    data
  })
}
