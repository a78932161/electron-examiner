<template>
    <div>
        <div class="top-1">
            <div class="top-left-1">
                考官抽签系统
            </div>
        </div>
        <div class="content-1">
            <div class="content-left-1">
                <nav>
                    <ul>
                        <li><router-link :to="{ path: '/import'}"><span class="iconfont icon-daoru-tianchong"></span>导入导出</router-link></li>
                        <li><router-link :to="{ path: '/setLabel'}"><span class="iconfont icon-iconset0493"></span>抽签设置</router-link></li>
                        <li><router-link :to="{ path: '/other' }"><span class="iconfont icon-shezhi"></span>其他设置</router-link></li>
                    </ul>
                </nav>
            </div>
            <div class="content-mid-1">
                <router-view>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style>
    @import "../../../common/icon/iconfont.css";
    body {
        font-family: Microsoft YaHei;
    }

    button {
        cursor: pointer;
        font-family: Microsoft YaHei;
    }

    a {
        text-decoration: none;
    }

    nav {
        height: 100vh;
        background: rgb(243,248,253);
        border: 1px solid #ECECEC;
    }

    nav li {
        position: relative;
    }

    nav li a {
        line-height: 80px;
        display: block;
        color: black;
        background: rgb(243,248,253);
        text-align: center;
        position: relative;
        font-size: 18px;
        border: 1px solid #ECECEC;
    }

    nav li a:before {
        content: "";
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        top: 6px;
        left: 31px;
        border-radius: 100%;
    }

    nav li a:hover {
        background: rgb(214,224,248);
        border-right-color: rgb(214,224,248);
    }
    .router-link-active {
        background: rgb(214,224,248);
        color: white;
    }


    .top-1 {
        background: rgb(0, 152, 254);
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .top-left-1 {
        color: rgb(255, 255, 255);
        font-size: 25px;
        margin: 0 0 0 10px;
    }
    .content-1{
        display: flex;
    }
    .content-left-1{
        width: 25%;

    }

    .content-mid-1{
        width: 75%;
        text-align: center;
        line-height: 50px;
        margin: 10% auto;
    }

    .content-1 span{
        margin: 0 10% 0 0;
        font-size: 30px;
    }
</style>