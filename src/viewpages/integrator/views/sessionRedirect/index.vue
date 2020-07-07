<template>
  <div />
</template>
<script>
import { getUserInfo } from '@/api/user'
export default {
  name: 'SessionRedirect',
  data() {
    return {
      asyncRoutes: [
        {
          name: 'IntegratorDashboardParent',
          path: '/integrator',
          redirect: '/integrator/dashboard',
          meta: {
            breadCrumb: false,
            icon: 'dashboard',
            systemLevel: 3,
            titleCn: '首页',
            titleEn: 'Dashboard',
            id: '011'
          },
          component: 'Layout',
          children: [
            {
              name: 'IntegratorDashboard',
              path: 'dashboard',
              component: 'dashboard/integrator',
              meta: {
                affix: true,
                icon: 'dashboard',
                systemLevel: 3,
                titleCn: '首页',
                titleEn: 'Dashboard',
                id: '012'
              }
            }
          ]
        },
        {
          path: '/financeSetting',
          name: 'FinanceSetting',
          meta: {
            icon: 'financeSetting',
            systemLevel: 3,
            titleCn: '财务设置',
            titleEn: 'Finance Setting',
            id: '006'
          },
          redirect: '/financeSetting/rateCard/index',
          component: 'Layout',
          children: [
            {
              path: 'exchangeRate',
              name: 'FinanceSettingExchangeRate',
              meta: {
                icon: 'exchangeRate',
                systemLevel: 3,
                titleCn: '汇率',
                titleEn: 'Exchange Rate',
                id: '005'
              },
              component: 'financeSetting/exchangeRate/index'
            }
          ]
        }
      ]
    }
  },
  created() {
    const { query } = this.$route
    if (!query.sessionId) {
      this.$router.push('/404')
      return
    }
    const lang = query.lang ? query.lang : 'zh'
    this.setLanguage(lang)
    this.getUserInfo(query.sessionId)
  },
  methods: {
    // 获取用户信息
    getUserInfo(sessionId) {
      getUserInfo({ sessionId }).then(res => {
        const data = {
          authUserVO: { ...res.data },
          partyVo: { aggregatorLevel: true, shipperLevel: false, carrierLevel: false },
          permissionSignMap: []
        }
        localStorage.setItem('asyncRoutes', JSON.stringify([]))
        this.$store.dispatch('user/set_userInfo', data).then((userInfo) => {
          this.$store.dispatch('permission/set_defaultSystem', 3)
          this.$router.push('/')
        })
      })
    },
    // 设置系统语言
    setLanguage(lang) {
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
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
