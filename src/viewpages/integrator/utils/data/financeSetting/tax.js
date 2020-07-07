import i18n from '@/lang/index'

export default function RETURN_DATA() {
  return {
    COLUMN_DEFS: [
      { width: 40, pinned: 'left', lockPinned: true, headerCheckboxSelection: true, checkboxSelection: true, suppressSizeToFit: true, cellClass: 'textC' },
      { headerName: i18n.t('finance.taxName'), field: 'name', width: 200, cellClass: 'link_primary' },
      { headerName: i18n.t('service'), field: 'channelName', width: 160 },
      { headerName: i18n.t('currency'), field: 'currency', cellClass: 'textC', width: 120 },
      { headerName: i18n.t('status'), field: 'statusMessage', cellClass: 'textC', width: 150, cellClassRules: {
        'successColor': params => params.data.status === 1,
        'dangerColor': params => params.data.status === 0
      }},
      { headerName: i18n.t('creator'), field: 'creatorAccount', cellClass: 'textC', width: 130 },
      { headerName: i18n.t('createTime'), field: 'dateCreated', cellClass: 'textC', width: 140 },
      { headerName: i18n.t('lastModifier'), field: 'lastModifier', cellClass: 'textC', width: 140 },
      { headerName: i18n.t('lastModifiedTime'), field: 'dateModified', cellClass: 'textC', width: 160 }
    ],
    QUERY: {
      currency: [],
      status: [],
      channels: []
    },
    QUERY_FORM: {
      pageNum: 1,
      pageSize: 100,
      taxName: '',
      currencies: '',
      status: '',
      channels: '',
      startDate: '',
      endDate: '',
      validityStart: '',
      validityEnd: ''
    },
    ADD_FORM: {
      name: '',
      channelId: '',
      currency: '',
      itemVoList: [
        {
          uuid: '',
          validityStart: '',
          validityEnd: '',
          detailVos: [
            {
              uuid: '',
              declaredValueType: 0
            }
          ]
        }
      ]
    },
    ADD_FORM_RULES: {
      name: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.taxName'), trigger: 'blur' }],
      channelId: [{ required: true, message: i18n.t('message.selectRequired') + i18n.t('service'), trigger: ['blur', 'change'] }],
      currency: [{ required: true, message: i18n.t('message.selectRequired') + i18n.t('currency'), trigger: ['blur', 'change'] }],
      taxRate: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.taxRate'), trigger: ['blur'] }]
    },
    VALID_ITEM: {
      validityStart: '',
      validityEnd: '',
      detailVos: [
        {
          declaredValueType: 0
        }
      ]
    }
  }
}
