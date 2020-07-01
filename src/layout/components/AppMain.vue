<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  height: 100%;
  width: 100%;
  padding: 13px;
  box-sizing: border-box;
  position: relative;
  background-color: #f0f2f5;
  overflow: hidden;

  /deep/ .el-header,
  /deep/ .el-main,
  /deep/ .el-footer {
    background-color: #fff;
    padding: 15px 20px;
  }
  /deep/ .el-header {
    height: auto !important;
    margin-bottom: 13px;
  }
  &>div {
    width: 100%;
    height: 100%;
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {

  .fixed-header+.app-main {
    padding-top: 120px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
