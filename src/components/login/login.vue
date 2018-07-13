<template>
  <div>
    <header class="header xxl-font">
      登录
    </header>
    <form class="login" id="form">
      <h2>welcome</h2>
      <div class="login-item">
        <input type="text" placeholder="手机号" class="phone-num" v-model="mobile" />
        <button type="button" class="botton-code" v-bind:disabled="isSend" @click='sendSms'>{{codeMsg}}</button>
      </div>
      <div class="login-item">
        <input type="text" placeholder="验证码" v-model="code"/>
      </div>
      <button type="button" class="submit-btn" id="submit-btn" @click="submit">进入平台</button>
    </form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      mobile: '',
      code: '',
      isSend: false,
      count: 0,
      timer: null
    }
  },
  computed: {
    codeMsg () {
      const codeMsg = this.count === 0 ? '验证码' : this.count
      return codeMsg
    },
    ...mapState(['islogin', 'messageList'])
  },
  methods: {
    sendSms () {
      const mobile = this.mobile
      if (mobile.length !== 11 || !this.isPoneAvailable(mobile)) {
        alert('请输入正确的手机号码')
        return
      }
      this.isSend = true

      this.$http.get('/api/?s=index/Login/sendMsm', {
        params: {
          phone_num: mobile
        }
      })
      .then(res => {
        // 将获取到的数据赋值给先前设置的变量
        console.log(res)
        const data = res.data
        if (data.status !== 200) {
          alert(data.msg)
        }
        if (data.status === 200) {
          alert(data.data.code)
        }
      })
      const TIME_COUNT = 120
      if (!this.timer) {
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.isSend = false
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    submit () {
      const mobile = this.mobile
      const code = this.code
      if (!this.isSend) {
        alert('请先获取验证码')
        return
      }
      if (mobile.length !== 11 || code.length !== 4) {
        alert('请输入手机号码或者验证码')
        return
      }
      this.$http.get('/api/?s=index/Login/dologin', {
        params: {
          phone_num: mobile,
          code: code
        }
      })
      .then(res => {
        // 将获取到的数据赋值给先前设置的变量
        console.log(res)
        const data = res.data
        if (data.status !== 200) {
          alert(data.msg)
        }
        if (data.status === 200) {
          alert('login success')
          console.log(data)
          this.$store.state.islogin = true
          localStorage.islogin = true
          this.$store.state.messageList = data.data.chat_list
          localStorage.messageList = JSON.stringify(data.data.chat_list)
          this.$store.commit('getData', {
            self: data.data, friends: data.data.friend
          })
          localStorage.self = JSON.stringify(data.data)
          localStorage.friends = JSON.stringify(data.data.friend)
          this.$router.push('/message')
          // 好友
        }
      })
    },
    isPoneAvailable ($mobile) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test($mobile)) {
        return false
      } else {
        return true
      }
    }
  },
  mounted: function () {
    if (this.islogin) {
      this.$router.push('/message')
    }
  }
}
</script>
<style scoped>
.header {
    font-size: 1.2rem;
    color: #292929;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #ddd;
}
.login {
			text-align: center;
			margin-top: 8vh;
			padding: 20px;
		}
.login h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.login-item {
  font-size: 0;
  background: #fff;
  padding-left: 1rem;
  border: 1px solid #eee;
}
/*避免两个输入框间的border重叠*/
.login-item:last-child {
  border-top: 0;
}
input, button {
  width: 100%;
  border: none;
  outline: none;
  height: 50px;
  line-height: 50px;
  font-size: 1.2rem;
  color: #333;
  background: transparent;
}
.phone-num {
  width: 70%;
}
/*获取验证码的button*/
.login-item button {
  width: 30%;
  padding: 0 .2rem;
  background: none;
  color: inherit;
  display: inline-block;
  background: ghostwhite;
  border-left: 1px solid #eee;
}
.submit-btn {
  background: #00a1d6;
  width: 100%;
  color: #fff;
  margin-top: 30px;
}
.botton-code {
  font-size:1.5rem
}
</style>
