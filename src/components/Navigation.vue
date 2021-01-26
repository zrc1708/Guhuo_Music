<template>
    <ul class="navul">
        <li @click="move(item)" 
            v-for="(item,index) in navItem" 
            :key="index"
            :class="{'active':item.path===$route.path}">{{item.name}}</li>
    </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name:'Navigation',
    props:['navItem'],
    methods:{
        move(item: any){
            this.$router.push(item.path)
        }
    }
})
</script>
<style lang="less" scoped>
.navul{
    display: flex;
    align-items: flex-end;
    padding-bottom: 25px;
    li{
        margin-right: 24px;
        cursor: pointer;
    }
    .active{
        font-weight: bold;
        font-size: 20px;
        color: #373737;
        position: relative;
        &::after{
            content: '';
            display: block;
            position: absolute;
            top: 120%;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 3px;
            background-color: #ec4141;
        }
    }
}
</style>