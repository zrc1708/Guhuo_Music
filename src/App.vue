<template>
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
      <img :src="require('./assets/logo.jpg')" alt="">
      <span>jibei</span>
    </div>
  </header>
  <!-- 内容 -->
  <div class="content-box">
    <aside class="asidenav">导航</aside>
    <div class="content">
      内容
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name:'App',
})
</script>

<style lang="less">
.header{
  height: 60px;
  background-color: #ec4141;
  display: flex;
  align-items: center;
  .logo-box{
    width: 200px;
    a{
      margin-left: 18px;
      height: 26px;
      line-height: 26px;
      background-image: url('./assets/logo.jpg');
      background-size: 24px 24px;
      background-repeat: no-repeat;
      
      color: white;
      padding-left: 30px;
      text-decoration: none;
      font-size: 19px;
      font-weight: bold;
    }
  }
  .header-control{
    display: flex;
    align-items: center;
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
      font-size: 18px;
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

  }
  
}
.content-box{
  display: flex;
  height: calc(100% - 60px);

  .asidenav{
    width: 200px;
    border-right: 1px solid #e1e1e1;
  }
}
</style>
