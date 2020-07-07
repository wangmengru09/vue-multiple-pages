import i18n from '@/lang/index'

export default function RETURN_DATA() {
  return {
    COLUMN_DEFS: [
      { width: 40, pinned: 'left', lockPinned: true, headerCheckboxSelection: true, checkboxSelection: true, suppressSizeToFit: true, cellClass: 'textC' },
      { headerName: i18n.t('finance.rateCardName'), field: 'name', width: 200, cellClass: 'link_primary' },
      { headerName: i18n.t('finance.rateCardDetails'), field: 'configCount', width: 180, cellClass: 'textR', cellRenderer: params => {
        if (!params.data) return ''
        const count = params.data.configCount ? params.data.configCount : 0
        return "<div class='link_primary'>" + count + ' ' + i18n.t('counts') + '</div>'
      } },
      { headerName: i18n.t('currency'), field: 'currency', width: 130, cellClass: 'textC' },
      { headerName: i18n.t('status'), field: 'activeMessage', width: 150, cellClass: 'textC', cellClassRules: {
        'successColor': params => params.data.active,
        'dangerColor': params => !params.data.active
      }},
      { headerName: i18n.t('creator'), field: 'creator', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('createTime'), field: 'dateCreated', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('lastModifier'), field: 'dateModified', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('lastModifiedTime'), field: 'modifier', width: 200, cellClass: 'textC' }
    ],
    QUERY_FORM: {
      pageNum: 1,
      pageSize: 100,
      name: '',
      currency: [],
      active: [],
      startTime: '',
      endTime: ''
    },
    RATE_CARD_FORM: {
      uuid: '',
      name: '',
      currency: '',
      openPrice: 0,
      condition1: false,
      condition2: false,
      unitWeight: 6000,
      volumeRatio: '',
      remark: ''
    },
    FORM: {
      uuid: '',
      name: '',
      currency: '',
      openPrice: 0,
      volumeRatio: '',
      remark: '',
      items: []
    },
    RATE_CARD_FORM_RULES: {
      name: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.rateCardName'), trigger: 'blur' }],
      currency: [{ required: true, message: i18n.t('message.selectRequired') + i18n.t('currency'), trigger: ['blur', 'change'] }]
    },
    DETAIL_FORM_ITEM: {
      uuid: '',
      isEdit: true,
      validityStart: '',
      validityEnd: '',
      details: []
    },
    DETAIL_ITEM: {
      uuid: '',
      isEdit: true,
      pickupRate: 0,
      dropoffRate: 0,
      pickupHandlingFee: 0,
      dropoffHandlingFee: 0,
      discount: 0,
      country: '',
      zoneId: ''
    },
    UPLOAD_FORM: {
      rateUUID: '',
      startDate: '',
      endDate: ''
    },
    UPLOAD_FORM_RULES: {
      startDate: [{ required: true, message: i18n.t('message.pickRequired') + i18n.t('finance.validTime'), trigger: ['change', 'blur'] }]
    }
  }
}
