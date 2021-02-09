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
    <div class="btns-container">
        <div class="btn-play">
            <div class="playAll" @click="playAll">
                <i class="iconfont icon-play-full"></i>
                <span>播放全部</span>
            </div>
            <div class="addAll" @click="addAll" title="添加全部到播放列表">
                <i class="iconfont icon-jia"></i>
            </div>
        </div>
    </div>
    <table class="my-table">
        <thead>
            <tr class="my-headtr">
                <th></th>
                <th>音乐标题</th>
                <th>歌手</th>
                <th>专辑</th>
                <th>时长</th>
            </tr>
        </thead>
        <tbody>
            <tr class="my-bodytr" 
                v-for="(item,index) in state.songsList" 
                :key="index"
                :class="[{'shadow':index%2==0},{'choosed':index==choosedIndex}]"
                @click="musiTrClick(index)"
                @dblclick="musiTrDbClick(item)">
                <td>
                    <i class="iconfont icon-laba1" v-if="$store.state.musicObj&&item.id==$store.state.musicObj.id"></i>
                    <span v-else>{{index+1>=10 ?index+1:'0'+(index+1)}}</span>
                </td>
                <td>
                    <span class="name-container">{{item.name}}</span>
                    <span class="sidename-container">{{item.alia[0]&&'('+item.alia[0]+')'}}</span>
                </td>
                <td><span class="text-container">{{item.ar.map(item=>item.name).join('/')}}</span></td>
                <td><span class="text-container">{{item.al.name}}</span></td>
                <td><span class="text-container">{{item.lastTime}}</span></td>
            </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import moment from 'moment'
import request from '../../utils/http'
import { useStore } from 'vuex'

export default defineComponent({
    name:'dailyRecommend',
    setup(){
        const day = ref(new Date().getDate())
        const state = reactive({
            songsList:[]
        })

        const getDailyRecommendDetail = async ()=>{
            const res: any = await request('/recommend/songs')
            res.data.dailySongs.forEach(item =>{
                item.lastTime = moment(item.dt).format('mm:ss')
            })
            state.songsList = res.data.dailySongs
        }
        getDailyRecommendDetail()

        const choosedIndex = ref(null)
        const musiTrClick = (index)=>{
            choosedIndex.value = index
        }
        const store = useStore()
        const musiTrDbClick = (item)=>{
            store.dispatch('playMusic',item.id)
        }

        const playAll = ()=>{
            store.commit('setPlayList', state.songsList)
            if(state.songsList[0]){
                store.dispatch('playMusic',state.songsList[0].id)
            }
        }
        const addAll = ()=>{
            store.commit('addPlayList', state.songsList)
        }

        return {
            day,
            state,
            playAll,
            addAll,
            musiTrClick,
            musiTrDbClick,
            choosedIndex
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
    cursor: default;
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
.btns-container{
    display: flex;
    margin-top: 20px;
    margin-left: 30px;
    .btn-play{
        display: flex;
        background-color: #ec4141;
        color: white;
        height: 32px;
        border-radius: 16px;
        overflow: hidden;
        &:hover{
            background-color: rgb(215, 53, 53);
        }
        .playAll{
            font-size: 14px;
            display: flex;
            align-items: center;
            padding-left: 17px;
            cursor: pointer;
            border-right: 1px solid #ed5353;
            padding-right: 8px;
            &:hover{
                background-color: rgb(204, 50, 50);
            }
            i{
                font-size: 16px;
                margin-right: 5px;
            }
        }
        .addAll{
            display: flex;
            align-items: center;
            padding-right: 12px;
            padding-left: 9px;
            cursor: pointer;
            &:hover{
                background-color: rgb(204, 50, 50);
            }
            i{
                font-size: 14px;
            }
        }
    }
}
.my-table{
    border-top: 1px solid #e1e1e1;
    width: 100%;
    margin-top: 8px;
}
.my-headtr{
    display: flex;
    th{
        text-align: left;
        font-weight: lighter;
        font-size: 14px;
        color: #9f9f9f;
        height: 34px;
        line-height: 34px;
    }
    th:nth-child(1){
        width: 50px;
    }
    th:nth-child(2){
        flex: 19;
    }
    th:nth-child(3){
        flex: 9;
    }
    th:nth-child(4){
        flex: 12;
    }
    th:nth-child(5){
        flex: 5;
    }
}
.shadow{
    background-color: #f9f9f9;
}
.choosed{
    background-color: #e5e5e5!important;
}
.my-bodytr{
    display: flex;
    &:hover{
        background-color: #f2f2f2;
    }
    td{
        text-align: left;
        font-size: 14px;
        height: 34px;
        line-height: 34px;
        position: relative;
        overflow: hidden;
        .text-container{
            padding-right: 10px;
            position: absolute;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    td:nth-child(1){
        width: 50px;
        color: #9f9f9f;
        padding-right: 20px;
        text-align: right;
        i{
            color: rgb(215, 53, 53);
        }
    }
    td:nth-child(2){
        flex: 18;
        width: 0;
        color: #363636;
        word-break: break-all;
        overflow: hidden;
        display: flex;
        padding-right: 10px;

        .name-container{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .sidename-container{
            flex: 1;
            color: #8f8f8f;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    td:nth-child(3){
        flex: 9;
        color: #656565;
    }
    td:nth-child(4){
        flex: 12;
        color: #656565;
    }
    td:nth-child(5){
        flex: 5;
        color: #9f9f9f;
    }
}
</style>