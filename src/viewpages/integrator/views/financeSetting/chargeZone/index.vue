<template>
  <div>
    <div class="container">
      <div class="container-header">
        <el-form :inline="true">
          <el-form-item :label="$t('finance.chargeZoneName')">
            <el-input v-model="queryForm.zoneName" size="mini" clearable style="width:200px;" />
          </el-form-item>
          <el-form-item label=" " label-width="30px">
            <el-button type="primary" size="small" @click="getGridData">{{ $t('search') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="container-main">
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="onAddChargeZone">{{ $t('add') }}</el-button>
          <el-button type="success" size="small" @click="onEditChargeZone">{{ $t('edit') }}</el-button>
          <el-button type="danger" size="small" @click="onDeleteChargeZone">{{ $t('delete') }}</el-button>
        </div>
        <ag-grid-vue
          id="financeChargeZone_gird"
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
    <el-dialog v-el-drag-dialog :title="dialogTitle" :visible.sync="isShowDialog" :close-on-click-modal="false" width="720px" center>
      <el-form ref="form" :model="form" :rules="formRules" size="mini" :label-width="$t('finance.chargeZoneLabelWidth')">
        <el-form-item :label="$t('finance.chargeZoneName')" prop="zoneName">
          <el-input v-model="form.zoneName" type="text" clearable style="width:70%;" />
        </el-form-item>
        <el-form-item :label="$t('finance.description')">
          <el-input v-model="form.zoneDesc" type="textarea" rows="2" resize="none" style="width:70%;" />
        </el-form-item>
        <el-table
          ref="table"
          :data="form.items"
          :header-cell-style="{ padding: '7px 0', backgroundColor: '#f0f0f0' }"
          :cell-style="{ padding: '5px 0' }"
          border
          tooltip-effect="dark"
          style="width: 100%;"
          height="400px"
        >
          <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            :label="$t('userInfo.country') + ' / ' + $t('userInfo.region')"
          >
            <template slot="header">
              <span>{{ $t('userInfo.country') + ' / ' + $t('userInfo.region') }} <span class="dangerColor">*</span></span>
            </template>
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.isEdit" label-width="0" :prop="'items.' + scope.$index + '.country'" :rules="formRules.country">
                <el-select v-model="scope.row.country" size="mini" filterable clearable placeholder>
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.code"
                    :label="$store.getters.language === 'en' ? item.name : item.nameCn"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
              <div v-else class="text-overflow">{{ scope.row.countryName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            show-overflow-tooltip
            :label="$t('userInfo.state')"
          >
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.isEdit" label-width="0">
                <el-input v-model="scope.row.state" />
              </el-form-item>
              <div v-else class="text-overflow">{{ scope.row.state ? scope.row.state : '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            :label="$t('finance.postCodeStart')"
          >
            <template slot="header">
              <span>{{ $t('finance.postCodeStart') }} <span class="dangerColor">*</span></span>
            </template>
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.isEdit" label-width="0" :prop="'items.' + scope.$index + '.postCodeStart'" :rules="formRules.postCodeStart">
                <el-input v-model="scope.row.postCodeStart" type="text" />
              </el-form-item>
              <div v-else class="text-overflow">{{ scope.row.postCodeStart }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            :label="$t('finance.postCodeEnd')"
          >
            <template slot="header">
              <span>{{ $t('finance.postCodeEnd') }} <span class="dangerColor">*</span></span>
            </template>
            <template slot-scope="scope">
              <el-form-item v-if="scope.row.isEdit" label-width="0" :prop="'items.' + scope.$index + '.postCodeEnd'" :rules="formRules.postCodeEnd">
                <el-input v-model="scope.row.postCodeEnd" type="text" />
              </el-form-item>
              <div v-else class="text-overflow">{{ scope.row.postCodeEnd }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            width="100"
            fixed="right"
            align="center"
          >
            <template slot="header">
              <el-button type="primary" size="mini" icon="el-icon-plus" circle plain @click="onAddItem" />
              <el-button type="success" size="mini" icon="el-icon-edit" circle plain @click="onEditItem" />
            </template>
            <template slot-scope="scope">
              <el-button
                v-show="scope.row.isEdit"
                :disabled="form.items.length <= 1"
                type="text"
                size="mini"
                icon="el-icon-remove-outline"
                class="dangerColor"
                style="font-size:24px;"
                @click="onDeleteItem(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSaveChargeZone">{{ $t('save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue'
import Pagination from '@/components/Pagination/index'
import AG_GRID_DATA from '@/utils/agGrid'
import RETURN_DATA from '@I/utils/data/financeSetting/chargeZone'
import { HAS_SELECTED_ROWS } from '@/utils/common'
import { finance } from '@I/api/requestUrl'
import { getOneChargeZone, operateChargeZone } from '@I/api/financeSetting/chargeZone'

export default {
  name: 'FinanceChargeZone',
  components: {
    AgGridVue,
    Pagination
  },
  data() {
    return {
      isEditRate: false,
      isShowDialog: false,
      sideBar: { ...AG_GRID_DATA.SIDEBAR },
      columnDefs: [...RETURN_DATA().COLUMN_DEFS],
      gridOptions: { ...AG_GRID_DATA.GRID_OPTIONS },
      rowData: [],
      total: 0,
      queryForm: { ...RETURN_DATA().QUERY_FORM },
      dialogTitle: '',
      countryOptions: [],
      form: { ...RETURN_DATA().FORM },
      formRules: { ...RETURN_DATA().FORM_RULES }
    }
  },
  async mounted() {
    this.getGridData()
    this.countryOptions = await this.$getCountryData()
  },
  methods: {
    getGridData() {
      this.$getGridData({
        url: finance.getChargeZoneData,
        method: 'get',
        params: this.queryForm,
        gridOptions: this.gridOptions
      })
        .then(res => {
          this.rowData = res.data.content
          this.total = res.data.total
        })
    },
    onGridCellClicked(params) {
      if (params.column && params.column.colId === 'zoneName') {
        this.getOneChargeZoneData(params.data.uuid)
      }
    },
    // 获取一条数据
    getOneChargeZoneData(zoneUUID) {
      this.isShowDialog = true
      this.dialogTitle = this.$t('edit')
      this.$nextTick(() => {
        this.$refs.table.doLayout()
        this.$refs.form.resetFields()
      })
      getOneChargeZone({ zoneUUID }).then(res => {
        this.form = { ...res.data }
      })
    },
    // 添加chargeZone
    onAddChargeZone() {
      this.isShowDialog = true
      this.dialogTitle = this.$t('add')
      this.$nextTick(() => {
        this.$refs.table.doLayout()
        this.$refs.form.resetFields()
        this.form = { ...RETURN_DATA().FORM, ...{ items: [{ ...RETURN_DATA().ITEM_OBJ }] }}
      })
    },
    // 编辑chargeZone
    onEditChargeZone() {
      const selectedRow = HAS_SELECTED_ROWS(this.gridOptions, false)
      if (!selectedRow) return
      this.getOneChargeZoneData(selectedRow[0].uuid)
    },
    // 添加一个详情
    onAddItem() {
      this.form.items.push({ ...RETURN_DATA().ITEM_OBJ, ...{ zoneUUID: this.form.uuid }})
    },
    // 编辑详情
    onEditItem() {
      this.form.items.forEach((item, index) => {
        if (!item.isEdit) this.form.items.splice(index, 1, { ...item, ...{ isEdit: true }})
      })
    },
    // 删除一个详情
    onDeleteItem(index) {
      this.$confirm(this.$t('message.deleteTip'), this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.form.items.splice(index, 1)
      }).catch(() => {})
    },
    // 保存chargeZone
    onSaveChargeZone() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const method = this.form.uuid ? 'put' : 'post'
        operateChargeZone(method, this.form).then(res => {
          this.isShowDialog = false
          this.$message.success(this.$t('message.saveSuccess'))
          this.getGridData()
        })
      })
    },
    // 删除chargeZone
    onDeleteChargeZone() {
      const selectedRows = HAS_SELECTED_ROWS(this.gridOptions, true)
      if (!selectedRows) return
      this.$confirm(this.$t('message.deleteChargeZoneTip'), this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const zoneUUIDs = selectedRows.map(e => e.uuid)
        operateChargeZone('delete', { zoneUUIDs }).then(res => {
          this.$message.success(this.$t('message.deleteSuccess'))
          this.getGridData()
        })
      }).catch(() => {})
    },
    // 校验邮编
    validatePostCodeStart(rule, value, callback) {
      if (value == null || value === undefined) callback(new Error(this.$t('message.required')))
      else {
        const index = rule.fullField.split('.')[1]
        const obj = this.form.items[index]
        if ((obj.postCodeStart == null || obj.postCodeStart === undefined) || (obj.postCodeEnd == null || obj.postCodeEnd === undefined)) callback()
        else if (obj.postCodeStart > obj.postCodeEnd) callback(new Error(this.$t('finance.sNGreatorE')))
        else {
          this.$refs.form.clearValidate('items.' + index + '.postCodeStart')
          this.$refs.form.clearValidate('items.' + index + '.postCodeEnd')
          // TODO 编码范围重叠校验
          callback()
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.header-title {
  font-size: 14px;
  color: #606266;
}
/deep/.el-table__row {
  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>
