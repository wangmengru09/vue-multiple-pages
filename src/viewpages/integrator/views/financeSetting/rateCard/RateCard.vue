<template>
  <div id="finance-rate-card">
    <div class="container">
      <div class="container-header">
        <el-form label-width="120px" size="mini">
          <el-row>
            <el-col :sm="9" :lg="7">
              <el-form-item :label="$t('finance.rateCardName')">
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
                    :label="item.name"
                    :value="item.type"
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
                      :picker-options="pickerOptions(1, -1, false, queryForm.endTime)"
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
                      :picker-options="pickerOptions(2, -1, false, queryForm.startTime)"
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
          <el-button type="primary" size="small" @click="goToInfoPage()">{{ $t('add') }}</el-button>
          <el-button type="success" size="small" @click="onEditRateCard">{{ $t('edit') }}</el-button>
          <el-button type="primary" size="small" @click="onChangeRateCardStatus(1)">{{ $t('enable') }}</el-button>
          <el-button type="danger" size="small" @click="onChangeRateCardStatus(0)">{{ $t('disable') }}</el-button>
        </div>
        <ag-grid-vue
          id="financeRateCard_gird"
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
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import Pagination from '@/components/Pagination/index'
import AG_GRID_DATA from '@/utils/agGrid'
import RETURN_DATA from '@I/utils/data/financeSetting/rateCard'
import { HAS_SELECTED_ROWS, PICKER_OPTIONS } from '@/utils/common'
import { finance } from '@I/api/requestUrl'
import { getActivityTypes } from '@/api/common'
import { updateRateCardStatus } from '@I/api/financeSetting/rateCard'

export default {
  name: 'FinanceRateCard',
  components: {
    AgGridVue,
    Pagination
  },
  data() {
    return {
      sideBar: { ...AG_GRID_DATA.SIDEBAR },
      columnDefs: [...RETURN_DATA().COLUMN_DEFS],
      gridOptions: { ...AG_GRID_DATA.GRID_OPTIONS },
      rowData: [],
      total: 0,
      queryForm: { ...RETURN_DATA().QUERY_FORM },
      statusOptions: [],
      currencyOptions: [],
      pickerOptions: PICKER_OPTIONS
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
        url: finance.getRateCardList,
        method: 'get',
        params: this.queryForm,
        gridOptions: this.gridOptions
      }).then(res => {
        this.rowData = res.data.content
        this.total = res.data.total
      })
    },
    onGridCellClicked(params) {
      if (params.column && params.column.colId === 'name') {
        this.goToInfoPage(params.data.uuid)
      } else if (params.column && params.column.colId === 'configCount') {
        window.open(process.env.VUE_APP_ETOWER_URL + 'set/rate/clientsSet/' + params.data.uuid)
      }
    },
    // 获取status类型
    getStatusOptions() {
      getActivityTypes().then(res => {
        this.statusOptions = res.data
      })
    },
    // 编辑
    onEditRateCard() {
      const selectedRow = HAS_SELECTED_ROWS(this.gridOptions, false)
      if (!selectedRow) return
      this.goToInfoPage(selectedRow[0].uuid)
    },
    // 启用、暂停价卡
    onChangeRateCardStatus(active) {
      const selectedRows = HAS_SELECTED_ROWS(this.gridOptions, true)
      if (!selectedRows) return
      let tip = ''
      if (active) tip = this.$t('finance.changeRateCardTip2')
      else tip = this.$t('finance.changeRateCardTip1')
      this.$confirm(tip, this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const uuids = selectedRows.map(e => e.uuid)
        updateRateCardStatus({ uuids, active }).then(res => {
          this.$message.success(this.$t('message.success'))
          this.getGridData()
        })
      }).catch(() => {})
    },
    // 跳转详情页
    goToInfoPage(uuid) {
      this.$store.dispatch('tagsView/delCachedView', { name: 'FinaceRateCardInfo' }).then(() => {
        this.$router.push({ path: '/financeSetting/rateCard/info', query: { uuid }})
      })
    }
  }
}
</script>
<style lang='scss' scoped>
#finance-rate-card {
  width: 100%;
  height: 100%;
}
</style>
