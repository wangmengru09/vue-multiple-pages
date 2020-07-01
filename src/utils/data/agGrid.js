import vue from 'vue'

// function isFirstColumn(params) {
//   const displayedColumns = params.columnApi.getAllDisplayedColumns()
//   const thisIsFirstColumn = displayedColumns[0] === params.column
//   return thisIsFirstColumn
// }
const AG_GRID_DATA = {
  SIDEBAR: { toolPanels: ['columns'], visible: false },
  GRID_OPTIONS: {
    defaultColDef: {
      width: 150,
      // headerCheckboxSelection: isFirstColumn,
      // checkboxSelection: isFirstColumn,
      // headerCheckboxSelectionFilteredOnly: isFirstColumn,
      enableRowGroup: true
    },
    suppressExcelExport: true, // 禁止导出Excel
    suppressCsvExport: true, // 禁止导出CSV
    suppressRowClickSelection: true,
    enableFilter: true,
    rowSelection: 'multiple',
    rowDeselection: true,
    maxBlocksInCache: 1,
    onDragStopped: vue.prototype.$columnSetFunc,
    onColumnVisible: vue.prototype.$columnSetFunc,
    onGridReady: vue.prototype.$gridReadyFunc,
    defaultExportParams: {
      suppressTextAsCDATA: true
    },
    excelStyles: [
      {
        id: 'createdTime',
        dataType: 'dateTime'
      }
    ]
  }
}
export default AG_GRID_DATA
