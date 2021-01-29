<template>
    <div class="loginbox-container" ref="loginbox">
        <i class="close-btn iconfont icon-guanbi" @click="closeClick"></i>
        <div class="icon">
            <i class="iconfont icon-shouji1"></i>
            <i class="iconfont icon-gou"></i>
        </div>
        <div class="input-box one iconfont icon-shouji">
            <input type="text" placeholder="请输入手机号" v-model="user.phone">
        </div>
        <div class="input-box two iconfont icon-mima">
            <input type="password" placeholder="请输入密码" v-model="user.password">
        </div>
        <button class="login-btn" @click="loginClick">登录</button>
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import useClickOutside  from '../../utils/clickOutSide'

export default defineComponent({
    name:'Loginbox',
    emits:['close','loginBtnClick'],
    setup(prop,context){
        const closeClick = ()=>{
            context.emit('close')
        }
        const user = reactive({
            phone:'',
            password:''
        })
        user.phone = localStorage.getItem('phone')||''
        const loginClick = ()=>{
            context.emit('loginBtnClick',user)
        } 
        

        // 设置点击组件外也触发关闭
        const loginbox = ref(null)
        const isClickOutside = useClickOutside(loginbox)
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

        return {
            closeClick,
            loginbox,
            loginClick,
            user
        }
    }
})
</script>
<style lang="less" scoped>
.loginbox-container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 999;
    width: 350px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
    box-shadow:0px 0px 8px #dbdada;
}
.input-box{
    border: 1px solid #d8d8d8;
    height: 40px;
    width: 260px;
    color:#a9a9a9;
    font-size: 20px;
    display: flex;
    align-items: center;
    padding-left: 6px;
    input{
        font-size: 13px;
        height: 100%;
        background-color: transparent;
        border: 0;
        color: black;
        padding-left: 5px;
        &:focus{
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #a9a9a9;
        }
        &::-moz-input-placeholder {
          color: #a9a9a9;
        }
        &::-ms-input-placeholder {
          color: #a9a9a9;
        }
    }
}
.one{
    border-radius: 5px 5px 0 0;
}
.two{
    border-radius: 0 0 5px 5px;
    border-top: 0;
}
.login-btn{
    background-color: #ea4848;
    color: white;
    border: 0;
    width: 260px;
    height: 40px;
    border-radius: 5px;
    letter-spacing: 5px;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
    &:hover{
        background-color: rgb(199, 46, 46);
    }
    &:focus{
        outline: none;
    }
}
.icon{
    position: relative;
    width: 100%;
    height: 100px;
    margin-bottom: 40px;
    i:nth-child(1){
        color: rgb(242, 156, 159);
        font-size: 92px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    i:nth-child(2){
        color: rgb(242, 156, 159);
        font-size: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
.close-btn{
    position: absolute;
    right: 0;
    top: 0;
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;
    color: #a5a5a5;
    &:hover{
        color: rgb(120, 120, 120);
    }
}
</style>