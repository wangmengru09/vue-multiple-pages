<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      // ag-grid不刷新不会自动切换语言，借用刷新当前tag的方法实现刷新
      const route = this.$store.getters.visitedViews.filter(route => route.name === this.$route.name)
      if (route && route.length > 0) {
        this.$store.dispatch('tagsView/delCachedView', route[0]).then(() => {
          const { fullPath } = route[0]
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      }
      this.$emit('change', lang)
      this.$message({
        message: this.$t('navbar.languageTips'),
        type: 'success'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.svg-icon {
  font-size: 22px;
}
</style>
