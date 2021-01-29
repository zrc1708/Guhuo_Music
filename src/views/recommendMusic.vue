<template>
    <swiper :imageList="bannerList"></swiper>
    <SmallTitle title="推荐歌单"></SmallTitle>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'

import Swiper from '../components/Swiper.vue'
import SmallTitle from '../components/SmallTitle.vue'
import request from '../../utils/http'

export default defineComponent({
    name:'recommendMusic',
    components:{
        Swiper,SmallTitle
    },
    setup(){
        // const {appContext}: any = getCurrentInstance()
        // const $http = appContext.config.globalProperties.$http

        const state = reactive({
            bannerList:[],
            songList:[]
        })
        // 获取轮播图
        const getBanner = async ()=>{
            const res: any = await request('/banner?type=0')
            state.bannerList = res.banners
        }
        getBanner()
        
        const getSongList = async ()=>{
            return 1
        }
        getSongList()

        return {
            ...toRefs(state)
        }
    }
})
</script>
<style lang="less" scoped>

</style>