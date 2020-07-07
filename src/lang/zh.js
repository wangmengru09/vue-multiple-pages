import errorMessage from './message/zh'
import financeSettingZh from './financeSetting/zh'
import commonZh from './common/zh'
import templateZh from './template/zh'

export default {
  common: {
    login: '登录',
    loading: '数据请求中...',
    sessionTimeout: '您的会话超时，请重新登录！',
    warning: '提示',
    oneRowData: '请选择一条数据。',
    userEmail: '用户邮箱',
    password: '密码',
    forgotPassword: '忘记密码',
    retrievePassword: '找回密码',
    sendEmail: '发送邮件',
    backToLogin: '返回登录'
  },
  userInfo: {
    companyName: '公司名称',
    province: '省',
    state: '州',
    countryCode: '国家编码',
    country: '国家',
    region: '地区',
    city: '市',
    zipCode: '邮编',
    district: '区',
    name: '名称',
    phone: '电话',
    email: '邮箱',
    addressLine1: '地址第一行',
    addressLine2: '地址第二行',
    addressLine3: '地址第三行',
    address: '地址'
  },
  login: {
    trackShipment: '货物追踪',
    tip1: '请在下面输入订单号的参考号',
    tip2: '可输入多个，每行一个。 一次最多可以输入20行。',
    recentSearches: '最近查询'
  },
  navbar: {
    dashboard: '首页',
    logOut: '退出',
    loginIn: '登录',
    languageTips: '语言切换成功',
    copyRightTime: '版权所有© 2013-2020',
    copyRightCompany: '上海沃行信息技术有限公司',
    copyRightNum: '沪ICP备14001465号',
    changePassword: '修改密码',
    back: '返回',
    newPassword: '新密码',
    confirmpassword: '确认密码',
    passwordLabelWidth: '80px'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  i18n_ag_grid: {
    // for filter panel
    page: '页',
    more: '更多',
    to: '-',
    of: '至',
    next: 'next',
    last: '上一页',
    first: '第一页',
    previous: 'previous',
    loadingOoo: '加载...',
    // for set filter
    selectAll: '全选',
    searchOoo: '搜索...',
    blanks: '空白',
    // for number filter and text filter
    filterOoo: '过滤...',
    applyFilter: '应用过滤...',
    // for number filter
    equals: '等于',
    lessThan: '小于',
    greaterThan: '大于',
    // for text filter
    contains: '包含',
    startsWith: '从开始',
    endsWith: '结束',
    // the header of the default group column
    group: '组',
    // tool panel
    columns: '设置列',
    filters: '过滤器',
    rowGroupColumns: '行群列',
    rowGroupColumnsEmptyMessage: '行组列空消息',
    valueColumns: '值列',
    pivotMode: '枢轴模式',
    groups: '组',
    values: '值',
    pivots: '枢轴',
    valueColumnsEmptyMessage: '值列空消息',
    pivotColumnsEmptyMessage: '枢轴列空消息',
    toolPanelButton: '工具面板按钮',
    // other
    noRowsToShow: '无查询结果',
    // enterprise menu
    pinColumn: '锁定列',
    valueAggregation: '值聚集',
    autosizeThiscolumn: '自动调整列',
    autosizeAllColumns: '自动调整所有列',
    groupBy: '分组',
    ungroupBy: '不分组',
    resetColumns: '重置',
    expandAll: '展开',
    collapseAll: '收缩',
    toolPanel: '工具面板',
    'export': '导出',
    csvExport: 'CSV ',
    excelExport: 'Excel ',
    // enterprise menu pinning
    pinLeft: '锁定 左侧',
    pinRight: '锁定 右侧',
    noPin: '不锁定 <>',
    // enterprise menu aggregation and status panel
    sum: '和',
    min: '最小',
    max: '最大',
    none: '没有',
    count: '计数',
    average: '平均值',
    // standard menu
    copy: '复制',
    copyWithHeaders: '复制包含表头',
    ctrlC: 'ctrl n C',
    paste: '粘贴',
    ctrlV: 'ctrl n V'
  },
  ...errorMessage,
  ...financeSettingZh,
  ...commonZh,
  ...templateZh
}
