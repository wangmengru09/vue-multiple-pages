import i18n from '@/lang/index'

export default function RETURN_DATA() {
  return {
    COLUMN_DEFS: [
      { headerName: i18n.t('finance.insuranceRate') + '（%）', field: 'rate', width: 200, cellClass: 'textR', cellRenderer: params => {
        if (!params.data) return ''
        if (params.data.rate !== null) return params.data.rate.toFixed(2)
        else return '0.00'
      } },
      { headerName: i18n.t('status'), field: 'statusMessage', width: 200, cellClass: 'textC', cellClassRules: {
        'successColor': params => params.data.status === 1,
        'dangerColor': params => params.data.status === 0
      }},
      { headerName: i18n.t('finance.validDateStart'), field: 'validityStart', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('finance.validDateEnd'), field: 'validityEnd', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('creator'), field: 'creatorAccount', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('createTime'), field: 'dateCreated', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('operation'), field: 'id', width: 150, cellClass: 'textC', pinned: 'right', lockPinned: true, suppressSizeToFit: true, cellRendererFramework: 'OperationBtn' }
    ],
    QUERY_FORM: {
      pageNum: 1,
      pageSize: 100
    },
    FORM: {
      uuid: '',
      rate: undefined,
      validityStart: '',
      validityEnd: ''
    },
    FORM_RULES: {
      rate: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.insuranceRate'), trigger: ['blur'] }],
      validityStart: [{ required: true, message: i18n.t('message.pickRequired') + i18n.t('finance.validDateStart'), trigger: ['change'] }]
    }
  }
}
