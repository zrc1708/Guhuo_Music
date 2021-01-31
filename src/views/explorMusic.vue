<template>
    <Navigation :navItem="navItem"></Navigation>
    <div class="overflow">
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import Navigation from '../components/Navigation.vue'

export default defineComponent({
    name:'explorMusic',
    components:{
        Navigation
    },
    setup(){
        // 导航数据
        const navItem = [
            {name:'个性推荐',path:'/explormusic/recommendmusic'},
            {name:'歌单',path:'/explormusic/songlist'},
            {name:'主播电台',path:'/explormusic/anchorradio'},
            {name:'排行榜',path:'/explormusic/leaderboard'},
            {name:'歌手',path:'/explormusic/singer'},
            {name:'最新音乐',path:'/explormusic/latestmusic'}
        ]
        
        return {
            navItem
        }
    }
})
</script>
<style lang="less" scoped>
.overflow{
    width: 100%;
    height: calc(100% - 70px);
    overflow-y: auto;
    padding: 0 30px;

    &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 5px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background   :rgb(224, 224, 224);
    }
}
.container{
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
}
</style>