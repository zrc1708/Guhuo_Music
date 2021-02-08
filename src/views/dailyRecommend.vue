<template>
    <div class="title-container">
        <div class="img-box">
            <i class="iconfont icon-rili1"></i>
            <span>{{day}}</span>
        </div>
        <div class="text-box">
            <span>每日歌曲推荐</span>
            <span>根据你的音乐口味生成，每天6:00更新</span>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import moment from 'moment'
import request from '../../utils/http'

export default defineComponent({
    name:'dailyRecommend',
    setup(){
        const day = ref(new Date().getDate())
        const state = reactive({
            songsList:[]
        })

        const getDailyRecommendDetail = async ()=>{
            const res: any = await request('/recommend/songs')
            console.log(res)
            // state.imageSrc = res.playlist.coverImgUrl
            // state.name = res.playlist.name
            // state.createrImageSrc = res.playlist.creator.avatarUrl
            // state.createrName = res.playlist.creator.nickname
            // state.createTime = moment(res.playlist.createTime).format('YYYY-DD-MM')
            // state.tags = res.playlist.tags,
            // state.musics = res.playlist.trackIds
            // state.description = res.playlist.description.replace(/\n/g, '<br>')
            // trackIds = res.playlist.trackIds.map(item=>item.id)
            // getSheetMusic()
        }
        getDailyRecommendDetail()
        return {
            day,
            ...toRefs(state)
        }
    }
})
</script>
<style lang="less" scoped>
.title-container{
    margin-top: 20px;
    margin-left: 30px;
    display: flex;
    align-items: center;
    .img-box{
        position: relative;
        i{
            font-size: 75px;
            color: #ec4141;
        }
        span{
            position: absolute;
            bottom: 10%;
            left: 50%;
            transform: translateX(-50%);
            color: #ec4141;
            font-size: 30px;
            font-weight: bold;
        }
    }
    .text-box{
        display: flex;
        flex-direction: column;
        margin-left: 35px;
        span:nth-child(1){
            color: #373737;
            font-size: 22px;
            font-weight: bold;
        }
        span:nth-child(2){
            margin-top: 5px;
            color: #676767;
            font-size: 12px;
        }
    }
}
</style>