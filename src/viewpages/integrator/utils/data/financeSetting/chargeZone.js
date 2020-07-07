import i18n from '@/lang/index'

export default function RETURN_DATA() {
  return {
    COLUMN_DEFS: [
      { width: 40, pinned: 'left', lockPinned: true, headerCheckboxSelection: true, checkboxSelection: true, suppressSizeToFit: true, cellClass: 'textC' },
      { headerName: i18n.t('finance.chargeZoneName'), field: 'zoneName', width: 230, cellClass: 'link_primary' },
      { headerName: i18n.t('finance.description'), field: 'zoneDesc', width: 200 },
      { headerName: i18n.t('creator'), field: 'creator', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('createTime'), field: 'dateCreated', width: 180, cellClass: 'textC' },
      { headerName: i18n.t('lastModifier'), field: 'modifier', width: 200, cellClass: 'textC' },
      { headerName: i18n.t('lastModifiedTime'), field: 'dateModified', width: 180, cellClass: 'textC' }
    ],
    QUERY_FORM: {
      pageNum: 1,
      pageSize: 100,
      zoneName: ''
    },
    FORM: {
      uuid: '',
      zoneName: '',
      zoneDesc: '',
      items: []
    },
    ITEM_OBJ: {
      zoneUUID: '',
      isEdit: true,
      country: '',
      state: '',
      postCodeStart: '',
      postCodeEnd: ''
    },
    FORM_RULES: {
      zoneName: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.chargeZoneName'), trigger: ['change'] }],
      country: [{ required: true, message: i18n.t('message.selectRequired') + i18n.t('userInfo.country'), trigger: ['change'] }],
      postCodeStart: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.postCodeStart'), trigger: ['blur', 'change'] }],
      postCodeEnd: [{ required: true, message: i18n.t('message.inputRequired') + i18n.t('finance.postCodeEnd'), trigger: ['blur', 'change'] }]
    }
  }
}
