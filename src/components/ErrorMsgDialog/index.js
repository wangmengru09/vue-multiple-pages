import Vue from 'vue'
import errorMsgDialog from './index.vue'
import $i18n from '@/lang/index'

let errorMsgInstance
const ErrorMsgDialog = Vue.extend(errorMsgDialog)

ErrorMsgDialog.install = (options) => {
  errorMsgInstance = new ErrorMsgDialog().$mount()

  document.body.appendChild(errorMsgInstance.$el)
}
/**
 * options：Object
 * params{String} title，弹框的title
 * params{String} confirmText，确认按钮的名称
 * params{Number} time 自动关闭弹框的时间
 * params{Array} content 展示的message
 */
/**
 * options：string、number、array
 * 展示的message
 */
Vue.prototype.$openErrorMessage = function(options) {
  if (options === undefined || options == null) {
    options = {
      content: ''
    }
  } else if (typeof options === 'string' || typeof options === 'number' || Array.isArray(options)) {
    options = {
      content: options
    }
  }
  errorMsgInstance.openDialog({
    title: options.title || $i18n.t('message.errorMsg'),
    confirmText: options.confirmText || $i18n.t('confirm'),
    content: options.content || []
  })
}

export default ErrorMsgDialog
