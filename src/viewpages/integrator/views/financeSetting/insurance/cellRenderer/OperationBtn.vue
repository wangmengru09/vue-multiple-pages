<template>
  <div>
    <el-button v-show="params.data.status" type="success" size="mini" plain @click="onEdit">{{ $t('edit') }}</el-button>
    <el-button v-show="!params.data.status" :disabled="true" type="info" size="mini" plain>{{ $t('edit') }}</el-button>
    <el-button type="danger" size="mini" plain @click="onDelete">{{ $t('delete') }}</el-button>
  </div>
</template>
<script>
export default {
  name: 'OperationBtn',
  data() {
    return {}
  },
  methods: {
    onEdit() {
      const { data } = this.params
      this.params.context.componentParent.onEditRate(data)
    },
    onDelete() {
      const { data } = this.params
      this.params.context.componentParent.onDeleteRate(data)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
