<template>
    <div class="mid5">
        <div>
            <label style="margin: 0 20px 50px 0">修改文本框内容:</label>
            <input type="text" v-model="title"/>
        </div>
        <div>
            <label style="margin: 0 20px 50px 0">修改内容的字体:</label>
            <input style="margin: 20px 0 0 0" type="number" v-model="size"/>
        </div>
        <div class="psw5">
            <button @click="okTitle()">确认</button>
            <router-link :to="{ path: '/other'}">
                <button class="b2">取消</button>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "up-title",
        data() {
            return {
                title: '',
                size: 30,
            }
        },
        methods: {
            okTitle() {
                if (this.title) {
                    this.$db3.remove({}, {multi: true}, function (err, numRemoved) {
                    });
                    this.$db3.insert({title: this.title, size: this.size}, (err, Docs) => {

                    });
                    this.$router.push('/upOk');
                } else {
                    alert('请输入标题!');
                }

            }
        },
        mounted() {
            this.$db3.find({}, (err, Docs) => {
                if (Docs.length >0) {
                    this.title = Docs[0].title;
                    this.size = Docs[0].size;
                } else {
                    this.title = '这是默认的哦'
                }
            });
        },
    }
</script>

<style scoped>
    .mid5 {
        font-size: 18px;
    }

    .mid5 input {
        width: 300px;
        height: 50px;
        border: 1px solid rgb(130, 155, 233);
        border-radius: 5px;
        font-size: 20px;
    }

    .mid5 button {
        font-size: 18px;
        height: 40px;
        width: 100px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
        letter-spacing: 1px;
    }

    .psw5 {
        margin: 30px 0 0 170px;

    }

</style>