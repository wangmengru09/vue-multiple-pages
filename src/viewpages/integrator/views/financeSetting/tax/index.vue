<template>
  <div id="finance-tax" ref="financeTax">
    <div class="container">
      <div class="container-header">
        <el-form :label-width="$t('finance.taxQueryLabelWidth')" size="mini">
          <el-row>
            <el-col :sm="12" :lg="5">
              <el-form-item :label="$t('finance.taxName')">
                <el-input v-model="queryForm.taxName" clearable />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('currency')" label-width="70px">
                    <el-select v-model="query.currency" multiple filterable clearable placeholder="">
                      <el-option
                        v-for="item in currencyOptions"
                        :key="item.code"
                        :label="item.code"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('status')" label-width="50px">
                    <el-select v-model="query.status" multiple filterable clearable placeholder="">
                      <el-option
                        v-for="item in statusOptions"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('finance.taxRate') + ' (%)'">
                <el-row>
                  <el-col :span="11">
                    <el-input-number v-model="queryForm.taxRateStart" :controls="false" placeholder="≥" style="width:100%;" />
                  </el-col>
                  <el-col :span="2" style="text-align:center;">
                    —
                  </el-col>
                  <el-col :span="11">
                    <el-input-number v-model="queryForm.taxRateEnd" :controls="false" placeholder="≤" style="width:100%;" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="12" :lg="5">
              <el-form-item :label="$t('service')">
                <el-select v-model="query.channels" multiple filterable clearable placeholder="">
                  <el-option
                    v-for="item in serviceOptions"
                    :key="item.channelId"
                    :label="item.name"
                    :value="item.channelId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('finance.validTime')" label-width="70px">
                    <el-date-picker
                      v-model="queryForm.validityStart"
                      :picker-options="pickerOptions(1, -1, false, queryForm.validityEnd)"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="≥"
                      style="width:100%;"
                      class="placeholder-center"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="—" label-width="50px" class="valid-time-line">
                    <el-date-picker
                      v-model="queryForm.validityEnd"
                      :picker-options="pickerOptions(2, -1, false, queryForm.validityStart)"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="≤"
                      class="placeholder-center"
                      style="width:100%;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :sm="9" :lg="8">
              <el-form-item :label="$t('createTime')">
                <el-row>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="queryForm.startDate"
                      :picker-options="pickerOptions(1, -1, false, queryForm.endDate)"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder=""
                      style="width:100%;"
                    />
                  </el-col>
                  <el-col :span="2" style="text-align:center;">
                    —
                  </el-col>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="queryForm.endDate"
                      :picker-options="pickerOptions(2, -1, false, queryForm.startDate)"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      placeholder=""
                      style="width:100%;"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :sm="2" :offset="1">
              <el-button type="primary" size="small" @click="getGridData">{{ $t('search') }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="container-main">
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="onAddTax">{{ $t('add') }}</el-button>
          <el-button type="success" size="small" @click="onEditTax">{{ $t('edit') }}</el-button>
          <el-button type="primary" size="small" @click="onchangeTaxConfigStatus(1)">{{ $t('enable') }}</el-button>
          <el-button type="danger" size="small" @click="onchangeTaxConfigStatus(0)">{{ $t('disable') }}</el-button>
        </div>
        <ag-grid-vue
          id="financeTax_gird"
          ref="agGrid"
          class="ag-theme-balham"
          :locale-text="$t('i18n_ag_grid')"
          :enable-col-resize="true"
          :enable-sorting="true"
          :column-defs="columnDefs"
          :grid-options="gridOptions"
          :row-data="rowData"
          :side-bar="sideBar"
          :is-to-fit-column="true"
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

    <!-- 添加 -->
    <el-dialog
      v-el-drag-dialog
      :title="addDialogTitle"
      :visible.sync="isShowAddDialog"
      :close-on-click-modal="false"
      width="750px"
      center
    >
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="100px" size="mini">
        <el-form-item :label="$t('finance.taxName')" prop="name">
          <el-input v-model="addForm.name" style="width:55.1%;" />
        </el-form-item>
        <el-form-item :label="$t('service')" prop="channelId">
          <el-select v-model="addForm.channelId" filterable placeholder="" style="width:55.1%;">
            <el-option
              v-for="item in serviceOptions"
              :key="item.channelId"
              :label="item.name"
              :value="item.channelId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('currency')" prop="currency">
          <el-select v-model="addForm.currency" filterable placeholder="" style="width:55.1%;">
            <el-option
              v-for="item in currencyOptions"
              :key="item.code"
              :label="item.code"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <div v-for="(el, i) in addForm.itemVoList" :key="i" class="valid-time-wrap">
          <el-form-item :label="$t('finance.validDate')" :prop="'itemVoList.' + i + '.validDateRange'" :rules="addFormRules.validDateRange">
            <el-row>
              <el-col :span="10">
                <el-date-picker
                  v-model="el.validityStart"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions(1, -1, true, el.validityEnd)"
                  type="date"
                  placeholder="≥"
                  style="width:100%;"
                  class="placeholder-center"
                />
              </el-col>
              <el-col :span="1" class="textC">—</el-col>
              <el-col :span="10">
                <el-date-picker
                  v-model="el.validityEnd"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions(2, -1, true, el.validityStart)"
                  type="date"
                  placeholder="＜"
                  style="width:100%;"
                  class="placeholder-center"
                />
              </el-col>
              <el-col :span="3" style="padding-left:25px;">
                <el-button type="success" icon="el-icon-plus" size="mini" circle style="padding:3px;" @click="onAddValidDate(i)" />
                <el-button v-show="addForm.itemVoList.length > 1" type="danger" icon="el-icon-minus" size="mini" circle style="padding:3px;margin-left:5px;" @click="onDeleteValidDate(i)" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-row v-for="(item, index) in el.detailVos" :key="index" class="value-wrap">
            <el-col :span="13">
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('finance.declareValue')">
                    <el-select v-model="item.declaredValueType" filterable placeholder="">
                      <el-option
                        v-for="e in rangeOptions"
                        :key="e.type"
                        :label="e.name"
                        :value="e.type"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="0"
                    :prop="'itemVoList.' + i + '.detailVos.' + index + '.declaredValueRange'"
                    :rules="addFormRules.declaredValueRange"
                  >
                    <el-row>
                      <el-col :span="12">
                        <el-form-item
                          label-width="5px"
                          style="margin-bottom:0;"
                        >
                          <el-input-number v-model="item.declaredValueStart" :min="0" :controls="false" style="width:100%;" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label-width="5px"
                          style="margin-bottom:0;"
                        >
                          <el-input-number v-model="item.declaredValueEnd" :min="0" :controls="false" style="width:100%;" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('finance.taxRate')" label-width="80px" :prop="'itemVoList.' + i + '.detailVos.' + index + '.taxRate'" :rules="addFormRules.taxRate">
                <el-row>
                  <el-col :span="21">
                    <el-input-number v-model="item.taxRate" :min="0" :controls="false" style="width:100%;" />
                  </el-col>
                  <el-col :span="3" style="text-align:right;">%</el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="padding-left:10px;">
              <el-form-item label-width="0">
                <el-button type="success" icon="el-icon-plus" size="mini" circle style="padding:3px;" @click="onAddTaxItem(i, index)" />
                <el-button v-show="el.detailVos.length > 1" type="danger" icon="el-icon-minus" size="mini" circle style="padding:3px;margin-left:2px;" @click="onDeleteTaxItem(i, index)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveTaxConfig">{{ $t('save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import Pagination from '@/components/Pagination/index'
import AG_GRID_DATA from '@/utils/data/agGrid'
import RETURN_DATA from '@I/utils/data/financeSetting/tax'
import { HAS_SELECTED_ROWS, PICKER_OPTIONS } from '@/utils/common'
import { finance } from '@I/api/requestUrl'
import { updateTaxStatus, saveTax, getOneTax, getTaxStatus, getTaxRangeType } from '@I/api/financeSetting/tax'

export default {
  name: 'FinanceSettingTax',
  components: {
    AgGridVue,
    Pagination
  },
  data() {
    return {
      isShowAddDialog: false,
      isShowDeclareValue: false,
      sideBar: { ...AG_GRID_DATA.SIDEBAR },
      columnDefs: [...RETURN_DATA().COLUMN_DEFS],
      gridOptions: { ...AG_GRID_DATA.GRID_OPTIONS },
      rowData: [],
      total: 0,
      addDialogTitle: '',
      query: { ...RETURN_DATA().QUERY },
      queryForm: { ...RETURN_DATA().QUERY_FORM },
      addForm: { ...RETURN_DATA().ADD_FORM },
      addFormRules: {
        ...RETURN_DATA().ADD_FORM_RULES,
        declaredValueRange: [{ validator: this.validateRange, trigger: 'blur' }],
        validDateRange: [{ required: true, validator: this.validateDateRange, trigger: 'blur' }]
      },
      serviceOptions: [],
      currencyOptions: [],
      statusOptions: [],
      rangeOptions: [],
      valueErrorList: [],
      pickerOptions: PICKER_OPTIONS
    }
  },
  async mounted() {
    this.getGridData()
    this.getStatusList()
    this.getTaxRangeTypeList()
    this.serviceOptions = await this.$getIntegratorChannel()
    this.currencyOptions = await this.$getCurrencyData()
  },
  methods: {
    getGridData() {
      this.queryForm = {
        ...this.queryForm,
        ...{
          currencies: this.query.currency.join(','),
          status: this.query.status.join(','),
          channels: this.query.channels.join(',')
        }
      }
      this.$getGridData({
        url: finance.getTaxList,
        method: 'post',
        params: this.queryForm,
        gridOptions: this.gridOptions
      })
        .then(res => {
          this.rowData = res.data.content
          this.total = res.data.total
        })
    },
    // 查询所有的状态
    getStatusList() {
      getTaxStatus().then(res => {
        this.statusOptions = res.data
      })
    },
    // 查询所有的税率范围类型
    getTaxRangeTypeList() {
      getTaxRangeType().then(res => {
        this.rangeOptions = res.data
      })
    },
    onGridCellClicked(params) {
      if (params.column && params.column.colId === 'name') {
        this.getTaxConfig(params.data.channelId)
      }
    },
    // 根据channelId查询税费
    getTaxConfig(channelId) {
      getOneTax({ channelId }).then(res => {
        this.isShowAddDialog = true
        this.addDialogTitle = this.$t('edit')
        this.$nextTick(() => {
          this.$refs.addForm.resetFields()
          this.addForm = { ...res.data }
          this.addForm.originalChannelId = this.addForm.channelId
          this.addForm.itemVoList.forEach(item => {
            item.detailVos.forEach(el => {
              if (el.declaredValueStart == null) el.declaredValueStart = undefined
              if (el.declaredValueEnd == null) el.declaredValueEnd = undefined
              if (el.taxRate == null) el.taxRate = undefined
            })
          })
        })
      })
    },
    // 启用、暂停配置
    onchangeTaxConfigStatus(status) {
      const selectedRows = HAS_SELECTED_ROWS(this.gridOptions)
      if (!selectedRows) return false
      let tip = ''
      if (status) tip = this.$t('finance.changeTaxConfigTip2')
      else tip = this.$t('finance.changeTaxConfigTip1')
      this.$confirm(tip, this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const channels = selectedRows.map(e => e.channelId).join(',')
        updateTaxStatus({ status, channels }).then(res => {
          this.$message.success(this.$t('message.success'))
          this.getGridData()
        })
      }).catch(() => {})
    },
    // 添加税费
    onAddTax() {
      this.isShowAddDialog = true
      this.addDialogTitle = this.$t('add')
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
        this.addForm = { ...RETURN_DATA().ADD_FORM }
      })
    },
    // 编辑税费
    onEditTax() {
      const selectedRows = HAS_SELECTED_ROWS(this.gridOptions, false)
      if (!selectedRows) return false
      this.getTaxConfig(selectedRows[0].channelId)
    },
    // 添加一个有效期
    onAddValidDate(i) {
      this.addForm.itemVoList.splice(i + 1, 0, { ...RETURN_DATA().VALID_ITEM })
      console.log(this.valueErrorList)
      if (this.valueErrorList.length > 0) {
        this.valueErrorList.splice(i + 1, 0, { dateTip: '', valueTip: [] })
        this.$refs.addForm.clearValidate()
        this.$nextTick(() => {
          // 触发重新校验
          this.saveTaxConfig()
        })
      }
    },
    // 删除一个有效期
    onDeleteValidDate(i) {
      this.addForm.itemVoList.splice(i, 1)
      if (this.valueErrorList.length > 0) {
        this.valueErrorList.splice(i, 1)
        this.$refs.addForm.clearValidate()
        this.$nextTick(() => {
          // 触发重新校验
          this.saveTaxConfig()
        })
      }
    },
    // 添加一个税率区段
    onAddTaxItem(i, index) {
      this.addForm.itemVoList[i].detailVos.splice(index + 1, 0, { declaredValueType: 0 })
      if (this.valueErrorList.length > 0 && this.valueErrorList[i].valueTip.length > 0) {
        this.valueErrorList[i].valueTip.splice(index + 1, 0, '')
        this.$nextTick(() => {
          // 触发重新校验
          this.saveTaxConfig()
        })
      }
    },
    // 删除一个税率区段
    onDeleteTaxItem(i, index) {
      this.addForm.itemVoList[i].detailVos.splice(index, 1)
      if (this.valueErrorList[i] && this.valueErrorList[i].valueTip[index]) {
        this.valueErrorList[i].valueTip.splice(index, 1)
        this.$nextTick(() => {
          // 触发重新校验
          this.saveTaxConfig()
        })
      }
    },
    // 保存
    saveTaxConfig() {
      // 校验每个有效期区间包含的价值范围，拿到declaredValueRange的errorList，用来校验declaredValueRange
      this.checkAllTaxRateRange()
      // addForm中加了declaredValueRange字段，用来校验价值范围是否重叠
      // 由于页面并未展示该字段，所以需手动校验改字段
      this.addForm.itemVoList.forEach((item, index) => {
        item.detailVos.forEach((el, i) => {
          this.$refs.addForm.validateField(['itemVoList.' + index + '.detailVos.' + i + '.declaredValueRange'])
        })
      })
      this.$refs.addForm.validate(valid => {
        if (!valid) return
        const url = this.addForm.originalChannelId ? finance.updateTax : finance.addTax
        const method = this.addForm.originalChannelId ? 'put' : 'post'
        saveTax(url, method, this.addForm).then(res => {
          this.isShowAddDialog = false
          this.$message.success(this.$t('message.saveSuccess'))
          this.getGridData()
        })
      })
    },
    // ----------------------- 校验 ------------------------
    // 校验所有的区间是否满足要求
    checkAllTaxRateRange() {
      this.addForm.itemVoList.forEach((el, i) => {
        const tempArr = []
        const obj = {}
        if (!el.validityStart) obj.dateTip = this.$t('message.pickRequired') + this.$t('finance.validDate')
        else if (!this.hasOverlappingValidDate(i, el.validityStart, el.validityEnd)) obj.dateTip = this.$t('finance.validDateOverlap')
        el.detailVos.forEach((item, index) => {
          const startVal = item.declaredValueStart
          const endVal = item.declaredValueEnd
          const type = item.declaredValueType
          let errorTip = ''
          if (type !== 1 && startVal >= endVal) errorTip = this.$t('finance.sLessE')
          else if (type === 1 && startVal > endVal) errorTip = this.$t('finance.sNGreatorE')
          if (this.addForm.itemVoList[i].detailVos.length > 1 && ((startVal == null || startVal === undefined) && (endVal == null || endVal === undefined))) errorTip = this.$t('finance.rangeOverlap')
          else if (!this.iSNoOverlappingRange(i, startVal, endVal, type, index)) errorTip = this.$t('finance.rangeOverlap')
          tempArr[index] = errorTip
          obj.valueTip = tempArr
        })
        this.valueErrorList[i] = obj
      })
    },
    // 判断是否都满足条件没有重叠的价值范围
    // dateIndex，有效期的index；startVal：起始申报价值；endVal：截止申报价值；type：区间类型；index：当前申报范围的index。
    iSNoOverlappingRange(dateIndex, startVal, endVal, type, index) {
      const result = this.addForm.itemVoList[dateIndex].detailVos.every((item, i) => {
        if (i === Number(index) || ((item.declaredValueStart == null || item.declaredValueStart === undefined) && (item.declaredValueEnd == null || item.declaredValueEnd === undefined))) return true
        if (startVal && endVal) {
          if (type === 0 || item.declaredValueType === 0 || (type === 2 && item.declaredValueType === 2)) return startVal >= item.declaredValueEnd || (startVal <= item.declaredValueStart && endVal <= item.declaredValueStart)
          else if ((type === 1 || type === 3) && item.declaredValueType === 2) return startVal > item.declaredValueEnd || (startVal <= item.declaredValueStart && endVal <= item.declaredValueStart)
          else if (type === 1 && item.declaredValueType === 1) return startVal > item.declaredValueEnd || (startVal < item.declaredValueStart && endVal < item.declaredValueStart)
          else if (type === 1 && item.declaredValueType === 3) return startVal >= item.declaredValueEnd || (startVal < item.declaredValueStart && endVal < item.declaredValueStart)
          else if (type === 2 && (item.declaredValueType === 1 || item.declaredValueType === 3)) return startVal >= item.declaredValueEnd || (startVal <= item.declaredValueStart && endVal < item.declaredValueStart)
          else if (type === 3 && item.declaredValueType === 1) return startVal > item.declaredValueEnd || (startVal < item.declaredValueStart && endVal <= item.declaredValueStart)
          else if (type === 3 && item.declaredValueType === 3) return startVal >= item.declaredValueEnd || (startVal < item.declaredValueStart && endVal <= item.declaredValueStart)
        } else if (startVal) {
          if (type === 0 || type === 2 || item.declaredValueType === 0 || (type === 3 && item.declaredValueType === 3)) return startVal >= item.declaredValueEnd
          else if ((type === 1 || type === 3) && (item.declaredValueType === 1 || item.declaredValueType === 2)) return startVal > item.declaredValueEnd
        } else if (endVal) {
          if (type === 0 || type === 3 || item.declaredValueType === 0) return endVal <= item.declaredValueStart
          else if ((type === 1 || type === 2) && (item.declaredValueType === 1 || item.declaredValueType === 2)) return endVal < item.declaredValueStart
        }
      })
      return result
    },
    // 校验是否有重叠的有效期
    hasOverlappingValidDate(index, sTime, eTime) {
      const noEndTimeList = this.addForm.itemVoList.filter(e => !e.validityEnd)
      if (noEndTimeList.length > 1) return false
      return this.addForm.itemVoList.every((item, i) => {
        if (i === Number(index)) return true
        else return sTime >= item.validityEnd || (eTime && eTime <= item.validityStart)
      })
    },
    // 校验申报价值范围是否重叠
    validateRange(rule, value, callback) {
      const index = rule.fullField.split('.')[1]
      const itemIndex = rule.fullField.split('.')[3]
      if (this.valueErrorList[index] && this.valueErrorList[index].valueTip[itemIndex]) callback(new Error(this.valueErrorList[index].valueTip[itemIndex]))
      else callback()
    },
    // 校验有效期范围是否重叠
    validateDateRange(rule, value, callback) {
      const index = rule.fullField.split('.')[1]
      if (this.valueErrorList[index] && this.valueErrorList[index].dateTip) callback(new Error(this.valueErrorList[index].dateTip))
      else callback()
    }
  }
}
</script>
<style lang='scss' scoped>
.valid-time-line {
  /deep/.el-form-item__label {
    position: relative;
    right: 6px;
  }
}

.valid-time-wrap {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 10px 10px 0;
  margin: 0 -10px 10px;
}
.value-wrap {
  /deep/.el-form-item {
    margin-bottom: 13px;
  }
}
</style>
