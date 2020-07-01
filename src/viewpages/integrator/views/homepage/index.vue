<template>
  <div class="login-container">
    <div class="bg-wrap">
      <h2 class="etower-one">eTower</h2>
      <div class="copyright">
        <span>{{ $t('navbar.copyRightTime') }}</span>
        <span style="margin-left:10px;">{{ $t('navbar.copyRightCompany') }}</span>
        <span style="position:relative;top:-1px;">|</span>
        <span>{{ $t('navbar.copyRightNum') }}</span>
      </div>
      <transition name="slide-fade">
        <div v-show="!isHiddenEvent" class="tracking-event-wrap">
          <div class="tracking-event">
            <div class="triangles" @click="isHiddenEvent=true" />
            <div class="event-wrap">
              <div v-for="(eventItem, eventIndex) in allEventList" :key="eventIndex" class="event-item">
                <div v-show="!eventItem.mainNodeList">
                  <div style="padding: 10px;color:red;">{{ eventItem.referenceNo }} {{ $t('common.noOrder') }}</div>
                </div>
                <div v-show="eventItem.mainNodeList">
                  <h3>{{ eventItem.referenceNo }}</h3>
                  <el-steps :active="eventItem.avtiveNum" process-status="wait" align-center>
                    <el-step
                      v-for="eventStep in eventItem.mainNodeList"
                      :key="eventStep.index"
                      :title="eventStep.eventLocalText"
                      :description="eventStep.eventTime"
                    >
                      <div slot="icon" style="position:relative;">
                        <div v-show="eventStep.index !== 0" :class="[eventStep.index <= eventItem.avtiveNum ? 'right-arrow is-finish' : 'right-arrow']" />
                        <svg-icon v-if="eventStep.code === '1020'" icon-class="closedShipment" />
                        <svg-icon v-else-if="eventStep.code === '2030'" icon-class="A-Scan" />
                        <svg-icon v-else-if="eventStep.code === '2060'" icon-class="despatched" />
                        <svg-icon v-else-if="eventStep.code === '2070'" icon-class="planDepartAirport" />
                        <svg-icon v-else-if="eventStep.code === '2080'" icon-class="destinationScan" />
                        <svg-icon v-else-if="eventStep.code === '2120'" icon-class="delivered" />
                        <svg-icon v-else icon-class="home2" />
                      </div>
                    </el-step>
                  </el-steps>
                  <div class="timeLine-wrap">
                    <el-timeline>
                      <el-timeline-item
                        v-for="activity in eventItem.allNodeDetailList"
                        :key="activity.index"
                        :type="activity.index===0 ? 'primary' : ''"
                      >
                        {{ activity.eventTime }} {{ activity.eventLocalText }}
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="login-wrap">
      <img src="@/assets/walltech.png" alt="">
      <div class="login-btn-wrap">
        <language-select @change="handleLanguageChange" />
        <el-button v-show="!$store.getters.token" type="default" size="small" style="margin: 0 10px 0 20px;" @click="login">{{ $t('navbar.loginIn') }}</el-button>
        <el-dropdown v-show="$store.getters.token" class="avatar-container" trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            {{ $store.getters.name }}
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item command="1">
              {{ $t('navbar.back') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="2">
              {{ $t('navbar.logOut') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="main-wrap">
        <h2>{{ $t('login.trackShipment') }}</h2>
        <div>{{ $t('login.tip1') }}</div>
        <div>{{ $t('login.tip2') }}</div>
        <el-input
          v-model="referenceNos"
          :rows="4"
          type="textarea"
          resize="none"
          placeholder=""
          style="margin-top:20px;"
        />
        <!-- <el-button type="default" size="small" style="margin-top: 20px;" @click="searchEvent">{{ $t('common.search') }}</el-button> -->
        <h2 style="margin-bottom:10px;">{{ $t('login.recentSearches') }}</h2>
        <div class="recent-searches-wrap">
          <div v-for="(item,index) in recentSearches" :key="index" class="recent-searches">{{ item.refNo }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import LanguageSelect from '@/components/LangSelect'
// import { getEventNodes } from '@/api/common.js'

export default {
  components: {
    LanguageSelect
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      referenceNos: '',
      isHiddenEvent: true,
      allEventList: [],
      recentSearches: [],
      seachList: [],
      redirect: ''
    }
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     this.redirect = route.query && route.query.redirect
    //   },
    //   immediate: true
    // }
  },
  created() {
    this.referenceNos = this.$route.query.referenceNos
    this.getSearchHistory()
    if (this.referenceNos) {
      // this.searchEvent()
    }
    this.redirect = this.$route.query.redirect
  },
  methods: {
    login() {
      this.$router.push('/login')
    },
    handleCommand(command) {
      if (command === '1') this.toBack()
      else if (command === '2') this.logout()
    },
    toBack() {
      if (this.redirect) {
        this.$router.replace(this.redirect)
      } else this.$router.push('/')
    },
    async logout() {
      this.$store.dispatch('user/logout').then(() => {
        localStorage.removeItem('defaultSystem')
        this.$store.dispatch('tagsView/delAllViews')
        this.$store.dispatch('tagsView/delFixedView')
        this.$router.push('/home')
        window.location.reload()
      })
    },
    // 从缓存中取出当前用户的查询记录
    getSearchHistory() {
      this.seachList = JSON.parse(localStorage.getItem('recentSeatches')) ? JSON.parse(localStorage.getItem('recentSeatches')) : []
      const tenantId = this.$store.getters.userInfo.tenantId
      const index = this.seachList.findIndex(e => e.tenantId === tenantId)
      this.recentSearches = index >= 0 ? this.seachList.splice(index, 1)[0].refNoList : []
      const currentDate = new Date()
      // 一周内的
      if (this.recentSearches.length > 0) this.recentSearches = this.recentSearches.filter(e => moment(currentDate).diff(moment(e.time), 'days') <= 7)
    },
    // 查询
    // searchEvent() {
    //   this.referenceNos = this.referenceNos.trim()
    //   const referenceNoList = this.referenceNos.replace(/\n/g, ',')
    //   if (!referenceNoList) {
    //     this.$message.warning(this.$t('message.noReferenceNo'))
    //     return
    //   }
    //   getEventNodes({ referenceNoList }).then(async(res) => {
    //     if (res.code === '0') {
    //       this.isHiddenEvent = false
    //       this.allEventList = res.data
    //       this.allEventList.forEach(item => {
    //         const tempArr = item.mainNodeList ? item.mainNodeList.filter(e => e.hasCurrentEventNode) : []
    //         item.avtiveNum = tempArr.length
    //       })
    //       await this.getSearchHistory()
    //       const refNoArr = referenceNoList.split(',').reverse()
    //       refNoArr.forEach(item => {
    //         this.recentSearches = this.recentSearches.filter(e => e.refNo !== item)
    //         this.recentSearches.unshift({ time: new Date(), refNo: item })
    //         if (this.recentSearches.length > 20) this.recentSearches.splice(20, this.recentSearches.length - 20)
    //       })
    //       this.seachList.push({ tenantId: this.$store.getters.userInfo.tenantId, refNoList: this.recentSearches })
    //       localStorage.setItem('recentSeatches', JSON.stringify(this.seachList))
    //     }
    //   })
    // },
    handleLanguageChange() {
      // if (this.referenceNos) this.searchEvent()
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$purple: #6c5ae2;

.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
}
.etower-one {
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 35px;
  margin: 0;
}
.bg-wrap {
  flex: 1;
  overflow: hidden;
  height: 100%;
  background: url("../../../../assets/home_left.png") no-repeat;
  background-size: cover;
  background-position: 80% 35%;
  position: relative;
  .copyright {
    color: #fff;
    font-size: 14px;
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.tracking-event-wrap {
  width: 80%;
  height: 100%;
  position: absolute;
  right: 0;
  padding: 38px 0;
  box-sizing: border-box;

  &.hiddenEvent {
    transform: translateX()
  }
}
.tracking-event {
  width: 100%;
  overflow: hidden;
  height: 100%;
  padding: 30px 0 30px 50px;
  background-color: #fff;
  position: relative;

  .triangles {
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 15px solid transparent;
    border-left: 15px solid rgba(108, 90, 226, .8);
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .event-wrap {
    height: 100%;
    width: 100%;
    padding: 0 20px 20px;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    .event-item {
      background-color: #f5f8ff;
      margin-bottom: 5px;
    }

    h3 {
      color: $purple;
      margin: 20px 0;
    }
    .right-arrow {
      width: 8px;
      height: 8px;
      position: absolute;
      top: 50%;
      left: 0;
      border-top: 2px solid #272c3a;
      border-right: 2px solid #272c3a;
      transform: translate(-12px, -3px) rotate(45deg);
    }
    /deep/.el-step {
      .is-finish {
        color: $purple;
        border-color: $purple;

        &.right-arrow {
          border-color: $purple !important;
        }
        .el-step__line {
          border-color: $purple;
        }
      }
      .is-wait {
        color: #272c3a;
        border-color: #272c3a;

        .right-arrow {
          border-color: #272c3a;
        }
      }
      .el-step__icon {
        height: 60px;
        width: 60px;
        background-color: #f5f8ff;
        &.is-text {
          border: 0;
        }

        .svg-icon {
          font-size: 40px;
        }
      }
      .el-step__line {
        top: 30px;
        border: 1px dashed #272c3a;
        background-color: #f5f8ff;

        .el-step__line-inner {
          border: 0;
        }
      }
      .el-step__title {
        line-height: 1;
        margin-bottom: 15px;
      }
    }
    .timeLine-wrap {
      max-height: 250px;
      margin-top: 40px;
      flex: 1;
      overflow: auto;
    }
    /deep/.el-timeline {
      .el-timeline-item__node--primary {
        background-color: $purple;

        & + .el-timeline-item__wrapper {
          .el-timeline-item__content {
            color: $purple;
          }
        }
      }
      .el-timeline-item__tail {
        border-left: 2px dashed #E4E7ED;
      }
    }
  }
}
.login-wrap {
  width: 40%;
  max-width: 600px;
  padding-bottom: 60px;
  background: url("../../../../assets/home_right.png") no-repeat;
  background-size: contain;
  background-position: bottom;

  .login-btn-wrap {
    text-align: right;
    padding: 8px 20px;
    border-bottom: 1px solid #eee;
  }

  .main-wrap {
    padding: 30px;
    position: relative;
  }

  h2 {
    font-size: 32px;
  }
  .recent-searches-wrap {
    max-height: 300px;
    overflow-y: auto;
    .recent-searches {
      padding: 3px 0;
    }
  }

  img {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
/deep/.el-button {
  color: #fff;
  font-size: 15px;
  position: relative;
  top: -2px;
  background-color: $purple;
}
.avatar-container {
  margin: 0 20px;
  overflow: hidden;

  .avatar-wrapper {
    position: relative;
    cursor: pointer;

    .el-icon-caret-bottom {
      cursor: pointer;
      font-size: 12px;
    }
  }
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(1000px);
}
</style>
