<template>
  <div>
    <el-upload
      ref="uploadFile"
      class="upload-demo"
      :action="baseUrl + url"
      :limit="limit"
      :auto-upload="false"
      :headers="headers"
      :data="uploadForm"
      :file-list="fileList"
      :before-upload="beforeUploadFile"
      :on-change="onUploadFileChange"
      :on-remove="onFileRemove"
      :http-request="uploadHttpRequest"
    >
      <el-button slot="trigger" type="primary" :disabled="disabled" size="small">{{ $t('selectFile') }}</el-button>
    </el-upload>
  </div>
</template>
<script>
import { uploadFile } from '@/api/common/index'
export default {
  props: {
    url: {
      type: String,
      default: '',
      required: true
    },
    limit: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    accept: { // 文件类型，英文','隔开
      type: String,
      default: ''
    },
    uploadForm: { // 上传文件附带的其他参数
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    },
    isNoFile: { // 是否无文件上传
      type: Boolean,
      default: false
    },
    showErrorMsg: { // 文件上传失败时，是否展示错误提示信息
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      headers: {
        sessionId: this.$store.getters.token,
        language: this.$store.getters.language === 'zh' ? 'zh_CN' : 'en_US',
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  methods: {
    onFileRemove(file) {
      this.$emit('on-remove-file', file)
    },
    // 上传之前，校验文件大小
    beforeUploadFile(response) {
      const { name, size } = response
      if (size > this.size * 1024 * 1024) {
        this.$message.warning(this.$t('message.limit10M'))
        return false
      }
      const fileType = name.slice(name.lastIndexOf('.') + 1)
      const acceptType = this.accept ? this.accept.split(',') : []
      if (acceptType.length > 0 && !acceptType.includes(fileType)) {
        this.$message.warning(this.$t('message.supportType') + acceptType.join('、'))
        return false
      }
    },
    // 上传
    upload() {
      if (this.isNoFile) { // 对于没有文件时，后端又需要用formData的格式传参
        // 根据后台需求数据格式
        const form = new FormData()
        // 添加特定属性
        for (const key in this.uploadForm) {
          form.append(key, this.uploadForm[key])
        }
        uploadFile(this.url, this.headers, form).then(res => {
          if (res.code === '0') {
            this.$emit('on-upload-success', res)
          } else {
            if (this.showErrorMsg) this.$message.error(res.message)
            this.$emit('on-upload-error', res)
          }
        })
      } else this.$refs.uploadFile.submit()
    },
    // 上传文件-change
    onUploadFileChange(data, fileList) {
      const { status } = data
      if (status === 'ready') {
        this.$emit('on-select-file', fileList)
      }
    },
    // 清除上传的文件
    clearFiles() {
      this.$refs.uploadFile.clearFiles()
    },
    // 自定义上传
    uploadHttpRequest(params) {
      const file = params.file
      // 根据后台需求数据格式
      const form = new FormData()
      // 文件对象
      form.append('file', file)
      // 添加特定属性
      for (const key in this.uploadForm) {
        form.append(key, this.uploadForm[key])
      }
      uploadFile(this.url, this.headers, form).then(res => {
        if (res.code === '0') {
          this.$emit('on-upload-success', res)
        } else {
          if (this.showErrorMsg) this.$message.error(res.message)
          this.$emit('on-upload-error', res)
        }
      })
    }
  }
}
</script>
<style lang='scss'>
</style>
