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
                    <div class="playAll">
                        <i class="iconfont icon-play-full"></i>
                        <span>播放全部</span>
                    </div>
                    <div class="addAll">
                        <i class="iconfont icon-jia"></i>
                    </div>
                </div>
            </div>
            <div class="tags">
                标签：<span v-for="(item,index) in state.tags" :key="index">
                        {{item}}<span v-if="index!==state.tags.length-1">/</span>
                    </span>
            </div>
            <div class="counts">
                <span>歌曲：<span class="my-text">{{state.musics.length}}</span></span>
                <span>播放：<span class="my-text">{{state.playCount}}</span></span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '../../utils/http'
import moment from 'moment'

export default defineComponent({
    name:'songSheetDetail',
    setup(){
        const route = useRoute()
        const id = route.query.id

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
        })
        const getSongSheetDetail =async ()=>{
            const res: any = await request(`/playlist/detail?id=${id}`)
            console.log(res);
            state.imageSrc = res.playlist.coverImgUrl
            state.name = res.playlist.name
            state.createrImageSrc = res.playlist.creator.avatarUrl
            state.createrName = res.playlist.creator.nickname
            state.createTime = moment(res.playlist.createTime).format('YYYY-DD-MM')
            state.tags = res.playlist.tags,
            state.musics = res.playlist.trackIds
            state.playCount = getCount(res.playlist.playCount)
        }
        getSongSheetDetail()

        return {
            state
        }
    }
})
</script>
<style lang="less" scoped>
.sheet-container{
    display: flex;
    margin-top: 30px;
    margin-left: 30px;
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
               width: 24px; 
               height: 24px;
               border-radius: 50%;
            }
            .createrName{
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
            span {
                color: #507daf;
                span{
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
            }
        }
    }
}
</style>