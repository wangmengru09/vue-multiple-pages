<template>
  <div id="finance-insurance">
    <div class="container">
      <div class="container-header">
        <el-form :model="queryForm" :label-width="$t('finance.insuanceQueryLable')" size="mini">
          <el-row>
            <el-col :sm="9" :lg="6">
              <el-form-item :label="$t('finance.insuranceRate') + ' (%)'">
                <el-input-number v-model="queryForm.rate" size="mini" :controls="false" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :lg="8">
              <el-form-item :label="$t('finance.validTime')">
                <el-row>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="queryForm.validityStart"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickOptions(1, -1, false, queryForm.validityEnd)"
                      type="date"
                      placeholder="≥"
                      style="width:100%;"
                      class="placeholder-center"
                    />
                  </el-col>
                  <el-col :span="2" class="textC">—</el-col>
                  <el-col :span="11">
                    <el-date-picker
                      v-model="queryForm.validityEnd"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickOptions(2, -1, false, queryForm.validityStart)"
                      type="date"
                      placeholder="≤"
                      class="placeholder-center"
                      style="width:100%;"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button type="primary" size="small" @click="getGridData()">{{ $t('search') }}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="container-main">
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="onAddRate">{{ $t('add') }}</el-button>
        </div>
        <ag-grid-vue
          id="financeInsurance_gird"
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
    <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="isShowDialog" :close-on-click-modal="false" width="450px" center>
      <el-form ref="form" :model="form" :rules="formRules" :label-width="$t('finance.insuranceLabelWidth')" size="mini">
        <el-form-item :label="$t('finance.insuranceRate') + ' (%)'" prop="rate">
          <el-input-number v-model="form.rate" size="mini" :min="0" :precision="2" :controls="false" style="width:100%;" />
        </el-form-item>
        <el-form-item :label="$t('finance.validDateStart') + ' ( ≥ )'" prop="validityStart">
          <el-date-picker
            v-model="form.validityStart"
            value-format="yyyy-MM-dd"
            :picker-options="pickOptions(1, 1, true, form.validityEnd)"
            type="date"
            placeholder=""
            style="width:100%;"
          />
        </el-form-item>
        <el-form-item :label="$t('finance.validDateEnd') + ' (＜)'">
          <el-date-picker
            v-model="form.validityEnd"
            value-format="yyyy-MM-dd"
            :disabled="isDisabledStart"
            :picker-options="pickOptions(2, 2, true, form.validityStart)"
            type="date"
            placeholder=""
            style="width:100%;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSaveRate">{{ $t('save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { AgGridVue } from 'ag-grid-vue'
import Pagination from '@/components/Pagination/index.vue'
import OperationBtn from './cellRenderer/OperationBtn.vue'
import AG_GRID_DATA from '@/utils/agGrid'
import RETURN_DATA from '@I/utils/data/financeSetting/insurance'
import { PICKER_OPTIONS, MERGE } from '@/utils/common'
import { finance } from '@I/api/requestUrl'
import { operateInsuranceRate, deleteInsuranceRate } from '@I/api/financeSetting/insurance'

export default {
  name: 'FinanceSettingInsurance',
  components: {
    AgGridVue,
    Pagination,
    OperationBtn // eslint-disable-line
  },
  data() {
    return {
      isShowDialog: false,
      isDisabledStart: false,
      dialogTitle: '',
      sideBar: { ...AG_GRID_DATA.SIDEBAR },
      columnDefs: [...RETURN_DATA().COLUMN_DEFS],
      gridOptions: { ...AG_GRID_DATA.GRID_OPTIONS, ...{ defaultColDef: {}, context: { componentParent: this }}},
      rowData: [],
      statusOptions: [],
      total: 0,
      queryForm: { ...RETURN_DATA().QUERY_FORM },
      form: { ...RETURN_DATA().FORM },
      formRules: { ...RETURN_DATA().FORM_RULES },
      pickOptions: PICKER_OPTIONS
    }
  },
  mounted() {
    this.getGridData()
  },
  methods: {
    getGridData() {
      this.$getGridData({
        url: finance.getInsuranceRateList,
        method: 'post',
        params: this.queryForm,
        gridOptions: this.gridOptions
      })
        .then(res => {
          this.rowData = res.data.content
          this.total = res.data.total
        })
    },
    // 添加
    onAddRate() {
      this.isShowDialog = true
      this.isDisabledStart = false
      this.dialogTitle = this.$t('add')
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = { ...RETURN_DATA().FORM }
      })
    },
    // 编辑
    onEditRate(data) {
      this.isShowDialog = true
      this.dialogTitle = this.$t('edit')
      const todayDate = moment(new Date()).format('YYYY-MM-DD')
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = { ...data }
        this.isDisabledStart = this.form.validityStart <= todayDate && this.form.validityEnd >= todayDate
      })
    },
    // 保存
    onSaveRate() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const url = this.form.uuid ? finance.updateInsuranceRate : finance.addInsuranceRate
        const method = this.form.uuid ? 'put' : 'post'
        const obj = MERGE({ ...RETURN_DATA().FORM }, this.form, false)
        operateInsuranceRate(url, method, obj).then(res => {
          this.isShowDialog = false
          this.$message.success(this.$t('message.saveSuccess'))
          this.getGridData()
        })
      })
    },
    // 刪除
    onDeleteRate(row) {
      this.$confirm(this.$t('message.deleteTip'), this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        deleteInsuranceRate({ key: row.uuid }).then(res => {
          this.$message.success(this.$t('message.deleteSuccess'))
          this.getGridData()
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang='scss' scoped>
#finance-insurance {
  width: 100%;
  height: 100%;

  .header-title {
    font-size: 12px;
    color: #606266;
  }
  /deep/.el-button.el-button--text {
    padding: 0;
  }
}
</style>
