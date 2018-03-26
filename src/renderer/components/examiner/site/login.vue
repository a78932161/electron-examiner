<template>
    <div class="login1">
        <div class="top">
            <div class="top-left">
                考官抽签系统
            </div>
        </div>
        <div class="content1">
            <div class="content-left1">
                <nav>
                    <ul>
                        <li><a ><span class="iconfont icon-daoru-tianchong"></span>导入导出</a></li>
                        <li><a ><span class="iconfont icon-iconset0493"></span>抽签设置</a></li>
                        <li><a ><span class="iconfont icon-shezhi"></span>其他设置</a></li>
                    </ul>
                </nav>
            </div>
            <div class="content-mid1">
                <div class="login">
                    <div class="zh">
                        <div></div>
                        <label>账号登录</label>
                    </div>
                    <div class="psw">
                        <label>密码:<input type="password" v-model="psw1" @keyup.enter="okPsw()"/></label>
                    </div>
                    <div class="qr">
                        <button @click="okPsw()" >确定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{
                psw:'',
                psw1:'',
            }
        },
        methods:{
            okPsw(){
                if(this.psw1===this.psw){
                    this.$router.push('/import');
                }else{
                    alert('密码错误!');
                }
            }
        },
        mounted() {
            this.$db2.find({}, (err, Docs) => {
                if(Docs.length>0) {
                    this.psw = Docs[0].password;
                }else{
                    this.psw = '123456';
                }
            });
        },
    }
</script>

<style>
    @import "../../../common/icon/iconfont.css";


    body{
        font-family:Microsoft YaHei;
    }
    .login1 a {
        text-decoration: none;
    }

    .login1 nav {
        height: 100vh;
        background: rgba(229,229,229,0.8);
        border: 1px solid #ECECEC;
    }

    .login1  nav li {
        position: relative;
    }

    .login1 nav li a {
        line-height: 80px;
        display: block;
        color: black;
        background: rgba(229,229,229,0.8);
        text-align: center;
        position: relative;
        font-size: 18px;
        border: 1px solid #ECECEC;
        color: rgba(29,29,29,0.8);
    }

    .login1 nav li a:before {
        content: "";
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        top: 6px;
        left: 31px;
        border-radius: 100%;
    }


    .top {
        background: rgb(0, 152, 254);
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .content1 {
        display: flex;
        background: rgba(229,229,229,1);
    }

    .top-left {
        color: rgb(255, 255, 255);
        font-size: 25px;
        margin: 0 0 0 10px;
    }
    .content-left1{
        width: 25%;

    }
    .content-mid1{
        width: 75%;
        text-align: center;

    }
    .login{
        margin: 10% auto;
        width: 60%;
        height: 350px;
        border: 1px solid rgb(229,229,229);
        border-radius:15px;
        display: flex;
        flex-direction:column;
        justify-content:center;
        font-size: 25px;
        background: white;
    }
    .zh{
        letter-spacing:2px;

    }
    .zh div{
        margin: -20px 0  30px 0;
        display: flex;
        justify-content: center;
    }
    .psw{
        display: flex;
        flex-direction:column;
        justify-content:center;
        border-top: 1px solid rgb(215,215,215);
        border-bottom: 1px solid rgb(215,215,215);
        height: 130px;
        margin: 20px 30px 20px 30px;
        line-height: 30px;

    }
    .psw input{
        margin: 0 0 0 10px ;
        border: 1px solid rgb(215,215,215);
        height: 40px;
        width: 60%;
        border-radius:5px;
    }
    .qr{
        margin: 10px 30px 0 0;
        text-align: right;
    }
    .qr button{
        width: 80px;
        height: 40px;
        border: 1px solid rgb(215,215,215);
        border-radius:5px;
        background: rgb(248,248,248);
        font-size: 18px;
    }
    .content-left1 span{
        margin: 0 10% 0 0;
        font-size: 30px;
    }
    .zh span{
        font-size: 30px;
    }


</style>