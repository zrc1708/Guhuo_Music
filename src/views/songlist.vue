<template>
    <div class="qualitySongList-container" v-if="quality">
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
            <span>{{btnText}}</span>
            <i class="iconfont icon-right"></i>
        </div>
        <div class="tags-container">
            <span v-for="item in hotTags" :key="item.id" @click="tagClick(item.name)">{{item.name}}</span>
        </div>
        <div class="alltags-box" v-show="allTagBoxShow">
            <div class="lineone">
                <div class="allcats-btn" @click="tagClick('全部歌单')">全部歌单</div>
            </div>
            <div class="linetwo">
                <div class="categories" v-for="(category,index) in allTags" :key="index" >
                    <div class="title">
                        <span>
                            <i class="iconfont" :class="tagnameToClass[category.tagName]"></i>
                            {{category.tagName}}
                        </span>
                    </div>
                    <div class="tags-box">
                        <span v-for="item in category.children" 
                              :key="item"
                              @click="tagClick(item.name)">{{item.name}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="loading" v-show="isLoading">
        <i class="iconfont icon-jiazai"></i>
    </div>
    <div class="my-songlistbox-container" v-show="!isLoading">
        <SongListBox class="my-songlistbox" 
                     v-for="item in songListsArr" 
                     :key="item.id" 
                     :item="item">
        </SongListBox>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import request from '../../utils/http'
import SongListBox from '../components/SongListBox.vue'

export default defineComponent({
    name:'songlist',
    components:{ SongListBox },
    setup(){
        const state = reactive({
            quality:{},
            hotTags:[],
            allTags:[],
            songListsArr:[]
        })
        const allTagBoxShow = ref(false)
        const btnText = ref('全部歌单')
        const isLoading = ref(true)
        const tagnameToClass = reactive({
            语种:'icon-diqiu',
            风格:'icon-gangqin',
            场景:'icon-kafei',
            情感:'icon-weixiao',
            主题:'icon-zhuti'
        })

        // 获取当前分类的首栏精品歌单
        const getQualitySongList = async (cat)=>{
            const res: any = await request(`/top/playlist/highquality?limit=1&cat=${cat}`)
            state.quality = res.playlists[0]
        }

        // 根据分类获取歌单
        const getSongList = async(cat)=>{
            const res: any = await request(`/top/playlist?limit=100&cat=${cat}`)
            state.songListsArr = res.playlists
            isLoading.value = false
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
        const getSongListData = async (cat= '全部')=>{
            isLoading.value = true
            getQualitySongList(cat)
            getSongList(cat)
        }

        getTags()
        getSongListData()

        // 显示/隐藏全部歌单
        const allTagClick = ()=>{
            allTagBoxShow.value = !allTagBoxShow.value
        }

        const tagClick = (tagName)=>{
            allTagBoxShow.value = false
            getSongListData(tagName)
            btnText.value = tagName
        }

        return {
            ...toRefs(state),
            allTagClick,
            tagnameToClass,
            tagClick,
            allTagBoxShow,
            btnText,
            isLoading
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
    align-items: center;
    margin-top: 15px;
    position: relative;
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
    .alltags-box{
        position: absolute;
        z-index: 2;
        top: 100%;
        left: 0;
        margin-top: 10px;
        background-color: white;
        width: 745px;
        box-shadow: 0 0 5px rgba(0, 0, 0, .2);
        border-radius: 5px;
        padding-bottom: 50px;
        .lineone{
            height: 57px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            .allcats-btn{
                margin-left: 20px;
                width: 82px;
                height: 30px;
                background-color: #fdf5f5;
                border-radius: 30px;
                color: #ec4141;
                text-align: center;
                line-height: 30px;
                font-size: 14px;
            }
        }
        .linetwo{
            .categories{
                display: flex;
                margin-top: 32px;
                .title{
                    width: 132px;
                    color: #cfcfcf;
                    span{
                        display: flex;
                        align-items: center;
                        position: relative;
                        margin-left: 50px;
                        font-size: 14px;
                        i{
                            position: absolute;
                            color: #999999;
                            font-size: 25px;
                            left: -30px;
                        }
                    }
                }
                .tags-box{
                    flex: 1;
                    display: flex;
                    flex-wrap: wrap;
                    span{
                        color: #373737;
                        width: 100px;
                        font-size: 14px;
                        margin-bottom: 17px;
                        cursor: pointer;
                        &:hover{
                            color: #ec4141;
                        }
                    }
                }
            }
        }
    }
}
@keyframes rotate{
    0%{
        transform: rotate(0);
    }
    100%{
        transform: rotate(360deg);
    }
}
.loading{
    position: relative;
    i{
        position: absolute;
        top: 200px;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 30px;
        transform-origin: center center;  
        animation: rotate 3s linear infinite;
    }
}
.my-songlistbox-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 15px;
    .my-songlistbox{
        width: calc(20% - 14.4px);
    }
}
</style>