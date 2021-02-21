<template>
    <div class="paging-container">
        <!-- 网易云的歌单只显示10页 -->
        <div class="paging-item iconfont icon-left"
             :class="{'no':pageIndex==1}"
             @click="pagingItemClick(pageIndex-1)"></div>
        <div class="paging-item" 
             v-for="i in 10" 
             :key="i" 
             :class="{'paging-active':pageIndex==i}"
             @click="pagingItemClick(i)">{{i}}</div>
        <div class="paging-item iconfont icon-right" 
             :class="{'no':pageIndex==10}"
             @click="pagingItemClick(pageIndex+1)"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name:'Paging',
    props:['pageIndex'],
    setup(props, context){
        const pagingItemClick = (val)=>{
            if(val==0||val==11) return
            context.emit('pagingChange',val)
        }

        return {
            pagingItemClick
        }
    }
})
</script>
<style lang="less" scoped>
.paging-container{
    display: flex;
    justify-content: center;
    padding-bottom: 100px;
    .paging-item{
        border: 1px solid #e6e6e6;
        color: #676767;
        border-radius: 5px;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        margin: 0 2px;
        font-size: 12px;
        cursor: pointer;
        &:hover{
            background-color: #f2f2f2;
        }
    }
    .paging-active{
        background-color: #ec4141;
        color: white;
        border-color: #d43a3a;
        &:hover{
            background-color: #ec4141;
        }
    }
    .no{
        color: #cbcbcb;
        cursor: default;
        &:hover{
            background-color: transparent;
        }
    }
}
</style>