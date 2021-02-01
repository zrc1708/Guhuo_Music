<template>
    <div class="playmusic-container" :class="[show?'show':'hide']">
        <textarea name="" id="" cols="70" rows="40" v-model="$store.state.musicLrc.lrc.lyric"></textarea>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStore } from "vuex";

export default defineComponent({
    name:'PlayMusic',
    props:{
        "show":{}
    },
    setup(props,context){
        const store = useStore()

        onMounted(()=>{
            console.log(store.state);
        })
        

        return {

        }
    }
})
</script>
<style lang="less" scoped>
.playmusic-container{
    opacity: 0;
    transform: scale(.1);
    visibility: hidden;

    position: absolute;
    z-index: 999;
    bottom: 72px;
    left: 0;
    background-color: white;
    width: 100%;
    height: calc(100% - 132px);

    transform-origin: 0 100%;
    transition: opacity .4s,transform .4s, visibility .4s;
}
.show{
    visibility: visible;
    opacity: 1;
    transform: scale(1);
}
</style>