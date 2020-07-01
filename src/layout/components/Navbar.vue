<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- 导航菜单 -->
    <div class="navigation-menu">
      <breadcrumb />
    </div>

    <div class="right-menu">
      <!-- <div class="icon-change-system">
        <svg-icon v-show="Number($store.state.permission.defaultSystem)===0" icon-class="back" @click="handleMenuSelect(3)" />
        <svg-icon v-show="Number($store.state.permission.defaultSystem)===3" icon-class="setting" @click="handleMenuSelect(0)" />
      </div> -->
      <!-- 语言切换 -->
      <lang-select class="right-menu-item hover-effect" />
      <!-- 个人信息 -->
      <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          {{ name }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="1">
            {{ $t('navbar.changePassword') }}
          </el-dropdown-item>
          <el-dropdown-item divided command="2" style="text-align:center;">
            {{ $t('navbar.logOut') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 修改密码 -->
    <el-dialog v-el-drag-dialog :title="$t('navbar.changePassword')" :visible.sync="isShowPasswordDialog" width="450px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordFormRules" :label-width="$t('navbar.passwordLabelWidth')" class="update-form">
        <el-form-item :label="$t('common.userEmail')">admin@amin.com</el-form-item>
        <el-form-item :label="$t('navbar.newPassword')" prop="password">
          <el-input
            v-model="passwordForm.password"
            size="mini"
            placeholder=""
            style="width:95%"
            type="password"
            @input="passwordForm.password = passwordForm.password.trim()"
          />
        </el-form-item>
        <el-form-item :label="$t('navbar.confirmpassword')" prop="password2">
          <el-input
            v-model="passwordForm.password2"
            size="mini"
            placeholder=""
            style="width:95%"
            type="password"
            @input="passwordForm.password = passwordForm.password.trim()"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="default" size="small" @click="isShowPasswordDialog=false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" size="small" @click="savePassword">{{ $t('save') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import LangSelect from '@/components/LangSelect'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect
  },
  data() {
    return {
      isShowPasswordDialog: false,
      passwordForm: {
        password: '',
        password2: ''
      },
      passwordFormRules: {
        password: [{ required: true, validator: this.validatePassword, trigger: 'blur' }],
        password2: [{ required: true, validator: this.validatePassword2, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'userInfo'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleCommand(command) {
      if (command === '2') this.logout()
      else if (command === '1') {
        this.isShowPasswordDialog = true
        this.$nextTick(() => {
          this.$refs.passwordForm.resetFields()
        })
      }
    },
    async logout() {
      this.$store.dispatch('user/logout').then(() => {
        localStorage.removeItem('defaultSystem')
        this.$store.dispatch('tagsView/delAllViews')
        this.$store.dispatch('tagsView/delFixedView')
        // this.$router.replace('/home')
        window.location.reload()
        window.location.href = process.env.VUE_APP_ETOWER_URL
      })
    },
    handleMenuSelect(index) {
      if (Number(this.$store.state.permission.defaultSystem) !== Number(index)) {
        this.$store.dispatch('permission/set_defaultSystem', index)
        this.$store.dispatch('tagsView/delAllViews')
        this.$store.dispatch('tagsView/delFixedView')
        this.$router.push(this.$store.state.tagsView.allFixedTagViews[index - 0].path)
      }
    },
    validatePassword(rule, value, callback) {
      if (!value || value.length < 6 || value.length > 30 || !/^[0-9A-Za-z]+$/.test(value)) {
        callback(new Error(this.$t('message.changePasswordTip1')))
      } else {
        if (this.passwordForm.password2 !== '') {
          this.$refs.passwordForm.validateField('password2')
        }
        callback()
      }
    },
    validatePassword2(rule, value, callback) {
      if (value === '') {
        callback(this.$t('message.changePasswordTip2'))
      } else if (value !== this.passwordForm.password) {
        callback(new Error(this.$t('message.twoPasswordTip')))
      } else {
        callback()
      }
    },
    // 保存密码
    savePassword() {
      this.$refs.passwordForm.validate(valid => {
        if (!valid) return
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .navigation-menu {
    height: 50px;
    float: left;
    .el-menu--horizontal>.el-menu-item {
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      margin-left: 10px;
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
    .user-dropdown {
      /deep/.el-dropdown-menu__item {
        text-align: center !important;
      }
    }
  }
  .icon-change-system {
    height: 100%;
    display: inline-block;
    vertical-align: text-bottom;

    .svg-icon {
      margin: 0 10px;
      cursor: pointer;
      font-size: 22px;
    }
  }
}
</style>
