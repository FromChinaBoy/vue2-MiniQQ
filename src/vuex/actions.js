// actions里存放的是异步操作
// 由于vuex中的state的变更只能由mutations进行操作，所以actions不直接进行数据操作，而是调用mutations方法
// 以下出现的that都是vue实例对象，因为把axios绑定在了Vue原型上，vuex无法调用，所以这里需要传入this
import global_ from '../common/script/Global'
const actions = {
  // 异步获取基础数据
  // 这里使用了es7的async函数，相当于封装了promis的generator
  getAllData: async ({ commit }, that) => {
    // 声明变量用来存放之后获得的数据
    let self = {}
    let friends = {}
    await that.$http.get('/api/self')
      .then(({ data }) => {
        self = data.data
      })
    await that.$http.get('/api/friends')
      .then(({ data }) => {
        friends = data.data
      })
    commit('getData', {
      self, friends
    })
  },
  updateFriend: async ({ commit }, { param, that }) => {
    let friends = {}
    await that.$http.get(global_.httpApiUrl + '?s=index/Chat/getChatAndFriend&user_key=' + param.user_key)
      .then(({ data }) => {
        friends = data.friend
      })
    commit('getData', {
      friends
    })
  },
  // 聊天机器人
  sendValue: async ({ commit }, { _id, message, that }) => {
    // 声明一个变量用来储存等下ajax获取的数据
    let robotData = ''
    // 处理输入的内容，设置self为true，作为一个标记。
    commit('changeList', { self: true, _id, message })
    // 进行ajax请求，此处的that是从组件内传来的对象this
    await that.$http.get('/api/robotapi', {
      params: {
        message,
        id: _id
      }
    }).then(res => {
      // 将获取到的数据赋值给先前设置的变量
      robotData = JSON.parse(res.data.data)
      console.log(robotData)
    })
    // 判断获取到的数据类型，在进行对应操作
    if (robotData.code === 100000) {
      commit('changeList', { _id, message: robotData.text })
    } else if (robotData.code === 200000) {
      let data = robotData.text + robotData.url
      commit('changeList', { _id, message: data })
    } else if (robotData.code === 302000) {
      commit('changeList', { _id, message: '暂不支持此类对话' })
    } else {
      commit('changeList', { _id, message: '暂不支持此类对话' })
    }
  },
  // 真实对话
  sendValue2: async ({ commit }, { _id, phone_num, message, user_key, that }) => {
    // 声明一个变量用来储存等下ajax获取的数据
    // let robotData = ''
    // 处理输入的内容，设置self为true，作为一个标记。
    commit('changeList', { self: true, _id, message })
    // 进行ajax请求，此处的that是从组件内传来的对象this
    await that.$http.get(global_.httpApiUrl + '?s=index/Chat/push', {
      params: {
        phone_num: phone_num,
        message: message,
        user_key: user_key
      }
    }).then(res => {
      // 将获取到的数据赋值给先前设置的变量
      // robotData = JSON.parse(res.data.data)
      console.log(res)
    })
    // // 判断获取到的数据类型，在进行对应操作
    // if (robotData.code === 100000) {
    //   commit('changeList', { _id, message: robotData.text })
    // } else if (robotData.code === 200000) {
    //   let data = robotData.text + robotData.url
    //   commit('changeList', { _id, message: data })
    // } else if (robotData.code === 302000) {
    //   commit('changeList', { _id, message: '暂不支持此类对话' })
    // } else {
    //   commit('changeList', { _id, message: '暂不支持此类对话' })
    // }
  },
  // 真实对话
  getFriend: async ({ commit }, { user_key, that }) => {
    // 进行ajax请求，此处的that是从组件内传来的对象this
    await that.$http.get(global_.httpApiUrl + '?s=index/Chat/getChatAndFriend', {
      params: {
        user_key: user_key
      }
    }).then(res => {
      // 将获取到的数据赋值给先前设置的变量
      let data = res.data.data
      console.log(data)
      commit('getDataFriend', data.friend)
      commit('getDataMessage', data.chat_list)
      // that.$store.state.data.friends = data.friend
      localStorage.messageList = JSON.stringify(data.chat_list)
      localStorage.friends = JSON.stringify(data.friend)
    })
    // // 判断获取到的数据类型，在进行对应操作
    // if (robotData.code === 100000) {
    //   commit('changeList', { _id, message: robotData.text })
    // } else if (robotData.code === 200000) {
    //   let data = robotData.text + robotData.url
    //   commit('changeList', { _id, message: data })
    // } else if (robotData.code === 302000) {
    //   commit('changeList', { _id, message: '暂不支持此类对话' })
    // } else {
    //   commit('changeList', { _id, message: '暂不支持此类对话' })
    // }
  }
}

export default actions
