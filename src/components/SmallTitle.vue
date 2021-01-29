<template>
    <div class="smalltitle-container">
        <span class="title">{{title}}</span>
        <i class="iconfont icon-right"></i>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name:'SmallTitle',
    props:['title']
})
</script>
<style lang="less" scoped>
.smalltitle-container{
    margin-top: 17px;
}
.title{
    color: #373737;
    font-size: 20px;
    font-weight: 600;
}
i{
    font-size: 16px;
    color: #373737;
}
</style>