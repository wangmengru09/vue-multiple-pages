import errorMessage from './message/en'
import commonEn from './common/en'
import templateEn from './template/en'

export default {
  common: {
    login: 'Login',
    loading: 'Loading...',
    sessionTimeout: 'Your session is timed out, please login again !',
    warning: 'Warning',
    oneRowData: 'Please select a row of data.',
    userEmail: 'User Email',
    password: 'Password',
    forgotPassword: 'Forgot password',
    retrievePassword: 'Retrieve Password',
    sendEmail: 'Send Email',
    backToLogin: 'Back to login'
  },
  userInfo: {
    companyName: 'Company Name',
    province: 'Province',
    state: 'State',
    countryCode: 'Country Code',
    country: 'Country',
    region: 'Region',
    city: 'City',
    zipCode: 'Zip Code',
    district: 'District',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    addressLine1: 'Address Line 1',
    addressLine2: 'Address Line 2',
    addressLine3: 'Address Line 3',
    address: 'Address'
  },
  login: {
    trackShipment: 'Track Your Shipment',
    tip1: 'Please enter either the order number of reference number below:',
    tip2: 'Enter multiple entries, each on a new line. Up to 20 entries can be made at one time.',
    recentSearches: 'Recent Searches'
  },
  navbar: {
    dashboard: 'Dashboard',
    logOut: 'Logout',
    loginIn: 'Login In',
    languageTips: 'Switch Language Success',
    copyRightTime: 'Copyright© 2013-2020',
    copyRightCompany: 'WallTech Limited. All rights reserved',
    copyRightNum: '沪ICP备14001465号',
    changePassword: 'Change Password',
    back: 'Back',
    newPassword: 'New Password',
    confirmpassword: 'Confirm Password',
    passwordLabelWidth: '140px'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  pagination: {
    total: 'total',
    sizes: 'sizes',
    prev: 'prev',
    pager: 'pager',
    next: 'next',
    jumper: 'jumper'
  },
  i18n_ag_grid: {
    // for filter panel
    page: 'page',
    more: 'more',
    to: 'to',
    of: 'of',
    next: 'next',
    last: 'last',
    first: 'first',
    previous: 'previous',
    loadingOoo: 'loading...',
    // for set filter
    selectAll: 'Select All',
    searchOoo: 'search...',
    blanks: 'blanks',
    // for number filter and text filter
    filterOoo: 'filter...',
    applyFilter: 'Apply Filter...',
    // for number filter
    equals: 'equals',
    lessThan: 'Less Than',
    greaterThan: 'greaterThan',
    // for text filter
    contains: 'contains',
    startsWith: 'Starts With',
    endsWith: 'Ends With',
    // the header of the default group column
    group: 'group',
    // tool panel
    columns: 'columns',
    rowGroupColumns: 'Row Group Columns',
    rowGroupColumnsEmptyMessage: 'Row Group Columns Empty Message',
    valueColumns: 'Value Columns',
    pivotMode: 'Pivot Mode',
    groups: 'groups',
    values: 'values',
    pivots: 'pivots',
    valueColumnsEmptyMessage: 'Value Columns Empty Message',
    pivotColumnsEmptyMessage: 'Pivot Columns Empty Message',
    toolPanelButton: 'Tool Panel Button',
    // other
    noRowsToShow: 'No Rows To Show',
    // enterprise menu
    pinColumn: 'Pin Column',
    valueAggregation: 'Value Aggregation',
    autosizeThiscolumn: 'Autosize This column',
    autosizeAllColumns: 'Autosize All Columns',
    groupBy: 'Group by',
    ungroupBy: 'UnGroup by',
    resetColumns: 'Reset Those Cols',
    expandAll: 'Open-em-up',
    collapseAll: 'Close-em-up',
    toolPanel: 'Tool Panel',
    'export': 'Export',
    csvExport: 'CSV Export',
    excelExport: 'Excel Export',
    // enterprise menu pinning
    pinLeft: 'Pin <<',
    pinRight: 'Pin >>',
    noPin: 'DontPin <>',
    // enterprise menu aggregation and status panel
    sum: 'Sum',
    min: 'Min',
    max: 'Max',
    none: 'None',
    count: 'Count',
    average: 'Average',
    // standard menu
    copy: 'Copy',
    copyWithHeaders: 'Copy With Headers',
    ctrlC: 'ctrl + C',
    paste: 'Paste',
    ctrlV: 'ctrl + V'
  },
  ...errorMessage,
  ...commonEn,
  ...templateEn
}
