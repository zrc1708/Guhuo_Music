<template>
    <div class="newMusic-container">
        <div class="imgcontainer">
            <img :src="item.album.picUrl" alt="">
            <i class="iconfont icon-play-full"></i>
        </div>
        <div class="text-container">
            <span class="music-name">
                <span class="main-name">{{item.name}}</span>
                <span class="side-name">{{item.alias[0]&&('('+item.alias[0]+')')}}</span>
            </span>
            <span class="music-author">{{authorArr}}</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name:'NewMusicbox',
    props:['item'],
    setup(props){
        const authorArr = props.item.artists.map(item=>item.name).join('/')
        
        return {
            authorArr
        }
    }
})
</script>
<style lang="less" scoped>
.newMusic-container{
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
.newMusic-container:hover{
    background-color: rgb(234, 234, 234);
}
.text-container{
    flex: 1;
    padding-left: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .music-name{
        display: flex;        
        font-size: 13px;
        margin-bottom: 7px;

        .main-name{
            color:black;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
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
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: rgb(159, 159, 159);
        font-size: 12px;
    }
}
</style>