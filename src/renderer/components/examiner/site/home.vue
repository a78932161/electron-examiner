<template>
    <div>
        <div class="top">
            <div class="top-left">
                考官抽签系统
            </div>
        </div>
        <div class="content" >
            <router-view>
            </router-view>
        </div>
    </div>
</template>

<script>
    import '@/common/js/mousetrap.min'

    export default {
        name: "home",
        data(){
            return{

            }
        },
        methods:{
            goSite(){
               this.$router.push('/login');
            }
        },
        created(){
            Mousetrap.bind('alt+5', ()=>{
               this.goSite()
            });

        },
    }
</script>

<style scoped>

    .top {
        background: rgb(0, 152, 254);
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .top-left {
        color: rgb(255, 255, 255);
        font-size: 25px;
        margin: 0 0 0 10px;
    }
    .content{
        width:100%;
        height: 100vh;
        min-height: 768px;
        min-width: 1024px;
        background-image: url(1.png);
        position:absolute;
        background-size:100% 100%;
        opacity:1;
    }


</style>