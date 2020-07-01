<template>
  <div class="login-container">
    <div class="top-wrap">
      <div class="change-language">
        <span :class="{ active: language === 'zh' }" @click="changeLanguage('zh')">中文</span>
        |
        <span :class="{ active: language === 'en' }" @click="changeLanguage('en')">English</span>
      </div>
      <router-link to="/home"><img src="@/assets/etower.png" alt="" style="height:32px;"></router-link>
    </div>
    <div class="login-main">
      <div v-show="!showRetrievePassword" class="login-wrap">
        <div class="login-title">{{ $t('common.login') }}</div>
        <el-form ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item label="" prop="name">
            <el-input v-model="loginForm.name" type="text" :placeholder="$t('common.userEmail')" autocomplete="off">
              <i slot="prefix"><img src="@/assets/user.png" alt=""></i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="loginForm.password" type="password" :placeholder="$t('common.password')" autocomplete="off" @keyup.native.enter="login()">
              <i slot="prefix"><img src="@/assets/password.png" alt=""></i>
            </el-input>
            <!-- <span class="forget-password" @click="showRetrievePassword=true">{{ $t('common.forgotPassword') }}</span> -->
          </el-form-item>
          <el-form-item style="margin-bottom:10px;">
            <el-button type="default" class="login-btn" @click="login()">{{ $t('common.login') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="showRetrievePassword" class="login-wrap">
        <div class="login-title">{{ $t('common.retrievePassword') }}</div>
        <el-form ref="retrieveForm" :model="retrieveForm" :rules="retrieveFormRules">
          <el-form-item label="" prop="username">
            <el-input v-model="retrieveForm.username" type="text" :placeholder="$t('common.userEmail')" autocomplete="off">
              <i slot="prefix"><img src="@/assets/user.png" alt=""></i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="username">
            <div id="geeTest" style="width: 100%;height:40px;" />
            <span class="back-login" @click="showRetrievePassword=false">{{ $t('common.backToLogin') }}</span>
          </el-form-item>
          <el-form-item style="margin-bottom:10px;">
            <el-button type="default" class="login-btn" :disabled="disabled" @click="sendEmail()">{{ $t('common.sendEmail') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="copyright">
      <span>{{ $t('navbar.copyRightTime') }}</span>
      <span style="margin-left:10px;">{{ $t('navbar.copyRightCompany') }}</span>
      <span style="position:relative;top:-1px;">|</span>
      <span>{{ $t('navbar.copyRightNum') }}</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import { login } from '@/api/common/user'

export default {
  data() {
    return {
      showRetrievePassword: false,
      disabled: true,
      loginForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('message.noEmail'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('message.noPassword'), trigger: 'blur' }]
      },
      retrieveForm: {},
      retrieveFormRules: {
        username: [{ required: true, message: this.$t('message.noEmail'), trigger: 'blur' }]
      },
      geeTestObj: {},
      redirect: {}
    }
  },
  computed: {
    ...mapGetters([
      'language'
    ])
  },
  created() {
    // this.initGeeTest()
    this.redirect = this.$route.params
  },
  methods: {
    // 切换语言
    async changeLanguage(lang) {
      this.$i18n.locale = lang
      await this.$store.dispatch('app/setLanguage', lang)
      this.geeTestObj.destroy()
      this.initGeeTest()
      this.$message({
        message: this.$t('navbar.languageTips'),
        type: 'success'
      })
    },
    // 登录
    login() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        // login(this.loginForm).then(async(res) => {
        //   if (res.code === '0') {
        //     const asyncRoutes = res.data.routes
        //     localStorage.setItem('asyncRoutes', JSON.stringify(asyncRoutes))
        //     if (this.redirect.path && this.redirect.email === this.loginForm.name) {
        //       // session失效时，当前用户重新登录，直接跳转到session失效时所在的页面
        //       this.$router.replace({ path: this.redirect.path, query: this.redirect.query })
        //     } else {
        //       // 清除缓存
        //       localStorage.removeItem('defaultSystem')
        //       this.$store.dispatch('tagsView/delAllViews')
        //       this.$store.dispatch('tagsView/delFixedView')
        //       this.$router.push('/')
        //     }
        //   } else if (res.code === '0001') this.$message.error(this.$t('message.loginError'))
        //   else this.$message.error(res.message)
        // })
      })
    },
    // 发送邮件
    sendEmail() {}
  }
}
</script>
<style lang='scss' scoped>
$purple: #6c5ae2;
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.top-wrap {
  padding: 6px 20px 6px 40px;
}
.change-language {
  line-height: 32px;
  float: right;
  span {
    vertical-align: middle;
    cursor: pointer;
    &.active {
      color: $purple;
    }
  }
}
.login-main {
  flex: 1;
  overflow: hidden;
  width: 100%;
  background-image: url("../../../../assets/login.jpg");
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat no-repeat;
  position: relative;
}
.login-wrap {
  width: 30%;
  min-width: 320px;
  max-width: 400px;
  padding: 40px 30px;
  box-sizing: border-box;
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, .8);
  border-radius: 3px;

  .login-title {
    font-size: 28px;
    margin-bottom: 40px;
  }

  /deep/.el-form-item {
    margin-bottom:  40px;

    .el-input__inner {
      height: 42px;
      line-height: 42px;
    }

    img {
      vertical-align: middle;
      position: relative;
      top: 2px;
      padding-left: 10px;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 40px;
    }
    .el-form-item__error {
      margin-top: 10px;
      color: red;
    }
  }
  .forget-password,
  .back-login {
    margin: 0;
    color: $purple;
    font-size: 12px;
    position: absolute;
    top: 40px;
    right: 0;
    cursor: pointer;
  }
  .forget-password:hover,
  .back-login:hover {
    text-decoration: underline;
  }
  .login-btn {
    width: 100%;
    color: #fff;
    background-color: $purple;
    font-size: 16px;
    border-radius: 10px;
    margin-top: 30px;
  }
  .back-login {
    margin: 0;
    color: $purple;
    font-size: 12px;
    cursor: pointer;
    left: 0;
  }
}
.copyright {
  color: rgba(255, 255, 255, .8);
  text-align: center;
  font-size: 14px;
  background-color: transparent;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
