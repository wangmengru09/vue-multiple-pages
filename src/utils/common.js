import i18n from '@/lang/index'
import { Message } from 'element-ui'
import moment from 'moment'

/**
 * 深拷贝对象，可以正确序列化日期
 * @param {*} obj
 */
export const DEEP_CLONE = function(obj) {
  const objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断obj子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          // 深拷贝日期类型
          if (obj[key] instanceof Date) {
            objClone[key] = new Date(obj[key].valueOf())
          } else {
            objClone[key] = DEEP_CLONE(obj[key])
          }
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

/**
 * 将mergeObj的数据合并至obj中，mergeObj中多余的属性也会被合并到obj中；
 * @param {Object} obj 结构实体
 * @param {Object} mergeObj 数据实体
 * @param {Boolean} isMergeOthers 是否将mergeObj中的其他属性merge到obj中，默认true
 */
export const MERGE = function(obj, mergeObj, isMergeOthers = true) {
  const _mergeObj = DEEP_CLONE(mergeObj)
  for (const key in obj) {
    // 只判定自身属性和合并对象值存在的情况
    if (!obj.hasOwnProperty(key) || _mergeObj[key] === undefined) {
      continue
    }
    // 判断obj子元素是否为对象/数组，如果是则递归
    if (obj[key] && typeof obj[key] === 'object' && _mergeObj[key]) {
      // 数组直接赋值
      if (_mergeObj[key] instanceof Array) {
        obj[key] = _mergeObj[key]
      } else {
        MERGE(obj[key], _mergeObj[key])
      }
    } else {
      // 如果不是，直接赋值
      obj[key] = _mergeObj[key]
    }
    // 移除合并对象
    delete _mergeObj[key]
  }
  // 将_mergeObj中多余属性合并过来
  if (isMergeOthers) {
    for (const key in _mergeObj) {
      obj[key] = mergeObj[key]
    }
  }
  return obj
}

/**
 * 判断当前ag-grid有无选中的数据
 * @param{Object} gridOptions grid配置参数
 * @param{Boolean} isMultiple 是否多选，默认是
 */
export const HAS_SELECTED_ROWS = function(gridOptions, isMultiple = true) {
  const selectedRows = gridOptions.api.getSelectedRows()
  if (isMultiple && selectedRows.length <= 0) {
    Message({
      showClose: true,
      message: i18n.t('message.atLeastOneSelected'),
      type: 'warning'
    })
    return false
  } else if (!isMultiple && selectedRows.length !== 1) {
    Message({
      showClose: true,
      message: i18n.t('common.oneRowData'),
      type: 'warning'
    })
    return false
  } else return selectedRows
}

/**
 * 生成唯一ID（目前算法：本地时间戳+重复时累加。存在本地时间被修改的漏洞）
 * @param {Number} 是否是支持int长度
 */
export const UNIQUE_ID = function(isShort) {
  // 取出最后一次id生成使用的时间戳
  let timestamp
  let d = sessionStorage.getItem('timestamp')
  if (d) {
    timestamp = JSON.parse(d)
  } else {
    timestamp = {
      last: 0,
      count: 0
    }
  }

  let time = isShort ? moment().format('MMDDHHmm') : new Date().getTime()
  let id
  // 判定上一次的id是否重复，重复则使用count累计
  if (timestamp.last === time) {
    id = time + '' + timestamp.count
    timestamp.count++
  } else {
    id = time
    timestamp.count = 0
  }
  timestamp.last = time
  // 缓存最后一次id生成使用的时间戳
  sessionStorage.setItem('timestamp', JSON.stringify(timestamp))
  return id
}

/**
 * 根据指定的key，获取地址栏中的参数值
 * @param {param} key
 */
export const GET_QUERY_PARAM = function(param) {
  const reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)')
  const href = window.location.href
  const paramsStr = href.split('?')[1]
  const r = paramsStr.match(reg)
  if (r != null) return decodeURI(decodeURI(r[2]))
  return null
}

/**
 * 数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param {string/Number} key 排序的属性 如number属性
 * @param {Boolean} reverse true表示升序排列，false降序排序
 */
export const SORT_BY = function(key, reverse = true) {
  const rev = reverse ? 1 : -1
  return function(a, b) {
    a = a[key]
    b = b[key]
    if (a < b) return rev * -1
    if (a > b) return rev * 1
    return 0
  }
}

/**
 * @param {Number} type // 1: 开始时间的控制；2: 结束时间的控制。
 * @param {Number} disabledDate // -1: 只根据已选的临界时间做限制；0：今天之前的时间不可选；1：今天及之前的时间的不可选；2：今明和之前的日期不可选；以此类推
 * @param {Boolean} criticalDisabled // 临界时间是否不可选
 * @param {String/Number} criticalTime // 临界时间
 */
export const PICKER_OPTIONS2 = function(type = 1, disabledDate = -1, criticalDisabled = true, sTime, eTime) {
  console.log(type, sTime, eTime)
  const obj = {
    disabledDate: time => {
      const formatTime = moment(time).format('YYYY-MM-DD')
      if (Number(type) === 1) {
        let formatETime = eTime ? moment(eTime).format('YYYY-MM-DD') : ''
        if (eTime && criticalDisabled) formatETime = moment(eTime).subtract(1, 'days').format('YYYY-MM-DD')
        if (disabledDate < 0) return formatETime ? formatTime > formatETime : false
        else {
          return formatTime < moment(new Date()).add(disabledDate, 'days').format('YYYY-MM-DD') || (formatETime && formatTime > formatETime)
        }
      } else {
        let formatSTime = sTime ? moment(sTime).format('YYYY-MM-DD') : ''
        if (sTime && criticalDisabled) formatSTime = moment(sTime).add(1, 'days').format('YYYY-MM-DD')
        if (disabledDate < 0) return formatSTime ? formatTime < formatSTime : false
        else {
          return formatSTime ? formatTime < formatSTime : formatTime < moment(new Date()).add(disabledDate, 'days').format('YYYY-MM-DD')
        }
      }
    }
  }
  const selectableRange = returnSelectableRange(type, criticalDisabled, sTime, eTime)
  if (selectableRange) obj.selectableRange = selectableRange
  return obj
}

function returnSelectableRange(type, criticalDisabled, sTime, eTime) {
  let selectableRange = ''
  if (sTime && eTime && moment(sTime).format('YYYY-MM-DD') === moment(eTime).format('YYYY-MM-DD')) {
    if (type === 1) {
      selectableRange = criticalDisabled ? '00:00:00 - ' + moment(eTime).format('HH:mm:ss') : '00:00:00 - ' + moment(eTime).subtract(1, 'seconds').format('HH:mm:ss')
    } else {
      selectableRange = criticalDisabled ? moment(sTime).format('HH:mm:ss') + ' - 23:59:59' : moment(sTime).add(1, 'seconds').format('HH:mm:ss') + ' - 23:59:59'
    }
  }
  console.log(selectableRange)
  return selectableRange
}

export const PICKER_OPTIONS = function(type = 1, disabledDate = -1, criticalDisabled = true, criticalTime) {
  return {
    disabledDate: time => {
      const formatTime = moment(time).format('YYYY-MM-DD')
      let formCriticalTime = criticalTime ? formCriticalTime = moment(criticalTime).format('YYYY-MM-DD') : ''
      if (Number(type) === 1) {
        if (criticalTime && criticalDisabled) formCriticalTime = moment(criticalTime).subtract(1, 'days').format('YYYY-MM-DD')
        if (disabledDate < 0) return formCriticalTime ? formatTime > formCriticalTime : false
        else {
          return formatTime < moment(new Date()).add(disabledDate, 'days').format('YYYY-MM-DD') || (formCriticalTime && formatTime > formCriticalTime)
        }
      } else {
        if (criticalTime && criticalDisabled) formCriticalTime = moment(criticalTime).add(1, 'days').format('YYYY-MM-DD')
        if (disabledDate < 0) return formCriticalTime ? formatTime < formCriticalTime : false
        else {
          return formCriticalTime ? formatTime < formCriticalTime : formatTime < moment(new Date()).add(disabledDate, 'days').format('YYYY-MM-DD')
        }
      }
    }
  }
}
