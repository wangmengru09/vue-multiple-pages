<template>
  <div id="finance-surcharge">
    <div class="container">
      <div class="container-header">
        <el-form label-width="120px" size="mini">
          <el-row>
            <el-col :sm="9" :lg="7">
              <el-form-item :label="$t('finance.surchargeName')">
                <el-input v-model="queryForm.name" clearable />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="9">
              <el-form-item :label="$t('currency')">
                <el-select v-model="queryForm.currency" multiple filterable clearable placeholder>
                  <el-option
                    v-for="item in currencyOptions"
                    :key="item.code"
                    :label="item.code"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="9" :lg="7">
              <el-form-item :label="$t('status')">
                <el-select v-model="queryForm.active" multiple filterable clearable placeholder>
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.type"
                    :value="item.type"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="9">
              <el-form-item :label="$t('createTime')">
                <el-row>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="queryForm.startTime"
                      :picker-options="pickOptions(1, -1, false, queryForm.endTime)"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder
                      style="width: 100%;"
                    />
                  </el-col>
                  <el-col :span="2" style="text-align:center;">—</el-col>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="queryForm.endTime"
                      :picker-options="pickOptions(2, -1, false, queryForm.startTime)"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder
                      style="width: 100%;"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button type="primary" size="small" @click="getGridData">{{ $t('search') }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="container-main">
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="onAddSurcharge">{{ $t('add') }}</el-button>
          <el-button type="success" size="small" @click="onEditSurcharge">{{ $t('edit') }}</el-button>
          <el-button type="primary" size="small" @click="onChangeSurchangeStatus(1)">{{ $t('enable') }}</el-button>
          <el-button type="danger" size="small" @click="onChangeSurchangeStatus(0)">{{ $t('disable') }}</el-button>
        </div>
        <ag-grid-vue
          id="financeSurcharge_gird"
          ref="agGrid"
          class="ag-theme-balham"
          :locale-text="$t('i18n_ag_grid')"
          :enable-col-resize="true"
          :enable-sorting="true"
          :column-defs="columnDefs"
          :grid-options="gridOptions"
          :row-data="rowData"
          :side-bar="sideBar"
          :is-to-fit-column="false"
          :cell-clicked="onGridCellClicked"
          style="width: 100%; height: 100%;"
        />
        <pagination
          :total="total"
          :page.sync="queryForm.pageNum"
          :limit.sync="queryForm.pageSize"
          @pagination="getGridData"
        />
      </div>
    </div>

    <!-- 添加/编辑 -->
    <el-dialog v-el-drag-dialog :title="addDialogTitle" :visible.sync="isShowAddDialog" :close-on-click-modal="false" width="500px" center>
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" :label-width="$t('finance.surchargeLabelWidth')" size="mini">
        <el-form-item :label="$t('finance.surchargeName')" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item :label="$t('currency')" prop="currency">
          <el-select v-model="addForm.currency" filterable clearable placeholder>
            <el-option
              v-for="item in currencyOptions"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('finance.batterySurcharge')" prop="batteryCharge">
          <el-row>
            <el-col :span="12">
              <el-input-number v-model="addForm.batteryCharge" :controls="false" style="width:100%;" />
            </el-col>
            <el-col :span="11" :offset="1">
              <el-select v-model="addForm.unitOfBatteryCalculation" filterable placeholder>
                <el-option
                  v-for="item in unitOptions"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('finance.otherSurcharge')" prop="otherCharge">
          <el-row>
            <el-col :span="12">
              <el-input-number v-model="addForm.otherCharge" :controls="false" style="width:100%;" />
            </el-col>
            <el-col :span="11" :offset="1">
              <el-select v-model="addForm.unitOfOtherCalculation" filterable placeholder>
                <el-option
                  v-for="item in unitOptions"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="onSaveSurcharge">{{ $t('save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import Pagination from '@/components/Pagination/index'
import AG_GRID_DATA from '@/utils/agGrid'
import RETURN_DATA from '@I/utils/data/financeSetting/surcharge'
import { HAS_SELECTED_ROWS, PICKER_OPTIONS } from '@/utils/common'
import { finance } from '@I/api/requestUrl'
import { getActivityTypes } from '@/api/common'
import { getOneSurcharge, getSurchargeUnit, operateSurcharge, updateSurchargeStatus } from '@I/api/financeSetting/surcharge'

export default {
  name: 'FinanceSurcharge',
  components: {
    AgGridVue,
    Pagination
  },
  data() {
    return {
      isShowAddDialog: false,
      sideBar: { ...AG_GRID_DATA.SIDEBAR },
      columnDefs: [...RETURN_DATA().COLUMN_DEFS],
      gridOptions: { ...AG_GRID_DATA.GRID_OPTIONS },
      rowData: [],
      total: 0,
      queryForm: { ...RETURN_DATA().QUERY_FORM },
      currencyOptions: [],
      statusOptions: [],
      unitOptions: [],
      pickOptions: PICKER_OPTIONS,
      addDialogTitle: '',
      addForm: { ...RETURN_DATA().ADD_FORM },
      addFormRules: {
        ...RETURN_DATA().ADD_FORM_RULES,
        batteryCharge: [{ validator: this.validateBatterySur, trigger: ['blur'] }],
        otherCharge: [{ validator: this.validateOtherSur, trigger: ['blur'] }]
      }
    }
  },
  async mounted() {
    this.getGridData()
    this.getStatusOptions()
    this.currencyOptions = await this.$getCurrencyData()
  },
  methods: {
    getGridData() {
      this.$getGridData({
        url: finance.getSurchargeList,
        method: 'get',
        params: this.queryForm,
        gridOptions: this.gridOptions
      })
        .then(res => {
          this.rowData = res.data.content
          this.total = res.data.total
        })
    },
    getStatusOptions() {
      getActivityTypes().then(res => {
        this.statusOptions = res.data
      })
    },
    onGridCellClicked(params) {
      if (params.column && params.column.colId === 'name') {
        this.getOneOfSurcharge(params.data)
      } else if (params.column && params.column.colId === 'configCount') {
        window.open(process.env.VUE_APP_ETOWER_URL + 'set/rate/clientsSet/' + params.data.uuid)
      }
    },
    // 查询单位
    getUnitOptions() {
      getSurchargeUnit().then(res => {
        this.unitOptions = res.data
      })
    },
    // 启用、暂停配置
    onChangeSurchangeStatus(active) {
      const selectedRows = HAS_SELECTED_ROWS(this.gridOptions)
      if (!selectedRows) return false
      let tip = ''
      if (active) tip = this.$t('finance.changeSurchargeTip2')
      else tip = this.$t('finance.changeSurchargeTip1')
      this.$confirm(tip, this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const uuids = selectedRows.map(e => e.uuid)
        updateSurchargeStatus({ uuids, active }).then(res => {
          this.$message.success(this.$t('message.success'))
          this.getGridData()
        })
      }).catch(() => {})
    },
    // 添加
    onAddSurcharge() {
      this.isShowAddDialog = true
      this.addDialogTitle = this.$t('add')
      this.getUnitOptions()
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
        this.addForm = { ...RETURN_DATA().ADD_FORM }
      })
    },
    // 查询一条surcharge详情
    getOneOfSurcharge(data) {
      this.isShowAddDialog = true
      this.addDialogTitle = this.$t('edit')
      this.getUnitOptions()
      getOneSurcharge({ uuid: data.uuid }).then(res => {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields()
          this.addForm = { ...res.data }
        })
      })
    },
    // 编辑
    onEditSurcharge() {
      const selectedRows = HAS_SELECTED_ROWS(this.gridOptions, false)
      if (!selectedRows) return false
      this.getOneOfSurcharge(selectedRows[0])
    },
    // 校验batteryCharge
    validateBatterySur(rule, value, callback) {
      if (value === undefined && this.addForm.otherCharge === undefined) {
        callback(new Error(this.$t('finance.surchargeErrorTip')))
      } else {
        this.$refs.addForm.clearValidate('otherCharge')
        callback()
      }
    },
    // 校验otherCharge
    validateOtherSur(rule, value, callback) {
      if (value === undefined && this.addForm.batteryCharge === undefined) {
        callback(new Error(this.$t('finance.surchargeErrorTip')))
      } else {
        this.$refs.addForm.clearValidate('batteryCharge')
        callback()
      }
    },
    // 保存
    onSaveSurcharge() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return
        const url = this.addForm.uuid ? finance.updateSurcharge : finance.addSurcharge
        const method = this.addForm.uuid ? 'put' : 'post'
        operateSurcharge(url, method, this.addForm).then(res => {
          this.isShowAddDialog = false
          this.$message.success(this.$t('message.saveSuccess'))
          this.getGridData()
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
