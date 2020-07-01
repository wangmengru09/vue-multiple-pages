<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="!collapse" class="sidebar-logo-link">
        <img src="../../../assets/etower.png" class="sidebar-logo" @click="goToEtower">
      </div>
      <div v-else class="sidebar-logo-link">
        <svg-icon icon-class="home" style="font-size: 26px;" @click="goToEtower" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    goTohomepage() {
      const { fullPath } = this.$route
      this.$router.push({ path: '/home', query: { redirect: fullPath }})
    },
    goToEtower() {
      window.open(process.env.VUE_APP_ETOWER_URL + 'aggregator/dashboard')
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  font-size: 28px;
  font-weight: 700 !important;
  text-align: center;
  color: #bfcbd9;
  margin: 10px 0 !important;
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    cursor: pointer;

    & .sidebar-logo {
      width: 50%;
      height: auto !important;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
