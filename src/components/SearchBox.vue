<template>
    <div class="searchbox-container">
        <div class="hotbox" v-show="text==''||searchLists.length==0">
            <div class="hottitle">热搜榜</div>
            <div class="hotitem" v-for="(item, index) in hotLists" :key="index">
                <div class="index">{{index+1}}</div>
                <div class="item">
                    <div class="title">
                        {{item.searchWord}}
                        <span>{{item.score}}</span>
                    </div>
                    <div class="desc">{{item.content}}</div>
                </div>
            </div>
        </div>
        <div class="searchbox" v-show="searchLists.length!=0">
            <div class="search-smalltext">搜“<span>{{text}}</span>”相关的结果&gt;</div>
            <div class="searchtitle">
                <i class="iconfont icon-yinfu"></i>
                单曲
            </div>
            <div class="search-item" v-for="(item,index) in searchLists" :key="index">
                <span class="name">{{item.name}}</span>
                <span class="author">{{'-'+item.artists[0].name}}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import request from '../../utils/http'

export default defineComponent({
    name:'SearchBox',
    props:['text'],
    setup(props){
        const state = reactive({
            hotLists:[],
            searchLists:[]
        })

        const getHot = async()=>{
            const res: any = await request(`/search/hot/detail`)
            state.hotLists = res.data
        }
        getHot()

        const searchSuggest = async(val)=>{
            if(!val) return
            const res: any = await request(`/search/suggest?keywords=${val}`)
            console.log(res.result.songs)
            state.searchLists = res.result.songs
        }

        let timer = null
        watch(()=>props.text, val=>{
            clearTimeout(timer)
            timer = setTimeout(()=>{
                searchSuggest(val)
            },500)
        })

        return {
            ...toRefs(state)
        }
    }
})
</script>
<style lang="less" scoped>
.searchbox-container{
    width: 350px;
    height: 450px;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, .2);
    border-radius: 5px;
    overflow-y: auto;
    padding-bottom: 3px;
    &::-webkit-scrollbar {
        width : 5px; 
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgb(224, 224, 224);
    }
}
.hotbox{
    .hottitle{
        color: #676767;
        margin-left: 20px;
        margin-top: 16px;
        margin-bottom: 20px;
    }
    .hotitem{
        display: flex;
        padding: 6px 0;
        cursor: pointer;
        &:hover{
            background-color: #f2f2f2;
        }
        .index{
            color: #ff3c3c;
            width: 53px;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .title{
            color: #373737;
            font-size: 12px;
            span{
                color: #cfcfcf;
                margin-left: 20px;
            }
        }
        .desc{
            color: #9f9f9f;
            font-size: 12px;
            margin-top: 5px;
        }
    }
}
.searchbox{
    .search-smalltext{
        color: #373737;
        font-size: 12px;
        height: 26px;
        line-height: 26px;
        padding-left: 10px;
        span{
            color: #767dc0;
        }
    }
    .searchtitle{
        color: #353536;
        background-color: #f5f5f7;
        height: 26px;
        line-height: 26px;
        padding-left: 10px;
    }
    .search-item{
        font-size: 12px;
        padding-left: 30px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        &:hover{
            background-color: #f2f2f2;
        }
        .name{
            color: #767dc0;
        }
        .author{
            color: #373737;
        }
    }
}
</style>