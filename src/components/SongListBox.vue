<template>
    <div class="songlistbox-container" @click="picClick">
        <div class="img-container">
            <div class="playcount">
                <span class="flex-box">
                    <i class="iconfont icon-bofang"></i>
                    {{playCount}}
                </span>
            </div>
            <img :src="item.coverImgUrl" alt="">
            <div class="author">
                <span class="flex-box">
                    <i class="iconfont icon-yonghu"></i>
                    {{item.creator.nickname}}
                </span>
            </div>
            <div class="icon-box">
                <i class="iconfont icon-play-full"></i>
            </div>
        </div>
        <span class="text">{{item.name}}</span>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name:'SongListBox',
    props:['item'],
    setup(props){
        const playCount = computed(()=>{
            const str = props.item.playCount+''
            if(str.length<=5){
                return props.item.playCount
            }else if(str.length<=7){
                return parseInt(str.substr(0,str.length-4))+'万'
            }else{
                const num = parseInt(str.substr(0,str.length-7))
                const ans = num/10>1?num/10+'亿':num+'亿'
                return ans
            }
        })

        const router = useRouter()
        const picClick = ()=>{
            router.push({
                path:'/songsheetdetail',
                query:{
                    id: props.item.id
                }
            })
        }

        return {
            playCount,
            picClick
        }
    }
})
</script>
<style lang="less" scoped>
.songlistbox-container{
    margin-bottom: 28px;
    .img-container{
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        .playcount{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background: linear-gradient(to bottom,rgba(0, 0, 0, 0.25),transparent);;
            color: white;
            font-size: 12px;
            text-align: right;
            .flex-box{
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-top: 4px;
                margin-right: 8px;
                i{
                    font-size: 14px;
                }
            }
        }
        img{
            width: 100%;
            display: block;
        }
        .author{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background: linear-gradient(to top,rgba(0, 0, 0, 0.25),transparent);;
            color: white;
            font-size: 12px;
            display: flex;
            justify-content: flex-start;
            align-items: flex-end;
            .flex-box{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 8px;
                margin-left: 8px;
                i{
                    font-size: 12px;
                    margin-right: 2px;
                }
            }
        }
        .icon-box{
            position: absolute;
            bottom: 0;
            right: 0;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, .8);
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            margin-bottom: 10px;
            margin-right: 10px;
            opacity: 0;
            i{
                color: #ec4141;
                font-size: 22px;
            }
        }
        &:hover .icon-box{
            opacity: 1;
        }
    }
    .text{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 8px;
        color: #373737;
        font-size: 14px;
        word-break: break-all;
        &:hover{
            color: black;
            cursor: pointer;
        }
    }
}
</style>