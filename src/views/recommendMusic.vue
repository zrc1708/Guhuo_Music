<template>
    <swiper :imageList="bannerList" :autoplay="true"></swiper>
    <SmallTitle title="推荐歌单"></SmallTitle>
    <div class="songList-box">
        <Mediabox class="mediabox" :isRecommend="true" text="每日歌曲推荐"></Mediabox>
        <Mediabox   class="mediabox"
                    v-for="item in songList" 
                    :key="item.id"
                    :imageSrc="item.picUrl"
                    :text="item.name"
                    :playcount="item.playcount"
                    :id="item.id"></Mediabox>
    </div>
    <SmallTitle title="最新音乐"></SmallTitle>
    <div class="newMusic-box">
        <NewMusicbox class="newmusicbox"
                    v-for="item in newMusicList" 
                    :key="item.id"
                    :item="item"></NewMusicbox>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'

import Swiper from '../components/Swiper.vue'
import SmallTitle from '../components/SmallTitle.vue'
import request from '../../utils/http'
import Mediabox from '../components/Mediabox.vue'
import NewMusicbox from '../components/NewMusicbox.vue'

export default defineComponent({
    name:'recommendMusic',
    components:{
        Swiper,SmallTitle,Mediabox,NewMusicbox
    },
    setup(){
        // const {appContext}: any = getCurrentInstance()
        // const $http = appContext.config.globalProperties.$http

        const state = reactive({
            bannerList:[],
            songList:[],
            newMusicList:[]
        })
        // 获取轮播图
        const getBanner = async ()=>{
            const res: any = await request('/banner?type=0')
            state.bannerList = res.banners
        }
        getBanner()
        
        // 获取推荐歌单
        const getRecommendResource = async ()=>{
            const res: any = await request('/recommend/resource')
            res.recommend.splice(8,res.recommend.length-9)
            state.songList = res.recommend
        }
        
        // 获取最新音乐
        const getNewMusicList = async ()=>{
            const res: any = await request('/top/song?type=0')
            res.data.splice(11,res.data.length-12)
            state.newMusicList = res.data
        }

        onMounted(()=>{
            getRecommendResource()
            getNewMusicList()
        })

        return {
            ...toRefs(state)
        }
    }
})
</script>
<style lang="less" scoped>
.songList-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.mediabox{
    width: calc(20% - 16px);
}
.newMusic-box{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    height: 256px;
}
.newmusicbox{
    width: calc(33.3% - 7.3px);
}
</style>