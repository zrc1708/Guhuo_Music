<template>
    <div class="sheet-container">
        <img class="coverImage" :src="state.imageSrc" alt="">
        <div class="sheetDetail">
            <div class="name">
                <span class="myicon">歌单</span>
                {{state.name}}
            </div>
            <div class="creater">
                <img :src="state.createrImageSrc" alt="">
                <span class="createrName">{{state.createrName}}</span>
                <span class="createTime">{{state.createTime}}创建</span>
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
            <div class="tags">
                标签：<span v-if="state.tags.length!==0">
                    <span v-for="(item,index) in state.tags" :key="index" class="onetag">
                        {{item}}<span v-if="index!==state.tags.length-1">/</span>
                    </span>
                </span>
                <span v-else>无</span>
            </div>
            <div class="counts">
                <span>歌曲：<span class="my-text">{{state.musics.length}}</span></span>
                <span>播放：<span class="my-text">{{state.playCount}}</span></span>
            </div>
            <div class="desc-container">
                <div class="desc">
                    <span>简介：</span>
                    <span :class="[showDesc?'show':'hide']" v-html="state.description||'无'"></span>
                </div>
                <div class="desc-btn" :class="[showDesc?'top-btn':'']" @click="showdesc"></div>
            </div>
        </div>
    </div>
    <ul class="navul">
        <li class="active">歌曲列表</li>
        <li>评论</li>
    </ul>
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
                    <span class="name-container" :class="{'active':$store.state.musicObj&&item.id==$store.state.musicObj.id}">{{item.name}}</span>
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
import { defineComponent, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import request from '../../utils/http'
import moment from 'moment'
import { useStore } from 'vuex'

export default defineComponent({
    name:'songSheetDetail',
    setup(){
        const route = useRoute()

        const getCount = (count)=>{
            const str = count+''
            if(str.length<=5){
                return str
            }else if(str.length<=7){
                return parseInt(str.substr(0,str.length-3))/10+'万'
            }else{
                const num = parseInt(str.substr(0,str.length-7))
                const ans = num/10>1?num/10+'亿':num+'亿'
                return ans
            }
        }

        const state = reactive({
            imageSrc:'',
            name:'',
            createrImageSrc:'',
            createrName:'',
            createTime:'',
            tags:[],
            musics:[],
            playCount:'',
            description:'',
            songsList:[]
        })
        let trackIds = []
        const getSheetMusic =async ()=>{
            const res: any = await request(`/song/detail?ids=${trackIds.join(',')}`)
            state.songsList = res.songs
            if(!state.songsList) return
            state.songsList.forEach(item =>{
                item.lastTime = moment(item.dt).format('mm:ss')
            })
        }
        const getSongSheetDetail =async (id)=>{
            const res: any = await request(`/playlist/detail?id=${id}`)
            state.imageSrc = res.playlist.coverImgUrl
            state.name = res.playlist.name
            state.createrImageSrc = res.playlist.creator.avatarUrl
            state.createrName = res.playlist.creator.nickname
            state.createTime = moment(res.playlist.createTime).format('YYYY-DD-MM')
            state.tags = res.playlist.tags
            state.musics = res.playlist.trackIds
            state.playCount = getCount(res.playlist.playCount)
            if(res.playlist.description){
                state.description = res.playlist.description.replace(/\n/g, '<br>')
            }
            trackIds = res.playlist.trackIds.map(item=>item.id)
            getSheetMusic()
        }

        // 获取歌单详情
        getSongSheetDetail(route.query.id)
        // 歌单改变时进行切换
        watch(()=>route.query.id, val =>{
            val && getSongSheetDetail(route.query.id)
            state.description = ''
        })

        const showDesc = ref(false)
        const showdesc = ()=>{
            showDesc.value = !showDesc.value
        }

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
            state,
            showDesc,
            showdesc,
            choosedIndex,
            musiTrClick,
            musiTrDbClick,
            playAll,
            addAll
        }
    }
})
</script>
<style lang="less" scoped>
.sheet-container{
    display: flex;
    margin-top: 30px;
    margin-left: 30px;
    margin-right: 30px;
    overflow: hidden;
    .coverImage{
        width: 184px;
        height: 184px;
        border: 1px solid #f2f1f2;
        border-radius: 5px;
        margin-right: 20px;
    }
    .sheetDetail{
        flex: 1;
        .myicon{
            display: inline-block;
            color: #ec4141;
            width: 36px;
            height: 20px;
            line-height: 18px;
            border-radius: 3px;
            border: 1px solid #ec4141;
            font-size: 13px;
            text-align: center;
            vertical-align: middle;
            font-weight: lighter;
            margin-bottom: 4px;
        }
        .name{
            font-size: 22px;
            font-weight: bold;
            color: #373737;
            height: 30px;
            line-height: 30px;
        }
        .creater{
            margin-top: 7px;
            display: flex;
            align-items: center;
            img{
               cursor: pointer;
               width: 24px; 
               height: 24px;
               border-radius: 50%;
            }
            .createrName{
                cursor: pointer;
                font-size: 12px;
                color: #507daf;
                margin-left: 8px;
            }
            .createTime{
                margin-left: 8px;
                font-size: 12px;
                color: #676767;
            }
        }
        .btns-container{
            display: flex;
            margin-top: 13px;
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
        .tags{
            margin-top: 18px;
            font-size: 13px;
            color: rgb(55, 55, 55);
            .onetag {
                color: #507daf;
                cursor: pointer;
                span{
                    cursor: default;
                    position: relative;
                    top: -1px;
                    color: #676767;
                    margin: 0 3px;
                    font-size: 12px;
                }
            }
        }
        .counts{
            font-size: 13px;
            color: rgb(55, 55, 55);
            margin-top: 7px;
            .my-text{
                color: #676767;
                margin-right: 12px;
                cursor: default;
            }
        }
        .desc-container{
            position: relative;
        }
        .desc{
            font-size: 13px;
            color: rgb(55, 55, 55);
            margin-top: 1px;
            padding-right: 30px;
            position: relative;
            overflow: hidden;
            padding-right: 40px;
            span:nth-child(1){
                width: 16px;
                line-height: 26px;
            }
            .hide{
                position: absolute;
                top: 0;
                left: 39px;
                width: calc(100% - 79px);
                color: #676767;
                line-height: 26px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .show{
                color: #676767;
                line-height: 26px;
            }
        }
        .desc-btn{
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 0;
            width: 0px;
            height: 0px;
            border-top: 8px solid #999999;
            border-right: 6px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 6px solid transparent;
        }
        .top-btn{
            border-top: 8px solid transparent;
            border-bottom: 8px solid #999999;
        }
    }
}
.navul{
    display: flex;
    align-items: center;
    margin-top: 32px;
    margin-left: 30px;
    padding-bottom: 15px;
    li{
        margin-right: 24px;
        cursor: pointer;
        color: rgb(55, 55, 55);
        font-size: 14px;
        &:hover{
            color: black;
        }
    }
    .active{
        font-weight: bold;
        font-size: 14px;
        color: #373737;
        position: relative;
        &::after{
            content: '';
            display: block;
            position: absolute;
            top: 120%;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background-color: #ec4141;
        }
    }
}
.my-table{
    width: 100%;
    padding: 0 30px;
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
        .active{
            color: rgb(215, 53, 53);
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