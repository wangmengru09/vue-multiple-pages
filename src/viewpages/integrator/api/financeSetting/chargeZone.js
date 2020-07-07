import request from '@/utils/request'
import { finance } from '../requestUrl'

export const getOneChargeZone = (params) => {
  return request({
    url: finance.getOneChargeZone,
    method: 'get',
    params
  })
}

export const operateChargeZone = (method, data) => {
  return request({
    url: finance.operateChargeZone,
    method,
    data
  })
}
