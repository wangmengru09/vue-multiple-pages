import i18n from '@/lang/index'

export default function RETURN_DATA() {
  return {
    COLUMN_DEFS: [
      { width: 40, pinned: 'left', lockPinned: true, headerCheckboxSelection: true, checkboxSelection: true, suppressSizeToFit: true, cellClass: 'textC' },
      { headerName: i18n.t('finance.surchargeName'), field: 'name', width: 200, cellClass: 'link_primary' },
      { headerName: i18n.t('finance.surchargeDetails'), field: 'configCount', width: 200, cellClass: 'textR', cellRenderer: params => {
        if (!params.data) return ''
        const configCount = params.data.configCount ? params.data.configCount : 0
        return "<div class='link_primary'>" + configCount + ' ' + i18n.t('counts') + '</div>'
      } },
      { headerName: i18n.t('currency'), field: 'currency', width: 100, cellClass: 'textC' },
      { headerName: i18n.t('finance.batterySurcharge'), field: 'batteryCharge', width: 150, cellClass: 'textR', cellRenderer: params => {
        if (!params.data || params.data.batteryCharge == null) return '-'
        else return params.data.batteryCharge
      } },
      { headerName: i18n.t('finance.batteryUnit'), field: 'unitOfBatteryCalculationMessage', width: 150, cellClass: 'textC' },
      { headerName: i18n.t('finance.otherSurcharge'), field: 'otherCharge', width: 150, cellClass: 'textR', cellRenderer: params => {
        if (!params.data || params.data.otherCharge == null) return '-'
        else return params.data.otherCharge
      } },
      { headerName: i18n.t('finance.otherUnit'), field: 'unitOfOtherCalculationMessage', width: 150, cellClass: 'textC' },
      { headerName: i18n.t('status'), field: 'activeMessage', width: 150, cellClass: 'textC', cellClassRules: {
        'successColor': params => params.data.active,
        'dangerColor': params => !params.data.active
      }},
      { headerName: i18n.t('creator'), field: 'creator', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('createTime'), field: 'dateCreated', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('lastModifier'), field: 'modifier', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('lastModifiedTime'), field: 'dateModified', width: 200, cellClass: 'textC' }
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
    ADD_FORM: {
      uuid: '',
      name: '',
      currency: '',
      batteryCharge: undefined,
      unitOfBatteryCalculation: 0,
      otherCharge: undefined,
      unitOfOtherCalculation: 1
    },
    ADD_FORM_RULES: {
      name: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.surchargeName'), trigger: 'blur' }],
      currency: [{ required: true, message: i18n.t('message.selectRequired') + i18n.t('currency'), trigger: ['blur', 'change'] }]
    }
  }
}
