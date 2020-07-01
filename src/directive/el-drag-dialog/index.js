import drag from './drag'

const install = function(Vue) {
  Vue.directive('el-drag-dialog', drag)
}

drag.install = install
export default drag
