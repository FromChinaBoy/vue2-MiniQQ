<template>
    <div>
      <!--头部导航-->
      <div class="container-top">
        <!--弹出层控制按钮-左边框弹出-->
        <div class="drawer"
            @click="showSidebar(true)"></div>
        <top-nav></top-nav>
      </div>
      <!--内容-->
      <div class="container-content">
        <div class="patch"></div>
        <router-view></router-view>
        <div class="patch"></div>
      </div>
      <!--尾部tab-->
      <div class="container-bottom">
        <bottom-tab class="tab"></bottom-tab>
      </div>
    
      <!--主页左侧弹出层-->
      <!--此处加z-index，防止弹出时被遮罩层遮挡-->
      <my-sidebar style="z-index: 20141224;"></my-sidebar>
      <!--对话界面-->
      <my-dialog class="my-dialog"
                v-if="dialog"></my-dialog>
      <!--个人主页-->
      <my-personindex class="my-personindex"
                      v-if="personindex"></my-personindex>
      <!--搜索-->
      <my-search v-if="search"></my-search>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// 加载需要用到的组件
import bottomTab from './bottomtab/bottom-tab'
import topNav from './topnav/top-nav'
import myDialog from './dialog/dialog'
import mySidebar from './sidebar/sidebar'
import myPersonindex from './personindex/personindex'
import mySearch from './search/search'

export default {
  name: 'index',
  components: {
    bottomTab,
    topNav,
    myDialog,
    mySidebar,
    myPersonindex,
    mySearch
  },
  data() {
    return {
      websock: ''
    }
  },
  created() {
     // 页面刚进入时开启长连接
    this.websochetInit()
  },
  // mapState是vuex的方法之一
  computed: mapState(['dialog', 'personindex', 'search', 'activeId']),
  methods: {
    // 点击左侧打开侧边栏
    showSidebar(flag) {
      this.$store.commit('showSidebar', { flag })
    },
    /* webSocket会话 */
    /* 会话过程中实际调用的函数 */
    readyChat (data) {
      console.log(data)
      let This = this
      if (this.websock.readyState === 1) {
        this.websocketSend(data)
      } else if (this.websock.readyState === 0) {
        setTimeout(function () {
          This.websocketSend(data)
        }, 300)
      } else { // 连接未创建或者创建失败，则重新创建连接，并设置500ms后发送信息
        this.websochetInit()
        setTimeout(function () {
          This.websocketSend(data)
        }, 500)
      }
    },
    /* 初始化websochet */
    websochetInit () {
      this.websock = new WebSocket('ws://111.230.205.134:9503?user_key=' + this.$store.state.data.self.user_key)
      this.websock.onmessage = this.websocketMessage
    },
    /* websochet发送信息 */
    websocketSend (data) {
      this.websock.send(JSON.stringify(data))
    },
    /* websochet接收服务器返回的信息 */
    websocketMessage (e) {
      console.log(e)
      const data = JSON.parse(e.data)
      if (data.code === 40000) {
        console.error(data.msg)
      }
      if (data.code === 0) {
        this.$store.commit('changeList', { _id: data._id, message: data.message })
      }
      // let _id = this.userData.friend._id
      // this.$store.commit('changeList', { _id, message: data.message })
    }
  }
}
</script>

<style lang="stylus">
@import '../common/stylus/mixin.styl'

#app
  .color-b
    color:color-b
  position:relative
  min-height: 100vh
  width: 100%
  background:color-g
  .my-dialog
    position: absolute
  .my-personindex
    .mu-icon.material-icons
      color: color-b
  .container-top
    position: fixed
    z-index: 101
    top: 0
    left: 0
    width: 100%
    height: 10%
    .drawer
      position: fixed
      z-index: 1
      top: 0
      left: 0
      width: 6vw
      height: 100%
  .container-bottom
    position: fixed
    z-index:1
    bottom: 0
    left: 0
    width: 100%
    height: 10%
  .container-content
    width:100%
    .patch
      position: relative
      top: 0
      left: 0
      width: 100%
      height: 10.2vh
    .t-1
      color: color-b
    .mu-tab-text.has-icon
      margin-top: -4px
    .i-1
      font-size: 2.5em
      color: #64dd17
    .i-2
      font-size: 2.5em
      color: #f44336
    .i-3
      font-size: 2.5em
      color: #00bfa5
    .ii-1
      font-size: 2.5em
      color: #ffd600
    .ii-2
      font-size: 2.5em
      color: #ec407a
    .ii-3
      font-size: 2.5em
      color: #2962ff
</style>
