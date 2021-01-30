<template>
    <div class="media-box">
        <div class="relative" v-if="isRecommend">
            <img class="pic" :src="require('../assets/recommend.png')" alt="">
            <span class="day">{{day}}</span>
        </div>
        <div class="relative picbox" v-if="!isRecommend">
            <img class="pic" :src="imageSrc" alt="">
            <i class="playicon iconfont icon-play-full"></i>
            <span class="playconut"><i class="iconfont icon-bofang"></i>{{playCount}}</span>
        </div>
        <span class="text">{{text}}</span>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
export default defineComponent({
    name:'Mediabox',
    props:{
        isRecommend:{
            default:false
        },
        imageSrc:{},
        text:{},
        playcount:{}
    },
    setup(props){
        const date = new Date()
        const day = ref(date.getDate())

        const playCount = computed(()=>{
            const str = props.playcount+''
            if(str.length<=5){
                return props.playcount
            }else if(str.length<=7){
                return parseInt(str.substr(0,str.length-3))/10+'万'
            }else{
                return parseInt(str.substr(0,str.length-7))/10+'亿'
            }
        })
        
        return {
            day,
            playCount
        }
    }
})
</script>
<style lang="less" scoped>
.text{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}
.pic{
    width: 100%;
    border-radius: 5px;
    cursor: pointer;
}
.text{
    margin-top: 8px;
    color: #373737;
    font-size: 14px;
    &:hover{
        color: black;
        cursor: pointer;
    }
}
.media-box{
    margin-bottom: 24px;
}
.relative{
    position: relative;
    img{
        display: block;
    }
}
.day{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-40%);
    color: white;
    font-size: 26px;
}
.playicon{
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 10px;
    margin-bottom: 7px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, .8);
    text-align: center;
    line-height: 30px;
    color: #ec4141;
    cursor: pointer;
    opacity: 0;
    transition: all .8s;
}
.picbox:hover .playicon{
    opacity: 1;
}
.playconut{
    color: white;
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 4px;
    margin-right: 10px;
    font-size: 12px;
    i{
        font-size: 14px;
    }
}
</style>