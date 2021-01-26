<template>
    <Navigation :navItem="navItem"></Navigation>
    <div class="container">
        <router-view></router-view>
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
.container{
    width: 100%;
    max-width: 1100px;
    height: calc(100% - 50px);
    margin: 0 auto;
    background-color: pink;
}
</style>