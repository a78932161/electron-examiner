<template>
        <div class="login1">
            <div class="zh1">
                <label>修改成功</label>
            </div>
            <div class="psw11">
                <label>本次修改已完成</label>
            </div>
            <div class="qr1">
                <router-link :to="{ path: '/other'}"><button >确认</button></router-link>
            </div>
        </div>
</template>

<script>
    export default {
        name: "up-ok",
        data(){
            return{

            }
        },

    }
</script>

<style scoped>

    .login1{
        margin: 0 auto;
        width: 60%;
        height: 350px;
        border: 1px solid rgb(229,229,229);
        border-radius:15px;
        font-size: 20px;
    }
    .zh1{
        letter-spacing:2px;
    }
    .zh1 div{
        margin: -20px 0 50px 0;
    }
    .psw11{
        display: flex;
        flex-direction:column;
        justify-content:center;
        border-top: 1px solid rgb(215,215,215);
        border-bottom: 1px solid rgb(215,215,215);
        height: 130px;
        margin: 10px 30px 10px 30px;

    }
    .psw11 input{
        margin: 0 0 0 10px ;
        border: 1px solid rgb(215,215,215);
        height: 40px;
        width: 60%;
        border-radius:5px;
    }
    .qr1{
        margin: 10px 30px 0 0;
        text-align: right;
    }
    .qr1 button{
        width: 80px;
        height: 40px;
        border: 1px solid rgb(215,215,215);
        border-radius:5px;
        font-size: 18px;
    }
</style>