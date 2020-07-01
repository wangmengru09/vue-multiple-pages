<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <el-container style="position:relative;height:100%;">
        <el-header class="main-container-header">
          <div :class="{'fixed-header':fixedHeader}">
            <navbar />
            <tags-view v-if="needTagsView" />
          </div>
        </el-header>
        <el-main class="main-container-main">
          <app-main />
        </el-main>
        <el-footer class="main-container-footer">
          <span>{{ $t('navbar.copyRightTime') }}</span>
          <span style="margin-left:10px;">{{ $t('navbar.copyRightCompany') }}</span>
          <span style="position:relative;top:-1px;">|</span>
          <span>{{ $t('navbar.copyRightNum') }}</span>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      fixedHeader: state => state.settings.fixedHeader,
      needTagsView: state => state.settings.tagsView
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    font-size: 16px;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .main-container-header,
  .main-container-footer {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .main-container-footer {
    top: auto;
    bottom: 0;
    height: 45px !important;
    line-height: 45px;
    text-align: center;
    font-size: 15px;
    color: #97a8be;
    background-color: #fff;
  }
  .main-container-main {
    height: 100%;
    padding-top: 85px;
    padding-bottom: 45px;
    box-sizing: border-box;
  }
</style>
