<template>
    <div>
        <div class="content" :style="{backgroundImage: 'url('+imgDataUrl+')'}">
            <router-view>
            </router-view>
        </div>
    </div>
</template>

<script>
    import '@/common/js/mousetrap.min'
    export default {
        name: "home",
        data() {
            return {
                imgDataUrl: '',
            }
        },
        methods: {
            goSite() {
                this.$router.push('/login');
            },
            getList() {
                this.$db6.find({}, (err, docs) => {
                    if (docs.length > 0) {
                        this.imgDataUrl = docs[0].img;
                    }
                })
            },
        },
        created() {
            Mousetrap.bind('alt+5', () => {
                this.goSite()
            });
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style scoped>



    .top-left {
        color: rgb(255, 255, 255);
        font-size: 25px;
        margin: 0 0 0 10px;
    }

    .content {
        width: 100%;
        height: 100vh;
        min-height: 768px;
        min-width: 1024px;
        position: absolute;
        background-size: 100% 100%;
        opacity: 1;
    }


</style>