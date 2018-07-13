<template>
  <div id="app">
    <index v-if="islogin"></index>
    <login v-else></login>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 加载需要用到的组件
import login from './components/login/login'
import index from './components/index'

export default {
  name: 'app',
  components: {
    login,
    index
  },
  // mapState是vuex的方法之一
  computed: mapState(['islogin'])
}
</script>

<style lang="stylus">
@import './common/stylus/mixin.styl'
</style>
