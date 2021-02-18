<template>
    <div class="playmusic-container" :class="[show?'show':'hide']">
        <div class="playmusic-main">
            <div class="music-picbox">
                <img class="needle" :class="{'needle-rotate':$store.state.isPlay}" :src="require('../assets/needle.png')" alt="">
                <i class="needle-point"></i>
                <span class="disc-box" ref="disc">
                    <img class="disc" :src="require('../assets/disc.png')" alt="">
                    <img class="music-pic" :src="$store.state.musicObj.al.picUrl" alt="">
                </span>
            </div>
            <div class="music-lrcbox">
                <div class="title">{{$store.state.musicObj.name}}</div>
                <div class="discribe" v-if="$store.state.musicObj.alia[0]">{{$store.state.musicObj.alia[0]}}</div>
                <div class="detail">
                    <span class="group">专辑：
                        <span>{{$store.state.musicObj.al.name}}</span>
                    </span>
                    <span class="group">歌手：
                        <span>{{$store.state.musicObj.ar.map(item=>item.name).join('/')}}</span>
                    </span>
                </div>
                <div class="lrc-container" ref="lrcContainer" v-if="lrcArr[0]" @mouseenter="enter" @mouseleave="leave">
                    <div class="sentence" 
                        v-for="(item,index) in lrcArr" 
                        :key="index">
                        {{item.world}}
                    </div>
                </div>
                <div class="lrc-container nolrc" v-else>
                    纯音乐，请您欣赏
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, computed, reactive, ref, toRefs, watch } from 'vue'
import { useStore } from "vuex";

export default defineComponent({
    name:'PlayMusic',
    props:{
        "show":{}
    },
    setup(props,context){
        const store = useStore()
        const state = reactive({
            lrcArr:null
        })

        // 获取歌词
        state.lrcArr = computed<any[]>(() => {
            if(!store.state.musicLrc.lrc) return []
            const arr = store.state.musicLrc.lrc.lyric.split('\n')
            const ans = []
            let index = 0
            arr.forEach(item =>{
                const time = item.match(/\[([^)]*)\]/,'')
                const world = item.replace(/^\[\S*\]/,'')
                let arr = []
                let second = 0
                if(time){
                    arr = time[1].split(':')
                    if(arr.length==2){
                        second = Number(arr[0])*60+Number(arr[1])
                    }else if(arr.length==3){
                        second = Number(arr[0])*60*60+Number(arr[1])*60+Number(arr[2])
                    }
                }
                if(time) {
                    ans.push({
                        index:index++,
                        time:time[1],
                        second,
                        world
                    })
                }
            })
            return ans
        })
        
        // 唱片滚动逻辑
        const disc = ref(null)
        let discTimer = null
        watch(()=>store.state.isPlay,(val)=>{
            if(val){
                discTimer = setInterval(()=>{
                    let deg = Number(disc.value.style.transform.replace('rotate(','').replace('deg)',''))||0
                    if(deg==360){
                        deg = 0
                    }
                    disc.value.style.transform = `rotate(${deg+1}deg)`
                },50)
            }else{
                clearInterval(discTimer)
            }
        })

        
        // 歌词滚动动画效果
        let animateFlag = true
        function animate(obj, target) {
            clearInterval(obj.timer)
            obj.timer = setInterval(function () {
                if(!animateFlag) return
                let step = (target - obj.scrollTop) / 10
                step = step > 0 ? Math.ceil(step) : Math.floor(step)
                if (obj.scrollTop == target) {
                    clearInterval(obj.timer)
                }
                obj.scrollTop = obj.scrollTop + step
            }, 15);
        }
        
        // 歌词滚动逻辑
        const {myAudio} = store.state
        const lrcContainer = ref(null)
        let lrcTimer = null
        let lastMaxIndex = null
        watch(()=>store.state.isPlay,(val)=>{
            if(val&&store.state.musicLrc.lrc){
                lrcTimer = setInterval(()=>{
                    let maxIndex = null
                    for (let i = 0; i < lrcContainer.value.children.length; i++) {
                        if(state.lrcArr[i].second<myAudio.currentTime+0.2){
                            maxIndex = i
                        }
                    }
                    if(maxIndex!==lastMaxIndex){
                        // 重置上一句歌词颜色
                        if(lastMaxIndex!==null){
                            lrcContainer.value.children[lastMaxIndex].style = ''
                        }
                        // 设置匹配的歌词样式
                        lrcContainer.value.children[maxIndex].style.color = 'black'
                        lrcContainer.value.children[maxIndex].style.fontSize = '16px'
                        lrcContainer.value.children[maxIndex].style.fontWeight = 'bold'
                        if(animateFlag){
                            animate(lrcContainer.value,lrcContainer.value.children[maxIndex].offsetTop-121)
                        }
                        lastMaxIndex = maxIndex
                    }
                },200)
            }else{
                clearInterval(lrcTimer)
            }
        })

        // 播放时，歌词若手动滚动，就停止自动滚动5秒
        let animateFlagTimer = null
        const scroll = function() {
            animateFlag = false
            clearTimeout(animateFlagTimer)
            animateFlagTimer = setTimeout(()=>{
                animateFlag = true
            },5000)
        }
        const enter = ()=>{
            lrcContainer.value.addEventListener('scroll', scroll)
        }
        const leave = ()=>{
            lrcContainer.value.removeEventListener('scroll', scroll)
        }

        return {
            disc,
            ...toRefs(state),
            lrcContainer,
            enter,
            leave
        }
    }
})
</script>
<style lang="less" scoped>
.playmusic-container{
    opacity: 0;
    transform: scale(.1);
    visibility: hidden;
    position: absolute;
    z-index: 999;
    bottom: 72px;
    left: 0;
    background-color: white;
    width: 100%;
    height: calc(100% - 132px);
    transform-origin: 0 100%;
    transition: opacity .4s,transform .4s, visibility .4s;
}
.show{
    visibility: visible;
    opacity: 1;
    transform: scale(1);
}
.playmusic-main{
    width: 100%;
    max-width: 850px;
    height: 430px;
    margin: 0 auto;
    display: flex;
    overflow: hidden;
    .music-picbox{
        width: 50%;
        position: relative;
        .disc-box{
            position: relative;
            margin-top: 55px;
            display: inline-block;
            .disc{
                position: relative;
                width: 324px;
                border: 7px solid #efefef;
                border-radius: 50%;
                z-index: 11;
            }
            .music-pic{
                position: absolute;
                top: 58px;
                left: 58px;
                width: 208px;
                height: 208px;
                border-radius: 50%;
                z-index: 10;
            }
        }
        .needle{
            position: absolute;
            z-index: 20;
            top: 0;
            left: 140px;
            height: 133px;
            transform-origin: 20px 0;
            transform: rotate(-32deg);
            transition: transform .7s;
        }
        .needle-rotate{
            transform: rotate(0deg);
        }
        .needle-point{
            position: absolute;
            top: 0;
            left: 148px;
            transform: translateY(-50%);
            background-color: #dededf;
            border: 8px solid white;
            width: 25px;
            height: 25px;
            border-radius: 50%;
            box-shadow: -2px 1px 5px 3px rgba(0, 0, 0, .3);
        }
    }
    .music-lrcbox{
        flex: 1;
        padding-top: 31px;
        display: flex;
        flex-direction: column;

        .title{
            font-size: 22px;
            color: rgb(51, 51, 51);
        }
        .discribe{
            font-size: 14px;
            color: rgb(51, 51, 51);
            margin-top: 11px;
        }
        .detail{
            margin-top: 16px;
            font-size: 12px;
            color: #9a9a9a;
            .group{
                display: inline-block;
                max-width: 140px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: break-all;
                margin-right: 5px;
                span{
                    color: #507daf;
                    cursor: pointer;
                    &:hover{
                        color: rgb(11, 88, 176);
                    }
                }
            }
        }
    }
}
.lrc-container{
    position: relative;
    overflow-y: auto;
    margin-top: 34px;
    border-right: 1px solid rgb(233, 233, 235);
    &::-webkit-scrollbar {
        width : 5px;
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgb(233, 233, 235);
    }

    .sentence{
        color: rgb(102, 102, 102);
        min-height: 18px;
        font-size: 14px;
        margin-bottom: 16px;
    }
}
.nolrc{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333333;
}
</style>