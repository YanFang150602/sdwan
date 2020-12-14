<template>
  <div class="containters">
    <div class="login-con">
      <div class="login-top">
        <div class="logo"></div>
        <div class="title">CMCC SDWAN</div>
      </div>
      <div class="input-wrap">
        <!-- 登录 -->
        <a-form-model
          v-show="active === '0'"
          ref="loginRef"
          :model="loginData"
          :rules="loginRule"
          hideRequiredMark
          layout="vertical"
        >
          <a-form-model-item prop="userName">
            <a-input v-model="loginData.userName" placeholder="User Name" />
          </a-form-model-item>
          <a-form-model-item prop="evidence">
            <a-input-password
              v-model="loginData.evidence"
              placeholder="Password"
            />
          </a-form-model-item>
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="15">
              <a-form-model-item prop="text">
                <a-input v-model="loginData.text" placeholder="Code" />
              </a-form-model-item>
            </a-col>
            <a-col @click="verif" :span="8">
              <img
                width="100%"
                :src="'data:image/png;base64,' + imgStr"
                alt=""
              />
            </a-col>
          </a-row>
        </a-form-model>
        <!-- 邮箱 -->
        <a-form-model
          v-show="active === '1'"
          ref="sendRef"
          :model="emailData"
          :rules="emailRule"
          hideRequiredMark
          layout="vertical"
        >
          <p class="resetTip">Enter your email address and identifying code.</p>
          <a-form-model-item prop="email">
            <a-input v-model="emailData.email" placeholder="Email Address" />
          </a-form-model-item>
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="15">
              <a-form-model-item prop="text">
                <a-input v-model="emailData.text" placeholder="Code" />
              </a-form-model-item>
            </a-col>
            <a-col @click="verif" :span="8">
              <img
                width="100%"
                :src="'data:image/png;base64,' + imgStr"
                alt=""
              />
            </a-col>
          </a-row>
        </a-form-model>
        <!-- 重置 -->
        <a-form-model
          v-show="active === '2'"
          ref="resetRef"
          :model="resetData"
          :rules="resetRule"
          hideRequiredMark
          layout="vertical"
        >
          <p class="resetTip">Enter your password to reset your account.</p>
          <a-form-model-item prop="evidence">
            <a-input v-model="resetData.evidence" placeholder="Email Code" />
          </a-form-model-item>
          <a-form-model-item prop="newPwd">
            <a-input-password
              v-model="resetData.newPwd"
              placeholder="New Password"
            />
          </a-form-model-item>
          <a-form-model-item prop="confPwd">
            <a-input-password
              v-model="resetData.confPwd"
              placeholder="Confirm Password"
            />
          </a-form-model-item>
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="15">
              <a-form-model-item prop="text" ref="text">
                <a-input v-model="resetData.text" placeholder="Code" />
              </a-form-model-item>
            </a-col>
            <a-col @click="verif" :span="8">
              <img
                width="100%"
                :src="'data:image/png;base64,' + imgStr"
                alt=""
              />
            </a-col>
          </a-row>
        </a-form-model>
        <a-row
          type="flex"
          align="top"
          justify="space-between"
          :style="{ padding: '6px 90px 0 100px' }"
        >
          <a-col>
            <div class="tip-message">{{ tipMessage }}</div>
            <a
              class="backBtn"
              v-show="active == '1'"
              href="javascript:;"
              @click="toLogin"
              >← Back to Login</a
            >
            <a
              class="backBtn"
              v-show="active == '2'"
              href="javascript:;"
              @click="toSend"
              >← Back to Send</a
            >
          </a-col>
          <a-col>
            <a-button
              v-show="active === '0'"
              type="primary"
              :loading="Load"
              @click="userlogin()"
              >Login</a-button
            >
            <a-button
              v-show="active === '1'"
              type="primary"
              :loading="emLoad"
              @click="sending()"
              >Sending</a-button
            >
            <a-button
              v-show="active === '2'"
              type="primary"
              :loading="rsLoad"
              @click="rest()"
              >Reset</a-button
            >
            <div class="controls-link">
              <a
                v-show="active === '0'"
                href="javascript:;"
                @click="active = '1'"
                class="link"
                >Forgot Password</a
              >
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
import {
  login,
  getUserInfo,
  verification,
  emailCode,
  passwordReset
} from 'apis/common';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      active: '0',
      Load: false,
      emLoad: false,
      rsLoad: false,
      // 表单错误信息
      tipMessage: '',
      imgStr: '',
      // 登录
      loginData: {
        loginType: 'ACCOUNT',
        evidenceType: 'PASSWORD',
        userName: 'core',
        evidence: '@e6vC3sj6d3J9@3##',
        key: '',
        text: '',
        systemId: '407616384',
        binded: false
      },
      loginRule: {
        userName: [{ required: true, message: 'Enter Username' }],
        evidence: [{ required: true, message: 'Enter Password' }],
        text: [{ required: true, message: 'Enter Code' }]
      },
      // 邮箱验证
      emailData: {
        email: 'xc-sweet@qq.com',
        key: '',
        text: '',
        operateType: 'LOGIN'
      },
      emailRule: {
        email: [
          { required: true, message: 'Enter Email' },
          {
            type: 'email',
            message: 'Format is incorrect'
          }
        ],
        text: [{ required: true, message: 'Enter Code' }]
      },
      // 重置密码
      resetData: {
        userName: '',
        loginType: 'EMAIL',
        evidence: '',
        newPwd: '',
        confPwd: '',
        encrypted: false,
        key: '',
        text: ''
      },
      resetRule: {
        evidence: [{ required: true, message: 'Enter email code' }],
        newPwd: [{ required: true, message: 'Enter Password' }],
        confPwd: [
          { required: true, message: 'Enter Password again' },
          {
            validator: () => {
              return this.resetData.confPwd === this.resetData.newPwd;
            },
            message: 'Passwords do not match'
          }
        ],
        text: [{ required: true, message: 'Enter Code' }]
      }
    };
  },
  created() {
    this.verif();
  },

  methods: {
    ...mapMutations('common', ['set_token', 'set_user_info']),
    // 验证码
    async verif() {
      const { result } = await verification();
      switch (true) {
        case this.active === '0':
          this.loginData.key = result.key;
          break;
        case this.active === '1':
          this.emailData.key = result.key;
          break;
        case this.active === '2':
          this.resetData.key = result.key;
          break;
        default:
          this.tipMessage = '';
      }
      this.imgStr = result.img;
    },
    // 登录
    userlogin() {
      this.$refs.loginRef.validate(async (valid, messages) => {
        switch (true) {
          case 'userName' in messages:
            this.tipMessage = messages.userName[0].message;
            break;
          case 'evidence' in messages:
            this.tipMessage = messages.evidence[0].message;
            break;
          case 'text' in messages:
            this.tipMessage = messages.text[0].message;
            break;
          default:
            this.tipMessage = '';
        }
        if (valid && !this.Load) {
          this.Load = true;
          const loginRes = await login(this.loginData);
          this.Load = false;
          if (loginRes.status !== '000_0000_0000') {
            this.verif();
            return (this.tipMessage = 'Invalid user name or password or code.');
          }
          const token = loginRes.result.accessToken;
          this.set_token(token);
          const { accountId } = loginRes.result;
          if (accountId) {
            const userInfoRes = await getUserInfo(accountId);
            if (userInfoRes.status !== '0000')
              return this.$message.error(userInfoRes.message);
            this.set_user_info({ userInfoRes, accountId });
            this.$router.replace('/');
          }
        }
      });
    },
    // 邮件验证码
    sending() {
      this.$refs.sendRef.validate(async (valid, messages) => {
        switch (true) {
          case 'email' in messages:
            this.tipMessage = messages.email[0].message;
            break;
          case 'text' in messages:
            this.tipMessage = messages.text[0].message;
            break;
          default:
            this.tipMessage = '';
        }
        if (valid && !this.emLoad) {
          this.emLoad = true;
          const emailRes = await emailCode(this.emailData);
          this.emLoad = false;
          if (emailRes.status !== '000_0000_0000') {
            this.verif();
            return (this.tipMessage = 'Invalid email or code.');
          }
          this.$message.success('验证码发送成功！');
          this.active = '2';
          this.verif();
        }
      });
    },
    // 密码重置
    rest() {
      this.$refs.resetRef.validate(async (valid, messages) => {
        console.log('messages', messages);
        switch (true) {
          case 'evidence' in messages:
            this.tipMessage = messages.evidence[0].message;
            break;
          case 'newPwd' in messages:
            this.tipMessage = messages.newPwd[0].message;
            break;
          case 'confPwd' in messages:
            this.tipMessage = messages.confPwd[0].message;
            break;
          case 'text' in messages:
            this.tipMessage = messages.text[0].message;
            break;
          default:
            this.tipMessage = '';
        }
        if (valid && !this.rsLoad) {
          this.rsLoad = true;
          const resetRes = await passwordReset(this.resetData);
          this.rsLoad = false;
          if (resetRes.status !== '000_0000_0000') {
            this.verif();
            return (this.tipMessage = 'Invalid email or code.');
          }
          this.$message.success('密码修改成功，请重新登录！');
          this.active = '0';
          this.verif();
        }
      });
    },
    toLogin() {
      this.active = '0';
      this.emailData = {
        email: '',
        key: '',
        text: '',
        operateType: 'LOGIN'
      };
      this.verif();
    },
    toSend() {
      this.active = '1';
      this.resetData = {
        userName: '',
        loginType: '',
        evidence: '',
        newPwd: '',
        confPwd: '',
        encrypted: false,
        key: '',
        text: ''
      };
      this.verif();
    }
  },
  watch: {
    'emailData.email': {
      handler: function(val) {
        this.resetData.userName = val;
        console.log('this.resetData.userName', this.resetData.userName);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.containters {
  /deep/.ant-form-explain {
    display: none !important;
  }
  background: #0d496a url('~@/assets/images/login/waves.png') no-repeat center
    bottom;
  background-attachment: fixed;
  background-size: 100% auto;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .login-con {
    width: 450px;
    padding-bottom: 35px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 111;
    background: #0b3d59;
    border-radius: 25px;
    overflow: hidden;
    .login-top {
      height: 75px;
      font-size: 18px;
      border-radius: 25px 25px 0 0;
      background: #fff;
      border: 1px solid;
      position: relative;
      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 60px;
        background-color: #ccc;
        left: 200px;
        top: 8px;
      }
      .logo {
        width: 200px;
        height: 75px;
        background: url(~@/assets/images/login/versa-logo.png) no-repeat 30px
          20px;
        float: left;
      }
      .title {
        font-size: 18px;
        color: #0090bc;
        line-height: 75px;
        width: 240px;
        float: right;
        text-align: center;
      }
    }
    .input-wrap {
      .resetTip {
        margin-bottom: 0;
        color: #fff;
        font-size: 12px;
      }

      /deep/.ant-form {
        margin: 20px 0 0 100px;
        width: 260px;
        .ant-form-item {
          margin: 0;
          height: 46px;
          padding: 10px 0;
          .ant-form-item-control-wrapper {
            margin: 0;
            height: 26px;
            line-height: 26px;
            .ant-form-item-control {
              height: 26px;
              line-height: 26px;
              .ant-input {
                background-color: #0b3d59;
                border: 2px solid #4b768e;
                box-shadow: none;
                color: #a5b0b8;
                font-size: 12px;
                line-height: 26px;
                height: 26px;
              }
            }
          }
        }
      }
      .tip-message {
        font-size: 11px;
        color: #ee6978;
      }
      .backBtn {
        color: #7bb7d4;
        font-size: 12px;
      }
      button {
        float: right;
        font-weight: 500;
        min-width: 70px;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        vertical-align: middle;
        border-color: #5aa2d0;
        background-color: #0090bc;
        background-image: none;
        text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
        &:hover {
          background-color: #0072bc;
          background-image: none;
        }
      }
      .controls-link {
        text-align: right;
      }
      .controls-link .link {
        color: #7bb7d4;
        font-size: 12px;
      }
    }
  }
}
</style>
