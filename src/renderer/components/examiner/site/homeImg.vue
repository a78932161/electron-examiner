<template>
    <div class="lottery">
        <div class="b2">
            <label v-bind:style="{fontSize: size + 'px'}">{{title}}</label>
        </div>
        <div class="b1">
            <button @click="start()">一键抽取面试室</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home-img",
        data() {
            return {
                title: '',
                size: 60,
            }
        },
        methods: {
            start() {
                this.$db5.find({}, (err, docs) => {
                    if (docs.length>0) {
                         this.$router.push('/transition');
                    } else {
                        alert('抽签失败!请前往后台设置');
                    }
                });
            }
        },
        created() {
            this.$db3.find({}, (err, docs) => {
                if (docs.length>0) {
                    this.title = docs[0].title;
                    this.size = docs[0].size;
                } else {
                    this.title = '这是默认的哦';
                    this.size=60;
                }
            });
        }
    }
</script>

<style scoped>
    .lottery {

    }

    .lottery label {
        height: 100px;
        width: 850px;
        text-align: center;
        letter-spacing: 15px;
    }

    .lottery button {
        font-family: Microsoft YaHei;
        font-size: 35px;
        height: 80px;
        width: 30%;
        box-shadow: -1px 1px 10px #888888;
        border-radius: 5px;
        background: white;
        letter-spacing: 10px;
    }

    .b1 {
        text-align: center;
        margin: 0 0 0 0;
    }

    .b2 {
        text-align: center;
        color: white;
        margin: 8% 0 29% 0;
        width: 100%;
    }

</style>
