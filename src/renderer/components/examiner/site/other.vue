<template>
    <div class="mid4">
        <router-link :to="{ path: '/upPsw'}">
            <button>修改密码</button>
        </router-link>
        <router-link :to="{ path: '/upTitle'}">
            <button>修改标题</button>
        </router-link>
        <router-link :to="{ path: '/upBackground'}">
            <button>修改背景</button>
        </router-link>
        <router-link :to="{ path: '/homeImg'}">
            <button>退出</button>
        </router-link>

    </div>
</template>

<script>
    export default {
        name: "other"
    }
</script>

<style scoped>
    .mid4 {
        margin: 5% auto;

    }

    .mid4 button {
        font-size: 20px;
        height: 55px;
        width: 150px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
        letter-spacing: 1px;
        margin: 0 20px 0 0;

    }

</style>