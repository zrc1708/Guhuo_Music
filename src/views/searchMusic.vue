<template>
    <div class="count-box">找到{{counts}}首单曲</div>
    <div class="nav-box">
        <div class="navitem nav-choosed">单曲</div>
        <div class="navitem">歌手</div>
    </div>
    <div class="loading" v-show="isLoading">
        <i class="iconfont icon-jiazai"></i>
    </div>
    <table class="my-table" v-show="!isLoading">
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
                v-for="(item,index) in searchLists" 
                :key="index"
                :class="[{'shadow':index%2==0},{'choosed':index==choosedIndex}]"
                @click="musiTrClick(index)"
                @dblclick="musiTrDbClick(item)">
                <td>
                    <i class="iconfont icon-laba1" v-if="$store.state.musicObj&&item.id==$store.state.musicObj.id"></i>
                    <span v-else>{{(index+(pageIndex-1)*100)+1>=10 ?(index+(pageIndex-1)*100)+1:'0'+((index+(pageIndex-1)*100)+1)}}</span>
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
    <Paging class="my-paging" 
            :pageIndex="pageIndex" 
            :counts="Math.ceil(counts/100)>5?5:Math.ceil(counts/100)"
            @pagingChange="pagingChange"
            v-show="!isLoading"></Paging>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import request from '../../utils/http'
import { useStore } from 'vuex'
import moment from 'moment'
import Paging from '../components/Paging.vue'

export default defineComponent({
    name:'searchMusic',
    components:{ Paging },
    setup(){
        const state = reactive({
            searchLists:[],
            counts:0
        })
        const pageIndex = ref(1)
        const isLoading = ref(true)

        const route = useRoute()
        const getSearchList = async()=>{
            isLoading.value = true
            const searchText = route.query.searchtext
            const offset = (pageIndex.value-1)*100
            const res: any = await request(`/cloudsearch?keywords=${searchText}&offset=${offset}&limit=100`)
            console.log(res)
            state.searchLists = res.result.songs
            state.searchLists.forEach(item =>{
                item.lastTime = moment(item.dt).format('mm:ss')
            })
            state.counts = res.result.songCount
            isLoading.value = false
        }
        getSearchList()

        const choosedIndex = ref(null)
        const musiTrClick = (index)=>{
            choosedIndex.value = index
        }
        const store = useStore()
        const musiTrDbClick = (item)=>{
            store.dispatch('playMusic',item.id)
        }
        const pagingChange = (index)=>{
            const dom = document.querySelector('.content')
            dom.scrollTop = 0
            pageIndex.value = index
            getSearchList()
        }

        watch(()=>route.query.searchtext, val=>{
            if(val){
                choosedIndex.value = 1
                getSearchList()
            }
        })

        return {
            ...toRefs(state),
            musiTrClick,
            musiTrDbClick,
            choosedIndex,
            pageIndex,
            pagingChange,
            isLoading
        }
    }
})
</script>
<style lang="less" scoped>
.count-box{
    font-weight: bold;
    margin-top: 26px;
    margin-left: 30px;
    color: #363636;
}
.nav-box{
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    margin-top: 23px;
    padding-left: 30px;
    .navitem{
        color: #363636;
        font-size: 14px;
        margin-right: 30px;
        margin-bottom: 9px;
        cursor: pointer;
        &:hover{
            color: black;
        }
    }
    .nav-choosed{
        font-weight: bold;
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
.my-table{
    width: 100%;
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
.my-paging{
    margin-top: 30px;
}
</style>