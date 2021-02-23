<template>
    <div class="searchbox-container" ref="searchBox">
        <div class="hotbox" v-show="text==''||searchLists.length==0">
            <div class="hottitle">热搜榜</div>
            <div class="hotitem" @click="hotClick(item)" v-for="(item, index) in hotLists" :key="index">
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
            <div class="search-item" 
                 v-for="(item,index) in searchLists" 
                 :key="index"
                 @click="searchItemClick(item.id)">
                <span v-html="item.html"></span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch, onMounted, ref } from 'vue'
import request from '../../utils/http'
import { useStore } from 'vuex'
import useClickOutside from '../../utils/clickOutSide'

export default defineComponent({
    name:'SearchBox',
    props:['text'],
    emits:['close','hotClick'],
    setup(props,context){
        const state = reactive({
            hotLists:[],
            searchLists:[]
        })
        const store = useStore()

        const getHot = async()=>{
            const res: any = await request(`/search/hot/detail`)
            state.hotLists = res.data
        }
        getHot()

        const searchSuggest = async(val)=>{
            if(!val) return
            const res: any = await request(`/search/suggest?keywords=${val}`)
            res.result.songs&&res.result.songs.forEach(item => {
                const data = item.name+'-'+item.artists[0].name
                const str = `<span style="color: #767dc0;">${props.text}</span>`
                item.html= data.replace(props.text, str)
            });
            state.searchLists = res.result.songs||[]
        }

        let timer = null
        watch(()=>props.text, val=>{
            clearTimeout(timer)
            timer = setTimeout(()=>{
                searchSuggest(val)
            },500)
        })

        // 搜索结果点击事件
        const searchItemClick = (id)=>{
            store.dispatch('playMusic',id)
        }

        // 设置点击组件外触发关闭
        const searchBox = ref(null)
        const isClickOutside = useClickOutside(searchBox)
        let flag = true
        onMounted(()=>{
            watch(isClickOutside, () => {
                if(isClickOutside.value==true){
                    // 组件第一次被触发显示时，会被判定点击在外
                    if(flag){
                        flag = !flag
                        isClickOutside.value = false
                    }else{
                        context.emit('close')
                    }
                }
            })
        })

        // 热搜点击事件
        const hotClick = (item)=>{
            context.emit('hotClick',item.searchWord)
        }

        return {
            ...toRefs(state),
            searchItemClick,
            searchBox,
            hotClick
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
        color: #373737;
        &:hover{
            background-color: #f2f2f2;
        }
    }
}
</style>