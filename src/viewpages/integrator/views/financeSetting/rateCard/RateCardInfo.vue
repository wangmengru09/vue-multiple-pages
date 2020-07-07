<template>
  <div id="finance-rate-card-info">
    <div class="container">
      <div class="container-header">
        <el-divider content-position="center">{{ title }}</el-divider>
      </div>
      <div class="container-main">
        <h3 class="primaryColor">{{ 'Rate Card Info' }}</h3>
        <el-form ref="form" :model="form" :rules="formRules" label-position="left" :label-width="$t('finance.rateCardLabelWidth')" size="mini" class="info-form">
          <el-form-item :label="$t('finance.rateCardName')" prop="name">
            <el-input v-model="form.name" style="width:400px;" clearable />
          </el-form-item>
          <el-form-item :label="$t('currency')" prop="currency">
            <el-select v-model="form.currency" filterable clearable placeholder style="width:400px;">
              <el-option
                v-for="item in currencyOptions"
                :key="item.code"
                :label="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('finance.openPrice')">
            <el-checkbox v-model="form.openPrice" />
          </el-form-item>
          <el-form-item :label="$t('remark')">
            <el-input v-model="form.remark" type="textarea" :rows="2" resize="none" style="width:400px;" />
          </el-form-item>
          <el-form-item :label="$t('finance.volumeRatio')">
            <div>
              <el-checkbox v-model="form.condition1" :disabled="form.condition2" @change="onConditionChange1" />
              {{ $t('finance.condition') }} 1:
              <span style="font-weight:bold;">（L * W * H） /  </span>
              <el-select v-model="form.unitWeight" :disabled="!form.condition1" placeholder style="width:80px;margin-left:5px;">
                <el-option label="6000" value="6000" />
                <el-option label="8000" value="8000" />
              </el-select>
              <span style="font-weight:bold;"> > </span>
              <el-form-item prop="ratio" style="width:80px;display:inline-block;margin-bottom:12px;">
                <el-input-number v-model="form.ratio" :disabled="!form.condition1" :min="0" :controls="false" style="width:80px;" />
              </el-form-item>
              {{ $t('finance.actualWeight') }}（{{ $t('Kg') }}）
            </div>
            <div style="margin-top:5px;">
              <el-checkbox v-model="form.condition2" :disabled="!form.condition1" @change="onConditionChange2" />
              {{ $t('finance.condition') }} 2:
              <span style="font-weight:bold;">（L + W + H）> </span>
              <el-form-item prop="sum" style="width:80px;display:inline-block;margin-bottom:12px;">
                <el-input-number v-model="form.sum" :disabled="!form.condition2" :min="0" :controls="false" size="mini" style="width:80px;" />
              </el-form-item>
              {{ $t('cm') }}
            </div>
            <div class="note-tip">{{ $t('finance.rateCardInfoNoteTip') }}</div>
          </el-form-item>
          <el-form-item v-show="!isAddRateCard" class="textC" style="width:500px;">
            <el-button type="primary" size="medium" style="padding:7px 50px;" @click="onSaveRateCardInfo">{{ $t('save') }}</el-button>
          </el-form-item>
        </el-form>
        <h3 class="primaryColor">{{ 'Rate Card Details' }}</h3>
        <div class="btn-wrap" style="margin-top:15px;">
          <el-button type="primary" size="small" @click="onAddDetail">{{ $t('add') }}</el-button>
          <el-button type="success" size="small" @click="onUploadDetail">{{ $t('upload') }}</el-button>
          <el-button type="danger" size="small" @click="onDeleteDetails">{{ $t('delete') }}</el-button>
        </div>
        <el-form ref="detailForm" :model="detailForm" :rules="detailFormRules" size="mini" class="dialog-form">
          <el-table
            ref="detailTable"
            :data="detailForm.validTimeList"
            :header-cell-style="{ padding: '10px 0', backgroundColor: '#f0f0f0' }"
            :cell-style="{ padding: '8px 0' }"
            :expand-row-keys="expandRowKeys"
            row-key="uuid"
            tooltip-effect="dark"
            style="width: 100%;"
            min-height="500px"
            @selection-change="handleSelectionChange"
            @expand-change="onExpandChange"
          >
            <el-table-column
              type="selection"
              width="50"
              align="center"
            />
            <el-table-column
              type="expand"
            >
              <template slot-scope="props">
                <el-form v-show="!props.row.isEdit" :model="queryDetailForm[props.$index]" :inline="true" size="mini" class="query-form">
                  <el-form-item :label="$t('finance.chargeWeight')">
                    <el-input-number v-model="queryDetailForm[props.$index].weight" :controls="false" :min="0" :precision="3" style="width:100px;" />
                  </el-form-item>
                  <el-form-item :label="$t('userInfo.country') + ' / ' + $t('userInfo.region')">
                    <el-select v-model="queryDetailForm[props.$index].country" multiple filterable clearable placeholder style="width:150px;">
                      <el-option
                        v-for="item in countryOptions"
                        :key="item.code"
                        :label="$store.getters.language === 'zh' ? item.nameCn : item.name"
                        :value="item.code"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('finance.chargeZone')">
                    <el-select v-model="queryDetailForm[props.$index].zone" multiple filterable clearable placeholder style="width:150px;">
                      <el-option
                        v-for="item in chargeZoneOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label=" " label-width="30px">
                    <el-button type="primary" size="small" @click="onQueryDetailItems(props.$index, queryDetailForm[props.$index])">{{ $t('search') }}</el-button>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="props.row.details"
                  :header-cell-style="{ padding: '5px 0', fontSize: '12px', textAlign: 'center' }"
                  :cell-style="{ padding: '4px 0' }"
                  border
                  class="detail-table"
                  tooltip-effect="dark"
                  style="width: 100%;"
                  max-height="300px"
                >
                  <el-table-column
                    prop="weightStart"
                    width="155"
                    align="right"
                    show-overflow-tooltip
                    :label="$t('finance.weightStart') + '(≥Kg)'"
                  >
                    <template slot="header">
                      <span>{{ $t('finance.weightStart') + '(≥Kg)' }} <span class="dangerColor">*</span></span>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit" :prop="'validTimeList.' + props.$index + '.details.' + scope.$index +'.weightStart'" :rules="detailFormRules.weightStart">
                        <el-input-number v-model="scope.row.weightStart" :controls="false" :min="0" :precision="3" size="mini" />
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.weightStart ? scope.row.weightStart.toFixed(3) : '0.000' }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="weightEnd"
                    width="155"
                    align="right"
                    show-overflow-tooltip
                    :label="$t('finance.weightEnd') + '(≥Kg)'"
                  >
                    <template slot="header">
                      <span>{{ $t('finance.weightEnd') + '(≥Kg)' }} <span class="dangerColor">*</span></span>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit" :prop="'validTimeList.' + props.$index + '.details.' + scope.$index +'.weightEnd'" :rules="detailFormRules.weightEnd">
                        <el-input-number v-model="scope.row.weightEnd" :controls="false" :min="0" :precision="3" size="mini" />
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.weightEnd ? scope.row.weightEnd.toFixed(3) : '0.000' }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="pickupRate"
                    width="120"
                    align="right"
                    show-overflow-tooltip
                    :label="$t('finance.unitPriceP')"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit">
                        <el-input-number v-model="scope.row.pickupRate" :controls="false" :min="0" :precision="2" size="mini" />
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.pickupRate ? scope.row.pickupRate.toFixed(2) : '0.00' }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="dropoffRate"
                    width="120"
                    align="right"
                    show-overflow-tooltip
                    :label="$t('finance.unitPriceD')"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit">
                        <el-input-number v-model="scope.row.dropoffRate" :controls="false" :min="0" :precision="2" size="mini" />
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.dropoffRate ? scope.row.dropoffRate.toFixed(2) : '0.00' }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="pickupHandlingFee"
                    width="155"
                    align="right"
                    show-overflow-tooltip
                    :label="$t('finance.handlingFeeP')"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit">
                        <el-input-number v-model="scope.row.pickupHandlingFee" :controls="false" :min="0" :precision="2" size="mini" />
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.pickupHandlingFee ? scope.row.pickupHandlingFee.toFixed(2) : '0.00' }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="dropoffHandlingFee"
                    width="155"
                    align="right"
                    show-overflow-tooltip
                    :label="$t('finance.handlingFeeD')"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit">
                        <el-input-number v-model="scope.row.dropoffHandlingFee" :controls="false" :min="0" :precision="2" size="mini" />
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.dropoffHandlingFee ? scope.row.dropoffHandlingFee.toFixed(2) : '0.00' }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="discount"
                    align="right"
                    width="120"
                    show-overflow-tooltip
                    :label="$t('finance.discount') + '（%）'"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit">
                        <el-input-number v-model="scope.row.discount" :controls="false" :min="0" size="mini" />
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.discount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="country"
                    min-width="140"
                    align="center"
                    show-overflow-tooltip
                    :label="$t('userInfo.country') + ' / ' + $t('userInfo.region')"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit">
                        <el-select v-model="scope.row.country" size="mini" filterable clearable placeholder>
                          <el-option
                            v-for="item in countryOptions"
                            :key="item.code"
                            :label="$store.getters.language === 'zh' ? item.nameCn : item.name"
                            :value="item.code"
                          />
                        </el-select>
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.countryName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="zoneId"
                    min-width="140"
                    align="center"
                    show-overflow-tooltip
                    :label="$t('finance.chargeZone')"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="scope.row.isEdit">
                        <el-select v-model="scope.row.zoneId" size="mini" filterable clearable placeholder>
                          <el-option
                            v-for="item in chargeZoneOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                      <div v-else class="text-overflow">{{ scope.row.zoneName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operation"
                    width="100"
                    fixed="right"
                    align="center"
                  >
                    <template slot="header">
                      <el-button v-show="props.row.isEdit" type="primary" size="mini" icon="el-icon-plus" circle plain @click="onAddDetailItem(props.$index)" />
                      <a :href="downloadHref + '?sessionId=' + $store.getters.token + '&itemUUID=' + props.row.uuid" download>
                        <el-button type="warning" size="mini" icon="el-icon-download" circle plain />
                      </a>
                    </template>
                    <template slot-scope="scope">
                      <el-button v-show="props.row.isEdit" type="text" size="mini" icon="el-icon-remove-outline" :disabled="props.row.details.length <= 1" class="dangerColor" style="font-size:24px;" @click="onDeleteDetailItem(props.$index, scope.$index)" />
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              prop="validTime"
              show-overflow-tooltip
              :label="$t('finance.rateValidateTime')"
            >
              <template slot-scope="props">
                <el-form-item v-if="props.row.isEdit" :prop="'validTimeList.' + props.$index + '.validityStart'" :rules="detailFormRules.validityStart">
                  <el-row>
                    <el-col :xs="10" :sm="6">
                      <el-date-picker
                        v-model="props.row.validityStart"
                        :picker-options="pickerOptions(1, -1, false, props.row.validityEnd)"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        style="width:100%;"
                        placeholder="≥"
                        class="placeholder-center"
                        @change="val => onStartTimeChange(val, props.row.validityEnd, props.$index)"
                      />
                    </el-col>
                    <el-col :span="1" style="text-align:center;">—</el-col>
                    <el-col :xs="10" :sm="6">
                      <el-date-picker
                        v-model="props.row.validityEnd"
                        :picker-options="pickerOptions(2, -1, false, props.row.validityStart)"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="≤"
                        size="mini"
                        style="width:100%;"
                        class="placeholder-center"
                        @change="val => onEndTimeChange(val, props.row.validityStart, props.$index)"
                      />
                    </el-col>
                    <el-col :xs="3" :sm="11" class="textR">
                      <el-button v-show="!isAddRateCard && props.row.isEdit" size="small" @click="onCancelEditRateCardItem(props.$index)">{{ $t('cancel') }}</el-button>
                      <el-button v-show="!isAddRateCard && props.row.isEdit" type="primary" size="small" @click="onSaveRateCardItem(props.$index)">{{ $t('save') }}</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <div v-else>
                  <el-row>
                    <el-col :xs="21" :sm="13" class="text-overflow">
                      <div v-show="props.row.validityStart && props.row.validityEnd">{{ props.row.validityStart + ' — ' + props.row.validityEnd }}</div>
                      <div v-show="props.row.validityStart && !props.row.validityEnd">{{ props.row.validityStart + ' — ' }}</div>
                    </el-col>
                    <el-col :xs="3" :sm="11" class="textR">
                      <el-button v-show="!isAddRateCard && !props.row.isEdit" type="success" size="small" @click="onEditDetail(props.$index)">{{ $t('edit') }}</el-button>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="footer-wrap">
          <el-button v-show="isAddRateCard" type="primary" @click="onSubmitRateCard">{{ $t('submit') }}</el-button>
        </div>
      </div>
    </div>
    <!-- 上传 -->
    <el-dialog v-el-drag-dialog :title="$t('finance.uploadRateCard')" :visible.sync="isShowUploadDialog" :close-on-click-modal="false" width="500px" center>
      <el-form ref="uploadForm" :model="uploadForm" :rules="uploadFormRules" label-width="90px" size="mini">
        <el-form-item :label="$t('download')">
          <a class="link_primary" :href="'./static/template/' + $t('template.rateCardTemp') + '.xls'" download>《{{ $t('template.rateCardTemp') }}》</a>
        </el-form-item>
        <el-form-item :label="$t('finance.validTime')" prop="startDate">
          <el-row>
            <el-col :span="11">
              <el-date-picker
                v-model="uploadForm.startDate"
                :picker-options="pickerOptions(1, -1, false, uploadForm.endDate)"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder=""
                style="width:100%;"
                @change="val => onStartTimeChange(val, uploadForm.endDate)"
              />
            </el-col>
            <el-col :span="2" style="text-align:center;">—</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="uploadForm.endDate"
                :picker-options="pickerOptions(2, -1, false, uploadForm.startDate)"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder=""
                size="mini"
                style="width:100%;"
                @change="val => onEndTimeChange(val, uploadForm.startDate)"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <self-upload
            ref="selfUpload"
            :url="url"
            :accept="'xlxs,xls'"
            :upload-form="uploadForm"
            @on-upload-error="onUploadError"
            @on-upload-success="onUploadSuccess"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onUploadRateCard">{{ $t('upload') }}</el-button>
      </div>
      <div v-show="uploadErrorMsg.length > 0" style="margin-top:10px;color:red;max-height:400px;overflow:auto;">
        <p>{{ $t('message.errorMsg') }} : </p>
        <p v-for="(item, index) in uploadErrorMsg" :key="index">{{ item.message }}</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import selfUpload from '@/components/UploadFile/selfUpload.vue'
import { UNIQUE_ID } from '@/utils/common'
import RETURN_DATA from '@I/utils/data/financeSetting/rateCard'
import { PICKER_OPTIONS, MERGE, DEEP_CLONE } from '@/utils/common'
import { finance } from '@I/api/requestUrl'
import {
  getOneRateCard,
  addRateCard,
  updateRateCardInfo,
  operateCardDetail,
  getChargeZoneOptions,
  deleteRateCardDetails,
  queryRateDetailItems
} from '@I/api/financeSetting/rateCard'

export default {
  name: 'FinaceRateCardInfo',
  components: {
    selfUpload
  },
  data() {
    return {
      isShowDialog: false,
      isShowUploadDialog: false,
      isAddRateCard: true,
      dialogTitle: '',
      title: '',
      currencyOptions: [],
      countryOptions: [],
      chargeZoneOptions: [],
      form: { ...RETURN_DATA().RATE_CARD_FORM },
      formRules: {
        ...RETURN_DATA().RATE_CARD_FORM_RULES,
        ratio: [{ validator: this.validateRatio, trigger: 'blur' }],
        sum: [{ validator: this.validateSum, trigger: 'blur' }]
      },
      queryDetailForm: [],
      detailForm: {
        validTimeList: []
      },
      detailFormRules: {
        validityStart: [{ validator: this.validateTimeStart, trigger: ['change', 'blur'] }],
        weightStart: [{ validator: this.validWeightStart, trigger: ['blur'] }],
        weightEnd: [{ validator: this.validWeightEnd, trigger: ['blur'] }]
      },
      initValidTimeList: [],
      multipleSelection: [],
      expandRowKeys: [],
      url: finance.uploadRateCardDetail,
      uploadForm: { ...RETURN_DATA().UPLOAD_FORM },
      uploadFormRules: { ...RETURN_DATA().UPLOAD_FORM_RULES },
      pickerOptions: PICKER_OPTIONS,
      maintainceKey: '',
      uploadErrorMsg: [],
      deleteDetailItemIds: [],
      downloadHref: process.env.VUE_APP_BASE_API + finance.downloadRateDetailItems
    }
  },
  computed: {
    volumeRatio() {
      const unitWeight = this.form.unitWeight
      const ratio = this.form.ratio
      const sum = this.form.sum
      let str = ''
      if (this.form.condition1) {
        str = '（L * W * H）/' + unitWeight + '>' + ratio
      }
      if (this.form.condition2) {
        str += ' AND （L + W + H）>' + sum
      }
      return str
    }
  },
  async created() {
    const { query } = this.$route
    if (query.uuid) {
      this.title = 'Edit Rate Card'
      this.maintainceKey = query.uuid
      this.getRateCardInfo(query.uuid)
    } else this.title = 'Add Rate Card'
    this.isAddRateCard = !query.uuid
    this.getChargeZoneOptions()
    this.currencyOptions = await this.$getCurrencyData()
    this.countryOptions = await this.$getCountryData()
  },
  methods: {
    // 解析volumeRatio字符串
    splitVolumeRatio() {
      const tempArr = this.form.volumeRatio.split(' AND ')
      this.form.condition1 = true
      this.form.ratio = tempArr[0].split('>')[1]
      this.form.unitWeight = tempArr[0].split('>')[0].split('/')[1]
      if (tempArr.length > 1) {
        this.form.condition2 = true
        this.form.sum = tempArr[1].split('>')[1]
      }
    },
    // 查询价卡信息及详情
    getRateCardInfo(uuid) {
      getOneRateCard({ uuid }).then(res => {
        this.form = MERGE({ ...RETURN_DATA().RATE_CARD_FORM }, res.data, false)
        if (this.form.volumeRatio) this.splitVolumeRatio()
        this.detailForm.validTimeList = res.data.items ? DEEP_CLONE(res.data.items) : []
        this.initValidTimeList = res.data.items ? DEEP_CLONE(res.data.items) : []
        this.detailForm.validTimeList.forEach(item => {
          this.queryDetailForm.push({ itemUUID: item.uuid, country: [], chargeZone: [] })
        })
      })
    },
    // 查询计费区下拉数据
    getChargeZoneOptions() {
      getChargeZoneOptions().then(res => {
        this.chargeZoneOptions = res.data
      })
    },
    // 价卡详情-添加
    onAddDetail() {
      this.isShowDialog = true
      this.dialogTitle = this.$t('add')
      const detailItem = { ...RETURN_DATA().DETAIL_ITEM, ...{ uuid: -UNIQUE_ID() }}
      const uuid = -UNIQUE_ID()
      const detail = { ...RETURN_DATA().DETAIL_FORM_ITEM, ...{ uuid, maintainceKey: this.maintainceKey, details: [detailItem] }}
      this.detailForm.validTimeList.push(detail)
      this.queryDetailForm.push({ itemUUID: uuid, country: [], chargeZone: [] })
      this.$nextTick(() => {
        this.$refs.detailTable.toggleRowExpansion(detail, true)
      })
    },
    // 价卡详情-上传
    onUploadDetail() {
      this.isShowUploadDialog = true
      this.uploadErrorMsg = []
      this.$nextTick(() => {
        this.$refs.selfUpload.clearFiles()
        this.$refs.uploadForm.resetFields()
        this.uploadForm = { ...RETURN_DATA().UPLOAD_FORM }
      })
    },
    // 价卡详情-编辑
    onEditDetail(index) {
      const obj = this.detailForm.validTimeList[index]
      obj.details.forEach(item => { item.isEdit = true })
      obj.isEdit = true
      this.detailForm.validTimeList.splice(index, 1, obj)
      this.$nextTick(() => {
        this.$refs.detailTable.toggleRowExpansion(obj, true)
      })
    },
    // 查询价卡详情的items
    onQueryDetailItems(index, form) {
      queryRateDetailItems(form).then(res => {
        this.detailForm.validTimeList[index].details = DEEP_CLONE(res.data)
        this.initValidTimeList[index].details = DEEP_CLONE(res.data)
      })
    },
    // 添加一条价卡详情
    onAddDetailItem(index) {
      this.detailForm.validTimeList[index].details.push({ ...RETURN_DATA().DETAIL_ITEM, ...{ uuid: -UNIQUE_ID() }})
    },
    // 编辑一条价卡详情
    onEditDetailItem(index) {
      const obj = this.detailForm.validTimeList[index]
      obj.details.forEach((item, i) => {
        if (!item.isEdit) obj.details.splice(i, 1, { ...item, ...{ isEdit: true }})
      })
    },
    // 删除一条价卡详情
    onDeleteDetailItem(index, i) {
      this.$confirm(this.$t('message.deleteTip'), this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const obj = this.detailForm.validTimeList[index]
        const deleteIndex = this.deleteDetailItemIds.findIndex(e => e.detailId === obj.uuid)
        if (deleteIndex >= 0) {
          this.deleteDetailItemIds[deleteIndex].deleteIds.push(obj.details[i].uuid)
        } else {
          this.deleteDetailItemIds.push({ detailId: obj.uuid, deleteIds: [obj.details[i].uuid] })
        }
        obj.details.splice(i, 1)
      }).catch(() => {})
    },
    // 体积比，condition1 复选框change
    onConditionChange1(val) {
      if (!val) {
        this.$refs.form.clearValidate('ratio')
        this.form.unitWeight = 6000
        this.form.ratio = undefined
      }
    },
    // 体积比，condition2 复选框change
    onConditionChange2(val) {
      if (!val) {
        this.$refs.form.clearValidate('sum')
        this.form.sum = undefined
      }
    },
    // 新增-保存价卡
    async onSubmitRateCard() {
      // 展开table的多有的折叠行。若不展开，则表单无法校验被折叠的部分。
      this.expandRowKeys = this.detailForm.validTimeList.map(e => e.uuid)
      this.$nextTick(() => {
        // 校验价卡信息form
        this.$refs.form.validate(valid => {
          if (!valid) return
          // 判断当前有没有添加价卡有效期
          if (this.detailForm.validTimeList.length <= 0) {
            this.$message.error({
              message: this.$t('finance.rateCardDetailsRequired'),
              offset: 100,
              showClose: true
            })
            return
          }
          // 校验价卡详情detailForm
          this.$refs.detailForm.validate(valid => {
            if (!valid) return
            if (!this.validateTime()) {
              this.$message.error({
                message: this.$t('finance.validTimeOverlap'),
                offset: 100,
                showClose: true
              })
              return
            }
            // 校验全部通过
            const form = MERGE({ ...RETURN_DATA().FORM }, this.form, false)
            form.volumeRatio = this.volumeRatio
            form.items = DEEP_CLONE(this.detailForm.validTimeList)
            form.items.forEach(item => {
              delete item.uuid
              delete item.isEdit
              item.details.forEach(el => {
                delete el.uuid
                delete el.isEdit
              })
            })
            addRateCard(form).then(res => {
              this.$router.replace({ path: '/financeSetting/rateCard/index' })
            })
          })
        })
      })
    },
    // -------------------- 校验 -------------------------
    // 校验价卡的有效期范围有无重叠
    validateTime() {
      const noEndTimeList = this.detailForm.validTimeList.filter(e => !e.validityEnd)
      if (noEndTimeList.length >= 2) return false
      return this.detailForm.validTimeList.every((e, i) => {
        return this.isOverlap(e.validityStart, e.validityEnd, i)
      })
    },
    // 校验是否有重叠的时间
    isOverlap(sTime, eTime, index) {
      return this.detailForm.validTimeList.every((item, i) => {
        // 排除与自己的比较
        if (index === i) return true
        // 当eTime存在时，eTime应小于任何一项的sTime，或者sTime小于任何一项的eTime
        // 当eTime不存在时，sTime需小于任何一项的eTime
        return (eTime && (eTime < item.validityStart || sTime > item.validityEnd)) || (!eTime && sTime > item.validityEnd)
      })
    },
    // 校验有效期
    validateTimeStart(rule, value, callback) {
      if (!value) callback(new Error(this.$t('message.pickRequired') + this.$t('finance.validTime')))
      else {
        const index = rule.fullField.split('.')[1]
        if (this.detailForm.validTimeList[index].details.length <= 0) callback(new Error(this.$t('finance.rateCardValidTimeDetails')))
        else callback()
      }
    },
    // 校验weightStart
    validWeightStart(rule, value, callback) {
      if (value === '' || value == null || value === undefined) {
        callback(new Error(this.$t('message.required')))
      } else {
        const index = rule.fullField.split('.')[1]
        const itemIndex = rule.fullField.split('.')[3]
        const weightEnd = this.detailForm.validTimeList[index].details[itemIndex].weightEnd
        if ((weightEnd || weightEnd === 0) && value > weightEnd) {
          callback(new Error(this.$t('finance.NGEnd')))
        } else {
          if (weightEnd || weightEnd === 0) this.$refs.detailForm.clearValidate('validTimeList.' + index + '.details.' + itemIndex + '.weightEnd')
          callback()
        }
      }
    },
    // 校验weightEnd
    validWeightEnd(rule, value, callback) {
      if (value === '' || value == null || value === undefined) {
        callback(new Error(this.$t('message.required')))
      } else {
        const index = rule.fullField.split('.')[1]
        const itemIndex = rule.fullField.split('.')[3]
        const weightStart = this.detailForm.validTimeList[index].details[itemIndex].weightStart
        if ((weightStart || weightStart === 0) && value < weightStart) {
          callback(new Error(this.$t('finance.NLStart')))
        } else {
          if ((weightStart || weightStart === 0)) this.$refs.detailForm.clearValidate('validTimeList.' + index + '.details.' + itemIndex + '.weightStart')
          callback()
        }
      }
    },
    // 校验体积比率
    validateRatio(rule, value, callback) {
      if (this.form.condition1 && !value && value !== 0) {
        callback(new Error(this.$t('message.required')))
      } else callback()
    },
    // 校验长+宽+高的和
    validateSum(rule, value, callback) {
      if (this.form.condition2 && !value && value !== 0) {
        callback(new Error(this.$t('message.required')))
      } else callback()
    },
    // start time change，当开始时间大于结束时间时，取开始时间等于结束时间
    // 由于控件不能控制时分秒范围不可选的问题
    onStartTimeChange(val, endTime, index) {
      if (val && endTime && new Date(val).getTime() > new Date(endTime).getTime()) {
        if (index == null || index === undefined) {
          this.uploadForm.validityStart = endTime
        } else this.detailForm.validTimeList[index].validityStart = endTime
      }
    },
    // 同 start time change，当结束时间小于开始时间时，取结束时间等于开始时间
    onEndTimeChange(val, startTime, index) {
      if (val && startTime && new Date(val).getTime() < new Date(startTime).getTime()) {
        if (index == null || index === undefined) {
          this.uploadForm.validityEnd = startTime
        } else this.detailForm.validTimeList[index].validityEnd = startTime
      }
    },
    // ------------------------ 上传 -------------------------
    // 上传价卡
    onUploadRateCard() {
      this.uploadForm.rateUUID = this.maintainceKey
      this.$refs.uploadForm.validate(valid => {
        if (!valid) return
        if (!this.isOverlap(this.uploadForm.startDate, this.uploadForm.endDate, -1)) {
          this.$message.error({
            message: this.$t('finance.validTimeOverlap'),
            offset: 100,
            showClose: true
          })
          return
        }
        this.$refs.selfUpload.upload()
      })
    },
    // 删除失败-错误提示
    onUploadError(res) {
      this.uploadErrorMsg = [...res.errors]
    },
    // 上传成功
    onUploadSuccess(res) {
      this.isShowUploadDialog = false
      this.detailForm.validTimeList.push(DEEP_CLONE(res.data))
      this.initValidTimeList.push(DEEP_CLONE(res.data))
      this.queryDetailForm.push({ itemUUID: res.data.uuid, country: [], chargeZone: [] })
    },
    // ------------------------ 删除 -------------------------
    // 表格展开行
    onExpandChange(row, expandedRows) {
      this.expandRowKeys = expandedRows.map(e => e.uuid)
    },
    // 表格select change事件
    handleSelectionChange(selection) {
      this.multipleSelection = [...selection]
    },
    // 批量删除
    onDeleteDetails() {
      if (this.multipleSelection.length <= 0) return this.$message.warning(this.$t('message.atLeastOneSelected'))
      const tempArr = this.detailForm.validTimeList.filter(item => !this.multipleSelection.some(e => e.uuid === item.uuid))
      if (this.isAddRateCard) {
        this.detailForm.validTimeList = [...tempArr]
        this.queryDetailForm = this.queryDetailForm.filter(item => !this.multipleSelection.some(e => e.uuid === item.itemUUID))
        this.deleteDetailItemIds = this.deleteDetailItemIds.filter(item => !this.multipleSelection.some(e => e.uuid === item.deleteIds))
        return
      }
      if (tempArr.length <= 0) {
        this.$message.warning(this.$t('finance.rateCardDetailTip'))
        return
      }
      this.$confirm(this.$t('message.deleteTip'), this.$t('common.warning'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const rateItemUUIDs = this.multipleSelection.map(e => e.uuid)
        deleteRateCardDetails({ rateItemUUIDs }).then(res => {
          this.detailForm.validTimeList = [...tempArr]
          this.initValidTimeList = this.initValidTimeList.filter(item => !this.multipleSelection.some(e => e.uuid === item.uuid))
          this.deleteDetailItemIds = this.deleteDetailItemIds.filter(item => !this.multipleSelection.some(e => e.uuid === item.deleteIds))
        })
      }).catch(() => {})
    },
    // -------------------- 编辑状态下-保存 -------------------
    // 保存价卡信息
    onSaveRateCardInfo() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const form = MERGE({ ...RETURN_DATA().FORM }, this.form, false)
        form.volumeRatio = this.volumeRatio
        updateRateCardInfo(form).then(res => {
          this.$message.success(this.$t('message.saveSuccess'))
          this.$store.dispatch('tagsView/delCachedView', { name: 'FinanceRateCard' })
        })
      })
    },
    // 保存价卡详情-item
    onSaveRateCardItem(index) {
      const currentObj = DEEP_CLONE(this.detailForm.validTimeList[index])
      const uuid = currentObj.uuid
      const propTime = 'validTimeList.' + index + '.validityStart'
      // 判断当前行是否展开，否，则展开当前行，以便进行form校验
      if (!this.expandRowKeys.some(e => e === uuid)) this.expandRowKeys.push(uuid)
      this.$nextTick(() => {
        let validNum = 0
        // 需要校验的部分字段集合
        const propsList = [propTime]
        // 循环，拿到当前价卡详情的prop
        currentObj.details.forEach((item, i) => {
          const propS = 'validTimeList.' + index + '.details.' + i + '.weightStart'
          const propE = 'validTimeList.' + index + '.details.' + i + '.weightEnd'
          propsList.push(propS)
          propsList.push(propE)
        })
        this.$refs.detailForm.validateField(propsList, (errorMessage) => {
          if (!errorMessage) validNum++
        })
        // 此时表示，detailForm校验都通过了。（details中的prop会校验两次，目前原因未知。）
        if (validNum === currentObj.details.length * 4 + 1) {
          if (!this.isOverlap(currentObj.validityStart, currentObj.validityEnd, index)) {
            this.$message.error({
              message: this.$t('finance.validTimeOverlap'),
              offset: 100,
              showClose: true
            })
            return
          }
          // 校验通过
          const url = currentObj.uuid < 0 ? finance.addRateCardDetail : finance.updateRateCardDetail
          const method = currentObj.uuid < 0 ? 'post' : 'put'
          delete currentObj.isEdit
          if (currentObj.uuid < 0) delete currentObj.uuid
          currentObj.details.forEach(item => {
            delete item.isEdit
            if (item.uuid < 0) delete item.uuid
          })
          const currentDeleteIds = this.deleteDetailItemIds.filter(item => item.detailId === currentObj.uuid)
          currentObj.deleteDetailUUIDs = currentDeleteIds.length > 0 ? currentDeleteIds[0].deleteIds : []
          operateCardDetail(url, method, currentObj).then(res => {
            this.$message.success(this.$t('message.saveSuccess'))
            this.deleteDetailItemIds = this.deleteDetailItemIds.filter(item => item.detailId !== currentObj.uuid)
            this.detailForm.validTimeList.splice(index, 1, DEEP_CLONE(res.data))
            this.initValidTimeList.splice(index, 1, DEEP_CLONE(res.data))
          })
        }
      })
    },
    // 取消编辑
    onCancelEditRateCardItem(index) {
      const currentObj = this.detailForm.validTimeList[index]
      const initObj = DEEP_CLONE(this.initValidTimeList[index])
      this.deleteDetailItemIds = this.deleteDetailItemIds.filter(item => item.detailId !== initObj.uuid)
      if (currentObj.uuid < 0) this.detailForm.validTimeList.splice(index, 1)
      else this.detailForm.validTimeList.splice(index, 1, initObj)
    }
  }
}
</script>
<style lang='scss' scoped>
#finance-rate-card-info {
  width: 100%;
  height: 100%;
  h3 {
    color: #fff;
    font-size: 16px;
    font-weight: normal;
    margin: 10px -5px 15px;
    padding: 5px 10px;
    background-color: #B3D8FF;
    // background: linear-gradient(120deg, $primaryColor, #B3D8FF);
    border-radius: 3px;
    position: relative;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .container-header {
    padding: 10px;
    /deep/.el-divider--horizontal {
      margin: 0;
      padding: 20px 0;
      background-color: $primaryColor;
      .el-divider__text {
        background-color: transparent;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
  .container-main {
    display: block !important;
    overflow-y: auto;
    /deep/.el-divider--horizontal {
      margin: 10px 0 15px 0;
    }
  }
  /deep/.info-form.el-form {
    .el-form-item {
      margin-bottom: 14px;
    }
  }
  .note-tip {
    margin: 0;
    font-size: 12px;
    color: #777;
  }
  .footer-wrap {
    text-align: center;
    padding: 50px 0 10px;
    .el-button {
      padding: 10px 100px;
    }
  }

  .query-form {
    .el-form-item {
      margin-bottom: 5px;
    }
  }
  .dialog-form {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 12px;
    }
    /deep/.el-table__row .el-input-number {
      width: 100%;
      .el-input__inner {
        text-align: right;
      }
    }
    /deep/.el-input__inner {
      width: 100%;
    }
    .query-form {
      /deep/.el-form-item__label {
        font-size: 12px;
      }
    }
    .detail-table {
      /deep/.el-form-item__error {
        margin-left: -3px;
      }
    }
    .el-button--mini.is-circle {
      padding: 5px;
    }
  }
}
</style>
