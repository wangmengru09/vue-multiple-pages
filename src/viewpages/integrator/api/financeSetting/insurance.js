import request from '@/utils/request'
import { finance } from '../requestUrl'

// 新增/修改-保险费率
export const operateInsuranceRate = (url, method, data) => {
  return request({
    url,
    method,
    data
  })
}

// 删除保险费率
export const deleteInsuranceRate = (params) => {
  return request({
    url: finance.deleteInsuranceRate,
    method: 'delete',
    params
  })
}
