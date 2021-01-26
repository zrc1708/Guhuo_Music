<template>
    {{bannerList}}
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, toRefs } from 'vue'
export default defineComponent({
    name:'recommendMusic',
    setup(){
        const {appContext}: any = getCurrentInstance()
        const $http = appContext.config.globalProperties.$http

        // 获取轮播图\
        const state = reactive({
            bannerList:[]
        })
        const getBanner = async ()=>{
            const {data} = await $http('/banner?type=0')
            state.bannerList = data.banners
        }
        getBanner()
        
        return {
            ...toRefs(state)
        }
    }
})
</script>
<style lang="less" scoped>

</style>