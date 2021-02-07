<template>
    <div class="playList-container">
        <div class="btn-container">
            <div class="choosed">播放列表</div>
            <div>历史记录</div>
        </div>
        <div>
            
        </div>
        <table class="my-table">
            <tbody>
                <tr class="my-bodytr" 
                    v-for="(item,index) in $store.state.playList" 
                    :key="index"
                    :class="[
                        {'shadow':index%2==0},
                        {'choosed':index==choosedIndex},
                        {'actice':$store.state.musicObj&&item.id==$store.state.musicObj.id}]"
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
                    <td><span class="text-container">{{item.lastTime}}</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    name:'PlayList',
    setup(){
        const choosedIndex = ref(null)
        const musiTrClick = (index)=>{
            choosedIndex.value = index
        }
        const store = useStore()
        const musiTrDbClick = (item)=>{
            store.dispatch('playMusicInList',item.id)
        }

        return {
            choosedIndex,
            musiTrClick,
            musiTrDbClick
        }
    }
})
</script>
<style lang="less" scoped>
.playList-container{
    background-color: white;
    z-index: 9999;
}
.btn-container{
    margin: 20px auto;
    width: 212px;
    height: 30px;
    border: 1px solid #bbbbbb;
    border-radius: 15px;
    display: flex;
    div{
        cursor: pointer;
        width: 50%;
        text-align: center;
        line-height: 28px;
        font-size: 13px;
        border-radius: 14px;
        color: #373737;
        &:hover{
            background-color: #f4f4f4;
        }
    }
    .choosed{
        background-color: #bbbbbb!important;
        color: white;
    }
}
.my-table{
    width: 100%;
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
        td:nth-child(3),td:nth-child(4){
            color: black;
        }
    }
    td{
        text-align: left;
        font-size: 12px;
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
        width: 20px;
        color: #9f9f9f;
        text-align: center;
        i{
            color: rgb(215, 53, 53);
            font-size: 14px;
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
        flex: 11;
        color: #656565;
    }
    td:nth-child(4){
        flex: 9;
        color: #9f9f9f;
    }
}
.actice{
    td:nth-child(2),td:nth-child(3){
        color: rgb(215, 53, 53)!important;
    }
}
</style>