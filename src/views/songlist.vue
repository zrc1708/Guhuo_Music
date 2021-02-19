<template>
    <div class="qualitySongList-container">
        <img :src="quality.coverImgUrl" class="backgroundImg" alt="">
        <img :src="quality.coverImgUrl" class="songlistImg" alt="">
        <div class="qualitySongList-textbox">
            <div class="lineone">
                <div class="songlistBtn">
                    <i class="iconfont icon-huangguan"></i>
                    <span>精品歌单</span>
                </div>
            </div>
            <div class="linetwo">
                <span>{{quality.name}}</span>
                <span>{{quality.copywriter}}</span>
            </div>
        </div>
    </div>
    <div class="btnline">
        <div class="allTag-btn" @click="allTagClick">
            <span>全部歌单</span>
            <i class="iconfont icon-right"></i>
        </div>
        <div class="tags-container">
            <span v-for="item in hotTags" :key="item.id">{{item.name}}</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import request from '../../utils/http'

export default defineComponent({
    name:'songlist',
    setup(){
        const state = reactive({
            quality:{},
            hotTags:[],
            allTags:[]
        })

        // 获取当前分类的首栏精品歌单
        const getQualitySongList = async (cat= '全部')=>{
            const res: any = await request(`/top/playlist/highquality?limit=1&cat=${cat}`)
            state.quality = res.playlists[0]
        }

        // 根据分类获取歌单
        const getSongList = async(cat= '全部')=>{
            const res: any = await request(`/top/playlist?limit=100&cat=${cat}`)
            console.log(res.playlists)
        }

        // 获取全部分类
        const getAllTags = async ()=>{
            const res: any = await request(`/playlist/catlist`)
            const arr = []
            for (let i = 0; i < Object.keys(res.categories).length; i++) {
                const obj = {
                    tagName: res.categories[i],
                    children:[]
                }
                for (let j = 0; j < res.sub.length; j++) {
                    if(res.sub[j].category==i){
                        obj.children.push(res.sub[j])
                    }
                }
                arr.push(obj)
            }
            state.allTags = arr
        }

        // 获取热门分类
        const getHotTags = async ()=>{
            const res: any = await request(`/playlist/hot`)
            state.hotTags = res.tags
        }

        // 获取分类
        const getTags = ()=>{
            getAllTags()
            getHotTags()
        }

        // 获取歌单
        const getSongListData = async ()=>{
            getQualitySongList()
            getSongList()
        }

        getTags()
        getSongListData()

        const allTagClick = ()=>{
            console.log(123)
        }

        return {
            ...toRefs(state),
            allTagClick
        }
    }
})
</script>
<style lang="less" scoped>
.qualitySongList-container{
    display: flex;
    padding: 15px;
    background-color: #2c2a2f;
    margin-top: 10px;
    border-radius: 5px;
    position: relative;
    overflow: hidden;

    .backgroundImg{
        position: absolute;
        width: 110%;
        left: 0;
        z-index: 1;
        margin-top: calc(-50% + 85px);
        margin-left: -5%;
        filter: blur(30px) brightness(60%);
    }
    .songlistImg{
        width: 140px;
        height: 140px;
        border-radius: 5px;
        position: relative;
        z-index: 2;
    }
    .qualitySongList-textbox{
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        position: relative;
        z-index: 2;
        .lineone{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .songlistBtn{
                width: 101px;
                height: 30px;
                border-radius: 50px;
                border: 1px solid #e7aa5a;
                color: #e7aa5a;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                i{
                    font-size: 20px;
                }
            }
        }
        .linetwo{
            flex: 1;
            display: flex;
            flex-direction: column;
            span:nth-child(1){
                color: white;
            }
            span:nth-child(2){
                margin-top: 8px;
                color: #989598;
                font-size: 12px;
            }
        }
    }
}
.btnline{
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    .allTag-btn{
        width: 101px;
        height: 30px;
        border: 1px solid #d8d8d8;
        border-radius: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover{
            background-color: rgb(242, 242, 242);
        }
        span{
            font-size: 14px;
            color: #373737;
        }
        i{
            color: #6f6f6f;
            font-size: 14px;
        }
    }
    .tags-container{
        span{
            font-size: 12px;
            color: #676767;
            margin: 0 9px;
            cursor: default;
            &:hover{
                color: #373737;
            }
        }
    }
}
</style>