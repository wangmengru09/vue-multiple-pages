import { getCurrency, getGridData, getIntegratorChannel, getCountry } from '@/api/common'

export default {
  install: function(Vue) {
    /**
     * 缓存ag-grid配置
     * @param {*} params
     */
    Vue.prototype.$columnSetFunc = function(params) {
      const colState = params.columnApi.getColumnState()
      const id = params.api.gridCore.eGridDiv.id
      if (colState === '' || colState == null || colState === [] || id === '' || id == null) {
        console.log('缓存保存失败')
      } else {
        localStorage.setItem(id, JSON.stringify(colState))
      }
    }
    /**
     * ag-grid获取配置信息，及是否自适应列
     */
    Vue.prototype.$gridReadyFunc = function(params) {
      const { gridCore } = params.api
      const id = gridCore.eGridDiv.id
      const isToFitColumn = gridCore.eGridDiv.attributes['is-to-fit-column'] && gridCore.eGridDiv.attributes['is-to-fit-column'].value === 'true'
      if (isToFitColumn) {
        Vue.prototype.$nextTick(() => {
          params.api.sizeColumnsToFit()
        })
      }
      const colState = localStorage.getItem(id)
      if (!colState) {
        return ''
      }
      params.api.showLoadingOverlay()
      params.columnApi.setColumnState(JSON.parse(colState))
    }

    /**
     * 查询ag-grid列表数据
     * @param{String} url，请求的url，必传
     * @param{String} method，请求方式，默认'get'
     * @param{Object} params，Query params
     * @param{Object} data，body params
     * @param{Object} gridOptions，ag-grid配置对象
     * @return{Object} 请求url返回的数据
     */
    Vue.prototype.$getGridData = async({ url, method = 'get', params, data, gridOptions }) => {
      if (gridOptions && gridOptions.api) gridOptions.api.showLoadingOverlay()
      const res = await getGridData(url, method, params, data)
      return res
    }

    /**
     * 获取币种
     */
    Vue.prototype.$getCurrencyData = async() => {
      return new Promise(resolve => {
        getCurrency().then(res => {
          resolve(res.data)
        })
      })
    }

    /**
     * 获取所有的服务
     */
    Vue.prototype.$getIntegratorChannel = async() => {
      return new Promise(resolve => {
        getIntegratorChannel().then(res => {
          resolve(res.data)
        })
      })
    }

    /**
     * 获取所有的国家
     */
    Vue.prototype.$getCountryData = () => {
      return new Promise(resolve => {
        getCountry().then(res => {
          resolve(res.data)
        })
      })
    }
  }
}
