<template>
    <div class="swiper-container">
        <ul class="swiper-main " ref="imageContainer">
            <li v-for="(item) in imageList" 
                :key="item.targetId" 
                :ref="setItemRef">
                <img :src="item.imageUrl" alt="">
            </li>
        </ul>
        <span class="btn btn-left iconfont icon-left" @click="back(activeIndex)"></span>
        <span class="btn btn-right iconfont icon-right" @click="next(activeIndex)"></span>
    </div>
    <ul class="mark">
        <li v-for="(item,index) in imageList" 
            :key="item.targetId" 
            @mouseenter="enter(index)" 
            :class="{'active':index==activeIndex}"></li>
    </ul>
</template>
<script lang="ts">
import {ref, defineComponent, onMounted, onBeforeUnmount, onUpdated} from 'vue'
export default defineComponent({
    name:'Swiper',
    props:['imageList','autoplay'],
    setup(props, context){
        const itemRefs: any[] = []

        const activeIndex = ref(0)
        const imageContainer = ref(null)
        
        let timer = null

        const setItemRef = el => {
            if(itemRefs.length<props.imageList.length){
                itemRefs.push(el)
            }
        }
        
        const next = (targetIndex) =>{
            clearInterval(timer)
            
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
            
            if(props.autoplay){
                timer = setInterval(()=>{
                    next(activeIndex.value)
                },5000)
            }
        }
        const back = (targetIndex) =>{
            clearInterval(timer)

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
            if(props.autoplay){
                timer = setInterval(()=>{
                    next(activeIndex.value)
                },5000)
            }
        }
        const enter = (index)=>{
            if(index>activeIndex.value){
                itemRefs.forEach(item=>item.classList = [])
                next(index-1)
            }else if(index<activeIndex.value){
                itemRefs.forEach(item=>item.classList = [])
                back(index+1)
            }
        }

        onMounted(()=>{
            if(props.autoplay){
                timer = setInterval(()=>{
                    next(activeIndex.value)
                },5000)
            }
        })

        let flag = true
        onUpdated(()=>{
            if(!flag) return
            itemRefs[0].classList.add('start-base')
            itemRefs[1].classList.add('start-right')
            itemRefs[itemRefs.length-1].classList.add('start-left')
            flag = false
        })

        onBeforeUnmount(()=>{
            clearInterval(timer)
        })

        return {
            activeIndex,
            setItemRef,
            next,
            back,
            enter,
            imageContainer
        }
    }
})
</script>
<style lang="less" scoped>
.swiper-container{
    width: 100%;
    overflow: hidden;
    position: relative;
    &:hover .btn{
        display: block;
    }
}
.swiper-main{
    width: calc(100% + 92px);
    margin-left: -46px;
    height: 200px;
    position: relative;
    .start-left{
        opacity: 1;
        z-index: 99;
        left: 0;
        transform: translateX(0) scale(.83);
    }
    .start-base{
        z-index: 100;
        opacity: 1;
    }
    .start-right{
        opacity: 1;
        z-index: 99;
        left: calc(100% - 540px);
        transform: translateX(0) scale(.83);
    }
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
.btn{
    position: absolute;
    top: 50%;
    z-index: 100;
    transform: translateY(-50%);
    color: white;
    background-color:rgba(0, 0, 0, .2);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    margin: 0 7px;
    display: none;
    cursor: pointer;
}
.btn-left{
    left: 0;
}
.btn-right{
    right: 0;
}
.mark{
    display: flex;
    justify-content: center;
    li{
        box-sizing: content-box;
        width: 6px;
        height: 6px;
        background-color: #e6e6e6;
        border-radius: 50%;
        margin: 10px 1px 0 1px;
        border: 4px solid white;
    }
    .active{
        background-color: #ec4141;
    }
}
</style>