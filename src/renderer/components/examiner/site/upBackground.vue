<template>
    <div>
        <div class="upBg">
            <label>新背景:</label><img src="">
        </div>
        <div class="psw6">
            <button>上传图片</button>
            <button>完成</button>
            <router-link :to="{ path: '/other'}"><button class="b2">返回</button></router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "up-background"
    }
</script>

<style scoped>
    .upBg {
        display: flex;
        justify-content: center;
    }

    .upBg img {
        width: 500px;
        height: 300px;
    }

    .upBg label {
        margin: 0 20px 0 0;
        font-size: 18px;
    }
    .psw6{
        margin: 50px 0 0 100px;
    }
    .psw6 button{
        font-size: 18px;
        height: 40px;
        width: 100px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
        letter-spacing: 1px;
    }
</style>