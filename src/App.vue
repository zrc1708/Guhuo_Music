<template>
<div class="app-container">
  <Loginbox v-if="showLogin" @close="close" @loginBtnClick="loginClick"></Loginbox>
  <!-- 顶部导航 -->
  <header class="header">
    <div class="logo-box">
      <a href="#">姑获云音乐</a>
    </div>
    <div class="header-control">
      <span class="icon-box left iconfont icon-left"></span>
      <span class="icon-box right iconfont icon-right"></span>
      <div class="search-box iconfont icon-sousuo">
        <input type="text" placeholder="搜索">
      </div>
    </div>
    <div class="header-user">
      <img :src="avatarUrl||$store.state.userAccount.avatarUrl||require('./assets/logo.jpg')" alt="">
      <span class="username" @click="login">{{username||$store.state.userAccount.nickname||"未登录"}}</span>
    </div>
  </header>
  <!-- 内容 -->
  <div class="content-box">
    <aside class="asidenav">
      <ul class="main-nav">
        <li class="main-active">发现音乐</li>
        <li>视频</li>
        <li>私人FM</li>
      </ul>
      <ul class="other-nav">
        <span class="other-nav-title">我的音乐</span>
        <li class="iconfont icon-B other-active"><span>我的音乐云盘</span></li>
        <li class="iconfont icon-diantai"><span>我的电台</span></li>
        <li class="iconfont icon-shoucang"><span>我的收藏</span></li>
      </ul>
      <ul class="other-nav">
        <span class="other-nav-title">创建的歌单</span>
        <li class="iconfont icon-aixin"><span>我喜欢的音乐</span></li>
        <li class="iconfont icon-gedan"><span>周杰伦</span></li>
        <li class="iconfont icon-gedan"><span>许嵩</span></li>
        <li class="iconfont icon-gedan"><span>老歌</span></li>
      </ul>
      <ul class="other-nav">
        <span class="other-nav-title">收藏的歌单</span>
        <li class="iconfont icon-gedan"><span>用烂的bgm</span></li>
        <li class="iconfont icon-gedan"><span>那些竹取飞翔</span></li>
        <li class="iconfont icon-gedan"><span>辗转攻占网易云的背景音乐背景音乐</span></li>
      </ul>
    </aside>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
  <!-- 音乐控制栏 -->
  <div class="music-control-box">
      <div class="music-detail" v-if="$store.state.musicObj">
        <img :src="$store.state.musicObj.al.picUrl" alt="">
        <div class="img-mask">
          <i class="iconfont icon-jiantou"></i>
          <i class="iconfont icon-jiantou"></i>
        </div>
        <div class="music-text">
          <span class="music-name">
            <span class="main-name">{{$store.state.musicObj.al.name}}</span>
            <span class="side-name">{{('('+$store.state.musicObj.alia[0]+')')}}</span>
          </span>
          <span class="music-author">{{$store.state.musicObj.ar.map(item=>item.name).join('/')}}</span>
        </div>
      </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import request from '../utils/http'
import Loginbox from './components/Loginbox.vue'
import { useStore } from "vuex";

export default defineComponent({
  name:'App',
  components:{
    Loginbox
  },
  setup(){
    const showLogin = ref(false)
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
      store.dispatch('playMusic',1501212275)
    })

    // 登录
    const loginClick = async (user)=>{
      const res: any = await request('/login/cellphone',user,'post')
      if(res.profile.userId){
        console.log(res.profile);
        // 存储基本信息
        localStorage.setItem('phone',user.phone)
        localStorage.setItem('username',res.profile.nickname)
        localStorage.setItem('avatarUrl',res.profile.avatarUrl)
        store.commit('setUser', res.profile)
        showLogin.value = false
      }
    }

    return{
      showLogin,
      login,
      close,
      loginClick,
      username,
      avatarUrl
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
  }
  
}
.content-box{
  flex: 1;
  display: flex;
  overflow-y: auto;

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
}
</style>
