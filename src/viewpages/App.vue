<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss" scoped>
// tree-select
/deep/.vue-treeselect__control {
  height: 28px !important;
  border-color: #DCDFE6 !important;
  .vue-treeselect__single-value {
    line-height: 28px !important;
  }
}
</style>
