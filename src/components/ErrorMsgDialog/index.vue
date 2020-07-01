<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :title="params.title"
      :visible.sync="isShowDialog"
      width="400px"
    >
      <div style="color:red;max-height:500px;overflow:auto;">
        <p v-for="(item, index) in params.content" :key="index" style="margin: 7px 0;">
          {{ item.message }}
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="isShowDialog=false">{{ params.confirmText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShowDialog: false,
      params: {}
    }
  },
  methods: {
    openDialog(params) {
      this.params = { ...params }
      this.isShowDialog = true
      if (params.time) {
        setTimeout(() => {
          this.isShowDialog = false
        }, params.time)
      }
    }
  }
}
</script>
<style lang='scss'>
</style>
