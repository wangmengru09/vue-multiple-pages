import i18n from '@/lang/index'

export default function RETURN_DATA() {
  return {
    COLUMN_DEFS: [
      { headerName: i18n.t('currency'), field: 'currencyCode', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('finance.BOCConversionPrice'), field: 'bocConversionPrice', width: 200, cellClass: 'textR' },
      { headerName: i18n.t('finance.BOCReleaseTime'), field: 'bocReleaseTime', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('createTime'), field: 'dateCreated', width: 200, cellClass: 'textC' }
    ],
    QUERY_FORM: {
      pageNum: 1,
      pageSize: 100,
      currencies: '',
      bocReleaseTimeStart: '',
      bocReleaseTimeEnd: ''
    }
  }
}
