<template>
<div class="app-container">
  <Loginbox v-if="showLogin" @close="close" @loginBtnClick="loginClick"></Loginbox>
  <!-- 顶部导航 -->
  <header class="header">
    <div class="logo-box">
      <a href="#">姑获云音乐</a>
    </div>
    <div class="header-control">
      <span class="icon-box left iconfont icon-left" @click="back"></span>
      <span class="icon-box right iconfont icon-right" @click="forward"></span>
      <div class="search-box iconfont icon-sousuo">
        <input type="text" placeholder="搜索" @click="searchInputClick" @keydown.enter="enter" v-model="searchText">
        <SearchBox v-if="showSearchBox" class="my-searchbox" @hotClick="hotClick" @close="searchBoxClose" :text="searchText"></SearchBox>
      </div>
    </div>
    <div class="header-user">
      <img :src="avatarUrl||$store.state.userAccount.avatarUrl||require('./assets/logo.jpg')" alt="">
      <span class="username" @click="login">{{username||$store.state.userAccount.nickname||"未登录"}}</span>
      <span class="log-btn" v-if="username" @click="logout">登出</span>
    </div>
  </header>
  <!-- 内容 -->
  <div class="content-box">
    <aside class="asidenav">
      <ul class="main-nav">
        <li class="main-active" @click="goto('/')">发现音乐</li>
        <li>视频</li>
        <li>私人FM</li>
      </ul>
      <ul class="other-nav">
        <span class="other-nav-title">我的音乐</span>
        <li class="iconfont icon-B"><span>我的音乐云盘</span></li>
        <li class="iconfont icon-diantai"><span>我的电台</span></li>
        <li class="iconfont icon-shoucang"><span>我的收藏</span></li>
      </ul>
      <ul class="other-nav">
        <span class="other-nav-title">创建的歌单</span>
        <li class="iconfont icon-gedan" 
            v-for="item in musicList.userMusicList"
            :key="item.id"
            :class="{'other-active':item.id==$route.query.id}"
            @click="musicListClick(item)"><span>{{item.name}}</span>
        </li>
      </ul>
      <ul class="other-nav">
        <span class="other-nav-title">收藏的歌单</span>
        <li class="iconfont icon-gedan" 
            v-for="item in musicList.otherMusicList"
            :key="item.id"
            :class="{'other-active':item.id==$route.query.id}"
            @click="musicListClick(item)"><span>{{item.name}}</span>
        </li>
      </ul>
    </aside>
    <div class="content">
      <router-view></router-view>
    </div>
    <!-- 播放列表组件 -->
    <PlayList class="my-playList" v-show="showPlayList"></PlayList>
  </div>
  <!-- 音乐播放详情组件 -->
  <PlayMusic :show="showPlayMusic" v-if="$store.state.musicObj"></PlayMusic>
  <!-- 底部音乐控制栏 -->
  <div class="music-control-box">
      <audio v-show="false" class="myAudio" ref="myAudio" :src="$store.state.musicObj&&$store.state.musicUrl.url"></audio>
      <div class="music-detail" v-if="$store.state.musicObj">
        <img :src="$store.state.musicObj.al.picUrl" alt="">
        <div class="img-mask" :class="[showPlayMusic?'hide':'open']" @click="maskClick">
          <i class="iconfont icon-jiantou"></i>
          <i class="iconfont icon-jiantou"></i>
        </div>
        <div class="music-text">
          <span class="music-name">
            <span class="main-name">{{$store.state.musicObj.name}}</span>
            <span class="side-name">{{$store.state.musicObj.alia[0]&&('('+$store.state.musicObj.alia[0]+')')}}</span>
          </span>
          <span class="music-author">{{$store.state.musicObj.ar.map(item=>item.name).join('/')}}</span>
        </div>
      </div>
      <div class="music-control">
        <div class="music-control-btn">
          <i class="iconfont icon-shangyishou" @click="backMusic"></i>
          <i class="iconfont" :class="[isPlay?'icon-pause-full':'icon-play-full']" @click="playMusic()"></i>
          <i class="iconfont icon-xiayishou" @click="nextMusic"></i>
        </div>
        <!-- 音乐进度条 -->
        <div class="music-progress">
          <span class="time start-time">{{currentTime}}</span>
          <div class="progress">
            <div class="now-progress" ref="myProgress">
              <i class="progress-point"></i>
            </div>
          </div>
          <span class="time end-time">{{endTime}}</span>
        </div>
      </div>
      <!-- 播放列表切换按钮 -->
      <i class="play-list iconfont icon-bofangliebiao" @click="playListClick"></i>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch} from 'vue'
import request from '../utils/http'
import Loginbox from './components/Loginbox.vue'
import PlayMusic from './components/PlayMusic.vue'
import { useStore } from "vuex";
import moment from 'moment'
import PlayList from './components/plsyList.vue'
import { useRouter } from 'vue-router'
import SearchBox from './components/SearchBox.vue'

export default defineComponent({
  name:'App',
  components:{
    Loginbox,PlayMusic,PlayList,SearchBox
  },
  setup(){
    const showLogin = ref(false)
    const showPlayMusic = ref(false)
    const isPlay = ref(false)
    const currentTime = ref('00:00') //歌曲实时时间
    const myProgress = ref(null) //进度条dom对象
    const myAudio = ref(null)
    const login = ()=>{
      showLogin.value = true
    }
    const close = ()=>{
      showLogin.value = false
    }

    // 检查本次存储是否有用户基本信息
    const username = ref('')
    username.value = localStorage.getItem('username')
    const avatarUrl = ref('')
    avatarUrl.value = localStorage.getItem('avatarUrl')

    // 使用vueX
    const store = useStore()
    onMounted(()=>{
      store.commit('setMyAudio',myAudio)
    })

    // 登录
    const loginClick = async (user)=>{
      if(!user.password) return
      const res: any = await request(`/login/cellphone`,user,'post')
      if(res.profile){
        // 存储基本信息
        localStorage.setItem('phone',user.phone)
        localStorage.setItem('username',res.profile.nickname)
        localStorage.setItem('avatarUrl',res.profile.avatarUrl)
        localStorage.setItem('userId',res.profile.userId)
        showLogin.value = false
        location.reload()
      }else{
        alert('登录失败')
      }
    }
    // 登出
    const logout = async()=>{
      localStorage.removeItem('username')
      localStorage.removeItem('avatarUrl')
      localStorage.removeItem('userId')
      await request(`/logout`)
      location.reload()
    }

    // 设置音乐结束时间（vip音乐设置试听结束时间）
    const endTime = ref('00:00')
    watch(()=>store.state.musicLrc,()=>{
      setTimeout(()=>{
        endTime.value = moment(myAudio.value.duration*1000).format('mm:ss')
      },300)
    })

    // 音乐专辑点击事件
    const maskClick = ()=>{
      showPlayMusic.value = !showPlayMusic.value
    }

    // 进度条随音乐播放移动事件
    let moveTime = null
    const pointMove = (flag)=>{
      if(flag){
        moveTime = setInterval(()=>{
          const alltime = myAudio.value.duration
          const percent = myAudio.value.currentTime / alltime
          const length = Math.ceil(392 * percent)
          currentTime.value = moment(myAudio.value.currentTime*1000).format('mm:ss')
          myProgress.value.style.width = length+'px'
        },500)
      }else{
        clearInterval(moveTime)
      }
    }

    // 播放核心逻辑
    let time = null
    const playMusic = (playTime?)=>{
      clearInterval(time)
      if(!store.state.musicUrl) return
      // 若为定点播放，先设置时间，调整进度条位置
      if( playTime ){
        myAudio.value.currentTime = playTime
        const alltime = myAudio.value.duration
        const percent = myAudio.value.currentTime / alltime
        const length = Math.ceil(392 * percent)
        myProgress.value.style.width = length+'px'
      }
      if(playTime || myAudio.value.paused){
        // 开始播放
        store.commit('setIsPlay',true)
        isPlay.value = true
        myAudio.value.play()
        // 进度条移动
        pointMove(true)
        // 时间变化
        time = setInterval(()=>{
          if(myAudio.value.ended) {
            // 播放结束
            clearInterval(time)
            pointMove(false)
            store.commit('setIsPlay',false)
            isPlay.value = false
            myProgress.value.style.width = '392px'
            currentTime.value = endTime.value
            // 播放下一首
            let index = 0
            for (let i = 0; i < store.state.playList.length; i++) {
              if(store.state.playList[i].id==store.state.musicObj.id){
                index = i+1
                break
              }
            }
            index = index > store.state.playList.length-1? 0 :index
            index&&store.dispatch('playMusic',store.state.playList[index].id)
            return
          }
          currentTime.value = moment(myAudio.value.currentTime*1000).format('mm:ss')
        },500)
      }else{
        // 触发暂停
        store.commit('setIsPlay',false)
        isPlay.value = false
        myAudio.value.pause()
        clearInterval(time)
        pointMove(false)
      }
    }

    // 根据进度条进度播放
    const playAtAnyTime = ()=>{
      const width = myProgress.value.style.width.replace('px','')
      const percent = Number(width)/392
      const alltime = myAudio.value.duration
      let playtime = Math.floor(alltime*percent)
      playtime = playtime > alltime ? alltime : playtime
      if(isPlay.value){
        playMusic(playtime)
      }else{
        myAudio.value.currentTime = playtime
      }
    }

    // 拖拽相关逻辑
    let x = 0
    let newx = 0
    function mousemove(e){
      newx = e.clientX;
      const width = myProgress.value.style.width.replace('px','')
      myProgress.value.style.width = Number(width)+newx-x+'px'
      x = newx
    }
    function mouseup(e){
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
      playAtAnyTime()
    }
    onMounted(()=>{
      const point: HTMLElement = document.querySelector('.progress-point')
      point.addEventListener('mousedown',(e)=>{
        if(!store.state.musicObj) return
        // 停止进度条自动移动防止冲突
        pointMove(false)
        x = e.clientX;
        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
      })
    })

    // 检测到音乐资源后自动进行播放
    watch(()=>store.state.musicLrc,(val)=>{
      // 先暂停当前歌曲，清除定时器
      if(isPlay.value){
        playMusic()
      }
      setTimeout(()=>{
        playMusic()  
      },50)
    })

    // 下一首点击事件
    const nextMusic = ()=>{
      if(store.state.musicObj&&store.state.playList.length>1){
        if(isPlay.value){
          playMusic()
        }
        let index = 0
        for (let i = 0; i < store.state.playList.length; i++) {
          if(store.state.playList[i].id==store.state.musicObj.id){
            index = i+1
            break
          }
        }
        index = index > store.state.playList.length-1? 0 :index
        store.dispatch('playMusic',store.state.playList[index].id)
      }
    }

    // 上一首点击事件
    const backMusic =()=>{
      if(store.state.musicObj&&store.state.playList.length>1){
        if(isPlay.value){
          playMusic()
        }
        let index = 0
        for (let i = 0; i < store.state.playList.length; i++) {
          if(store.state.playList[i].id==store.state.musicObj.id){
            index = i-1
            break
          }
        }
        index = index < 0 ? store.state.playList.length-1 :index
        store.dispatch('playMusic',store.state.playList[index].id)
      }
    }

    // 播放列表的显示控制
    const showPlayList = ref(false)
    const playListClick = ()=>{
      showPlayList.value = !showPlayList.value
    }

    // 顶部的前进、后退事件
    const back = ()=>{
      history.back()
    }
    const forward = ()=>{
      history.forward()
    }

    // 获取用户歌单
    const musicList = reactive({
      userMusicList:[],
      otherMusicList:[]
    })
    onMounted(async ()=>{
      const uid = localStorage.getItem('userId')
      if(!uid) return

      const res: any = await request(`/user/playlist?uid=${uid}`)
      res.playlist.forEach(item => {
        if(item.userId==uid){
          musicList.userMusicList.push(item)
        }else{
          musicList.otherMusicList.push(item)
        }
      });
    })

    // 歌单列表点击事件 
    const router = useRouter()
    const musicListClick = (item)=>{
      router.push({
          path:'/songsheetdetail',
          query:{
              id: item.id
          }
      })
    }

    // 发现音乐点击事件
    const goto = (path)=>{
      router.push(path)
    }

    // 搜索相关逻辑
    const searchText = ref('')
    const showSearchBox = ref(false)
    const searchInputClick = ()=>{
      showSearchBox.value = true
    }
    const searchBoxClose =()=>{
      showSearchBox.value = false
    }
    const enter = async()=>{
      showSearchBox.value = false
      router.push({
        path:'/searchmusic',
          query:{
              searchtext: searchText.value
          }
      })
      searchText.value = ''
    }
    const hotClick = (name)=>{
      showSearchBox.value = false
      router.push({
        path:'/searchmusic',
          query:{
              searchtext: name
          }
      })
    }

    return{
      showLogin,
      login,
      close,
      loginClick,
      logout,
      username,
      avatarUrl,
      showPlayMusic,
      maskClick,
      endTime,
      playMusic,
      myAudio,
      isPlay,
      myProgress,
      currentTime,
      nextMusic,
      backMusic,
      playListClick,
      showPlayList,
      back,
      forward,
      musicList,
      musicListClick,
      goto,
      searchText,
      showSearchBox,
      searchInputClick,
      searchBoxClose,
      enter,
      hotClick
    }
  }
})
</script>

<style lang="less">
.app-container{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header{
  height: 60px;
  background-color: #ec4141;
  display: flex;
  align-items: center;
  .logo-box{
    width: 200px;
    a{
      display: block;
      margin-left: 18px;
      height: 26px;
      line-height: 26px;
      background-image: url('./assets/logo.jpg');
      background-size: 26px 26px;
      background-repeat: no-repeat;
      color: white;
      padding-left: 30px;
      text-decoration: none;
      font-size: 19px;
    }
  }
  .header-control{
    display: flex;
    align-items: center;
    flex: 1;
    .icon-box{
      cursor: pointer;
      display: inline-block;
      width: 24px;
      height: 24px;
      background-color: #d93b3b;
      border-radius: 50%;
      text-align: center;
      line-height: 26px;
      color: white;
      font-size: 10px;
    }
    .left{
      margin-left: 30px;
    }
    .right{
      margin-left: 8px;
      margin-right: 12px;
    }
    .search-box{
      font-size: 14px;
      color: white;
      padding-left: 15px;
      padding-right: 10px;
      height: 32px;
      background-color: #d93b3b;
      border: 0;
      border-radius: 20px;
      position: relative;
      input{
        height: 32px;
        background-color: transparent;
        border: 0;
        color: white;
        &:focus{
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #e66060;
        }
        &::-moz-input-placeholder {
          color: #e66060;
        }
        &::-ms-input-placeholder {
          color: #e66060;
        }
      }
      .my-searchbox{
        position: absolute;
        top: 100%;
        left: -40px;
        z-index: 99999;
      }
    }
  }
  .header-user{
    display: flex;
    align-items: center;
    img{
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .username{
      color: #f9c6c6;
      margin-right: 20px;
      cursor: pointer;
    }
    .log-btn{
      color: #f9c6c6;
      margin-right: 20px;
      cursor: pointer;
    }
  }
  
}
.content-box{
  flex: 1;
  display: flex;
  overflow-y: auto;
  position: relative;

  .asidenav{
    width: 200px;
    border-right: 1px solid #e1e1e1;
    overflow-y: auto;
    &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 5px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background: transparent;
    }
    &:hover::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background:rgb(224, 224, 224);
    }

    .main-nav{
      padding:  13px 13px 0 13px;
      color: #4c4c4c;
      li{
        font-size: 15px;
        width: 168px;
        height: 36px;
        line-height: 36px;
        border-radius: 3px;
        padding-left: 8px;
        margin-bottom: 2px;
        cursor: pointer;
        &:hover{
          background-color: #f6f6f7;
        }
      }
      .main-active{
        color: #313131;
        font-weight: bold;
        font-size: 18px;
        background-color: #f6f6f7;
      }
    }

    .other-nav{
      padding:  0 13px 13px 13px;
      color: #4c4c4c;
      .other-nav-title{
        display: block;
        padding: 14px 9px 10px 9px;
        font-size: 13px;
        color: #999999;
      }
      li{
        display: flex;
        font-size: 14px;
        width: 168px;
        height: 36px;
        line-height: 36px;
        border-radius: 3px;
        padding-left: 8px;
        margin-bottom: 2px;
        cursor: pointer;
        &:hover{
          background-color: #f6f6f7;
        }
        &::before{
          font-size: 19px;
          vertical-align: middle;
        }
        span{
          padding-left: 7px;
          overflow: hidden;   
          white-space: nowrap;  
          text-overflow: ellipsis; 
        }
      }
      .other-active{
        background-color: #f6f6f7;
      }
    }
  }
}
.content{
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
      width : 5px;
      height: 1px;
  }
  &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgb(224, 224, 224);
  }
}
.music-control-box{
  height: 72px;
  background-color: rgb(246, 246, 248);
  border-top: 1px solid #e1e1e1;
  position: relative;
  
  .music-detail{
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    width: 205px;
    overflow: hidden;
    display: flex;
    img{
      width: 48px;
      height: 48px;
      display: block;
      border-radius: 4px;
    }
    .img-mask{
      overflow: hidden;
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .6);
      opacity: 0;
      cursor: pointer;
      &:hover{
        opacity: 1;
      }
      i{
        color: white;
        font-size: 16px;
        position: absolute;
        margin: 6px;
      }
    }
    .open{
      i:nth-child(1){
        top: 0;
        right: 0;
        transform: rotate(45deg);
      }
      i:nth-child(2){
        bottom: 0;
        left: 0;
        transform: rotate(-135deg);
      }
    }
    .hide{
      i:nth-child(1){
        top: 0;
        right: 0;
        transform: rotate(225deg);
      }
      i:nth-child(2){
        bottom: 0;
        left: 0;
        transform: rotate(45deg);
      }
    }
    .music-text{
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-left: 10px;
      overflow: hidden;
      .music-name{
          display: flex;        
          font-size: 15px;
          margin-bottom: 7px;
          cursor: pointer;
          .main-name{
              color:rgb(53, 53, 54);
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              &:hover{
                color: black;
              }
          }
          .side-name{
              flex: 1;
              color: rgb(159, 159, 159);
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
          }
      }
      .music-author{
          cursor: pointer;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          color: rgb(53, 53, 54);
          font-size: 13px;
      }
    }
    
  }
  .play-list{
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 25px;
    cursor: pointer;
  }
}
.music-control{
  width: 500px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .music-control-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    i{
      color: rgb(49, 49, 50);
      cursor: pointer;
    }
    i:nth-child(1),i:nth-child(3){
      font-size: 16px;
      margin: 0 31px;
      &:hover{
        color: rgb(237, 101, 102);
      }
    }
    i:nth-child(2){
      font-size: 20px;
      width: 35px;
      height: 35px;
      background-color: rgb(235, 235, 237);
      border-radius: 50%;
      text-align: center;
      line-height: 35px;
      &:hover{
        background-color: rgb(221, 221, 222);
      }
    }
  }
  .music-progress{
    display: flex;
    justify-content: center;
    align-items: center;
    .progress{
      width: 392px;
      height: 3px;
      background-color: #c2c2c4;
      display: flex;
      align-items: center;
      &:hover{
        height: 5px;
        .progress-point{
          visibility: visible;
        }
      }
    }
    .time{
      font-size: 12px;
      transform: scale(.8);
      color: #939395;
    }
  }
}
.now-progress{
  width: 0px;
  height: 100%;
  background-color: #ff4e4e;
  position: relative;
}
.progress-point{
  visibility: hidden;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(4.5px,-50%);
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  box-sizing: content-box;
  background-color: #ec4141;
  border: 3px solid #ec4141;
}
.my-playList{
  position: absolute;
  top: 0;
  right: 0;
  width: 420px;
  height: 100%;
  border-left: 1px solid #e1e1e1;
  overflow-y: auto;
  &::-webkit-scrollbar {
        width : 5px; 
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgb(224, 224, 224);
    }
}
</style>
