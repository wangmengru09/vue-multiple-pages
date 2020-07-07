<template>
  <div>
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'FinanceRateCardIndex',
  data() {
    return {
    }
  },
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
<style lang='scss' scoped>
</style>
