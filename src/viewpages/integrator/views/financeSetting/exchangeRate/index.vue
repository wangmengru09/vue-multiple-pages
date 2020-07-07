<template>
  <div id="finance-exchange-rate">
    <div class="container">
      <div class="container-header">
        <el-row>
          <el-col :sm="11" :lg="9">
            <div class="header-title">{{ $t('finance.exchangeRateTip1') }}</div>
            <div class="header-title">{{ $t('finance.exchangeRateTip2') }}</div>
            <el-link
              type="primary"
              href="https://www.boc.cn/sourcedb/whpj/index_8.html"
              target="_blank"
              style="font-size:12px;"
            >{{ $t('finance.exchangeRateTip3') }}</el-link>
          </el-col>
          <el-col :sm="13" :lg="12">
            <el-form label-width="80px" size="mini">
              <el-row>
                <el-col :sm="18" :lg="16">
                  <el-form-item :label="$t('currency')">
                    <el-select v-model="queryCurrency" multiple filterable clearable placeholder>
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
                <el-col :sm="18" :lg="16">
                  <el-form-item :label="$t('date')">
                    <el-row>
                      <el-col :span="11">
                        <el-date-picker
                          v-model="queryForm.bocReleaseTimeStart"
                          :picker-options="pickerOptions(1, -1, false, queryForm.bocReleaseTimeEnd)"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder
                          style="width: 100%;"
                        />
                      </el-col>
                      <el-col :span="2" style="text-align:center;">—</el-col>
                      <el-col :span="11">
                        <el-date-picker
                          v-model="queryForm.bocReleaseTimeEnd"
                          :picker-options="pickerOptions(2, -1, false, queryForm.bocReleaseTimeStart)"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder
                          style="width: 100%;"
                        />
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="4" :offset="2">
                  <el-button type="primary" size="small" @click="getGridData">{{ $t('search') }}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div class="container-main">
        <ag-grid-vue
          id="financeExchangeRate_gird"
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
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import Pagination from '@/components/Pagination/index'
import AG_GRID_DATA from '@/utils/data/agGrid'
import RETURN_DATA from '@I/utils/data/financeSetting/exchangeRate'
import { finance } from '@I/api/requestUrl'
import { PICKER_OPTIONS } from '@/utils/common'

export default {
  name: 'FinanceSettingExchangeRate',
  components: {
    AgGridVue,
    Pagination
  },
  data() {
    return {
      isEditRate: false,
      sideBar: { ...AG_GRID_DATA.SIDEBAR },
      columnDefs: [...RETURN_DATA().COLUMN_DEFS],
      gridOptions: { ...AG_GRID_DATA.GRID_OPTIONS, ...{ defaultColDef: {}}},
      rowData: [],
      total: 0,
      queryCurrency: [],
      queryForm: { ...RETURN_DATA().QUERY_FORM },
      currencyOptions: [],
      pickerOptions: PICKER_OPTIONS
    }
  },
  async mounted() {
    this.getGridData()
    this.currencyOptions = await this.$getCurrencyData()
  },
  methods: {
    getGridData() {
      this.queryForm.currencies = this.queryCurrency.join(',')
      this.$getGridData({
        url: finance.getExchangeRateList,
        method: 'post',
        params: this.queryForm,
        gridOptions: this.gridOptions
      })
        .then(res => {
          this.rowData = res.data.content
          this.total = res.data.total
        })
    }
  }
}
</script>
<style lang='scss' scoped>
#finance-exchange-rate {
  width: 100%;
  height: 100%;
  .header-title {
    font-size: 12px;
    color: #606266;
    margin: 5px 0;
  }
}
</style>
