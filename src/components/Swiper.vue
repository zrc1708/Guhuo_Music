<template>
    <div class="swiper-container">
        <ul class="swiper-main">
            <li v-for="(item) in imageList" 
                :key="item.targetId" 
                :ref="setItemRef"
                class="">
                <img :src="item.imageUrl" alt="">
            </li>
            <!-- <li class="base">
                <img src="http://p1.music.126.net/BTUi50pgIRv_-D6duwK4Fg==/109951165669235302.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/BW-v_cPhgeIr77B3GuQ0EA==/109951165669222743.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/kivc5Uo-78PA7OuTinMyVw==/109951165667525529.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/bbxj0yP1-cWtBjwsTjF78A==/109951165667737887.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/WPVCYYzt1bCEwWJz6qMQow==/109951165667755518.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/ffVsEwnEe2EWn1wOYCEo-A==/109951165667772392.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/OnGx3wHOZ_Bo8i7p9CA-Hw==/109951165667789279.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/c4IlsfyzpmNhPQq_qkQZjA==/109951165667757289.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/8OrTQLzEUUTbkF8aA8okPQ==/109951165667528732.jpg" alt="">
            </li>
            <li class="base">
                <img src="http://p1.music.126.net/-GWq0VQoqJvJDZU-dDnDPw==/109951165667779898.jpg" alt="">
            </li> -->
        </ul>
        <button @click="back(activeIndex)">&lt;</button>
        <button @click="next(activeIndex)">&gt;</button>
        <button @click="jump">test</button>
    </div>
</template>
<script lang="ts">
import {ref, defineComponent, onMounted, onUpdated, nextTick, onBeforeUpdate } from 'vue'
export default defineComponent({
    name:'Swiper',
    props:['imageList'],
    setup(props, context){
        const itemRefs: any[] = []

        const activeIndex = ref(0)

        const setItemRef = el => {
            itemRefs.push(el)
        }
        
        onUpdated(()=>{
            const length = itemRefs.length
            itemRefs[0].classList = ['base']
            itemRefs[1].classList = ['right']
            itemRefs[length-1].classList = ['left']
        })
        
        const next = (targetIndex) =>{
            const leftIndex = targetIndex-1 >= 0 ? targetIndex-1:itemRefs.length-1
            const rightIndex = targetIndex+1 <= itemRefs.length-1 ? targetIndex+1:0
            const rightRightIndex = rightIndex+1 <= itemRefs.length-1 ? rightIndex+1:0

            itemRefs[targetIndex].classList = ['baseToLeft-next']
            itemRefs[rightIndex].classList=['rightToBase-next']
            itemRefs[leftIndex].classList=['leftToBase-next']
            itemRefs[rightRightIndex].classList = ['baseToRight-next']

            if(targetIndex==itemRefs.length-1){
                targetIndex = 0
            }else{
                targetIndex++
            }
            activeIndex.value = targetIndex
        }
        const back = (targetIndex) =>{
            const leftIndex = targetIndex-1 >= 0 ? targetIndex-1:itemRefs.length-1
            const rightIndex = targetIndex+1 <= itemRefs.length-1 ? targetIndex+1:0
            const leftLeftIndex = leftIndex-1 >= 0 ? leftIndex-1:itemRefs.length-1

            itemRefs[targetIndex].classList = ['baseToRight-back']
            itemRefs[rightIndex].classList=['rightToBase-back']
            itemRefs[leftIndex].classList=['leftToBase-back']
            itemRefs[leftLeftIndex].classList = ['baseToLeft-back']

            if(targetIndex==0){
                targetIndex = itemRefs.length-1
            }else{
                targetIndex--
            }
            activeIndex.value = targetIndex
        }
        const jump = ()=>{
            itemRefs.forEach(item=>item.classList = [])
            next(5)
        }
        return {
            // itemRefs,
            activeIndex,
            setItemRef,
            next,
            back,
            jump
        }
    }
})
</script>
<style lang="less" scoped>
.swiper-container{
    width: 100%;
    height: 300px;
    overflow: hidden;
}
.swiper-main{
    width: calc(100% + 92px);
    margin-left: -46px;
    height: 200px;
    position: relative;
    li {
        border-radius: 9px;
        overflow: hidden;
        position: absolute;
        top: 0;
        width: 540px;
        height: 200px;
        opacity: 0;

        left: 50%;
        transform: translateX(-50%);
        img{
            width: 100%;
        }
    }
    .hide{
        opacity: 0;
    }
    .base{
        z-index: 100;
        opacity: 1;
    }
    .left{
        opacity: 1;
        z-index: 99;
        left: 0;
        transform: translateX(0) scale(.83);
    }
    .right{
        opacity: 1;
        z-index: 99;
        left: calc(100% - 540px);
        transform: translateX(0) scale(.83);
    }
    .baseToRight-next{
        animation: baseToRight-next .6s forwards;
    }
    .baseToRight-back{
        animation: baseToRight-back .6s forwards;
    }
    .baseToLeft-next{
        animation: baseToLeft-next .6s forwards;
    }
    .baseToLeft-back{
        animation: baseToLeft-back .6s forwards;
    }
    .rightToBase-next{
        animation: rightToBase-next .6s forwards;
    }
    .rightToBase-back{
        animation: rightToBase-back .6s forwards;
    }
    .leftToBase-next{
        animation: leftToBase-next .6s forwards;
    }
    .leftToBase-back{
        animation: leftToBase-back .6s forwards;
    }
    @keyframes baseToRight-next {
        0%{
            opacity: 1;
            z-index: 90;
        }
        100%{
            opacity: 1;
            z-index: 99;
            left: calc(100% - 540px);
            transform: translateX(0) scale(.83);
        }
    }
    @keyframes baseToRight-back {
        0%{
            opacity: 1;
            z-index: 100;
        }
        100%{
            opacity: 1;
            z-index: 99;
            left: calc(100% - 540px);
            transform: translateX(0) scale(.83);
        }
    }
    @keyframes baseToLeft-next {
        0%{
            opacity: 1;
            z-index: 100;
        }
        100%{
            opacity: 1;
            z-index: 99;
            left: 0;
            transform: translateX(0) scale(.83);
        }
    }
    @keyframes baseToLeft-back {
        0%{
            opacity: 1;
            z-index: 10;
        }
        100%{
            opacity: 1;
            z-index: 99;
            left: 0;
            transform: translateX(0) scale(.83);
        }
    }
    @keyframes rightToBase-next {
        0%{
            opacity: 1;
            z-index: 99;
            left: calc(100% - 540px);
            transform: translateX(0) scale(.83);
        }
        100%{
            opacity: 1;
            z-index: 100;
            left: 50%;
            transform: translateX(-50%);
        }
    }
    @keyframes rightToBase-back {
        0%{
            opacity: 1;
            z-index: 99;
            left: calc(100% - 540px);
            transform: translateX(0) scale(.83);
        }
        99%{
            opacity: 1;
            z-index: 10;
            left: 50%;
            transform: translateX(-50%);
        }
        100%{
            opacity: 0;
        }
    }
    @keyframes leftToBase-next {
        0%{
            opacity: 1;
            z-index: 99;
            left: 0;
            transform: translateX(0) scale(.83);
        }
        99%{
            opacity: 1;
            z-index: 10;
            left: 50%;
            transform: translateX(-50%);
        }
        100%{
            opacity: 0;
        }
    }
    @keyframes leftToBase-back {
        0%{
            opacity: 1;
            z-index: 99;
            left: 0;
            transform: translateX(0) scale(.83);
        }
        100%{
            opacity: 1;
            z-index: 100;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}


</style>