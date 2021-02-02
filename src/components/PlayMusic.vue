<template>
    <div class="playmusic-container" :class="[show?'show':'hide']">
        <div class="playmusic-main">
            <div class="music-picbox">
                <img class="needle" :class="{'needle-rotate':$store.state.isPlay}" :src="require('../assets/needle.png')" alt="">
                <i class="needle-point"></i>
                <img class="disc" ref="disc" :src="require('../assets/disc.png')" alt="">
            </div>
            <div class="music-lrcbox">
                <textarea name="" id="" cols="40" rows="40" v-model="$store.state.musicLrc.lrc.lyric"></textarea>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useStore } from "vuex";

export default defineComponent({
    name:'PlayMusic',
    props:{
        "show":{}
    },
    setup(props,context){
        const store = useStore()

        onMounted(()=>{
            console.log(store.state);
        })
        
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

        return {
            disc
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
    height: 470px;
    margin: 0 auto;
    background-color: pink;
    display: flex;
    overflow: hidden;

    .music-picbox{
        width: 50%;
        position: relative;
        .disc{
            width: 324px;
            margin-top: 55px;
            border: 7px solid #efefef;
            border-radius: 50%;
        }
        .needle{
            position: absolute;
            z-index: 20;
            top: 0;
            left: 140px;
            height: 133px;
            transform-origin: 20px 0;
            transform: rotate(-32deg);
            transition: transform .8s;
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
        
    }
}
</style>