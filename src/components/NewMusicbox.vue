<template>
    <div class="newMuwic-box">
        <div class="imgcontainer">
            <img :src="item.album.picUrl" alt="">
            <i class="iconfont icon-play-full"></i>
        </div>
        <div class="text-container">
            <span class="music-name">{{item.name}}</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name:'NewMusicbox',
    props:['item']
})
</script>
<style lang="less" scoped>
.newMuwic-box{
    height: 48px;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 16px;
}
.imgcontainer{
    position: relative;
    width: 48px;
    height: 48px;
    cursor: pointer;

    img{
        height: 100%;
        border-radius: 5px;
    }
    i{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, .8);
        text-align: center;
        line-height: 25px;
        color: #ec4141;
    }
}
.newMuwic-box:hover{
    background-color: rgb(234, 234, 234);
}
.text-container{
    flex: 1;
    padding-left: 10px;
    .music-name{
        font-size: 13px;
    }
}
</style>