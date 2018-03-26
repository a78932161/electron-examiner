<template>
    <div class="psw0">
        <div class="psw01"><label>原密码 :</label><input type="password" v-model="oldPsw"/></div>
        <div class="psw01"><label>新密码 :</label><input type="password" v-model="newPsw"/></div>
        <div class="psw02"><label>再次确认 :</label><input type="password" v-model="newPsw1"/></div>
        <div class="psw03">
            <button class="b1" @click="okPsw()">确认</button>
            <router-link :to="{ path: '/other'}">
                <button class="b2">返回</button>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "up-psw",
        data() {
            return {
                oldPsw: '',
                newPsw: '',
                newPsw1: '',
                Psw: '',
            }
        },
        methods: {
            okPsw() {

                if (this.Psw == this.oldPsw) {
                    if (this.newPsw == this.newPsw1) {
                        this.$db2.remove({}, {multi: true}, function (err, numRemoved) {
                        });
                        this.$db2.insert({password: this.newPsw}, (err, Docs) => {
                        });
                        this.$router.push('/upOk');
                    } else {
                        alert('两次密码不一样!');
                    }
                } else {
                    alert('原密码不一样!');
                }
            }
        },
        mounted() {
            this.$db2.find({}, (err, Docs) => {
                if(Docs.length>0){
                    this.Psw=Docs[0].password;
                }else{
                    this.Psw='123456';
                }

            });
        }
    }
</script>

<style scoped>
    .psw01 label {
        margin: 0 20px 0 0;
    }

    .psw02 label {
        margin: 0 20px 0 0;
    }

    .psw02 input {
        margin: 0 17px 0 0;
    }

    .psw0 input {
        width: 300px;
        height: 30px;
        border: 1px solid rgb(130, 155, 233);
        border-radius: 5px;
    }

    .psw0 button {
        font-size: 18px;
        height: 40px;
        width: 100px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
        letter-spacing: 1px;
    }

    .psw0 label {
        font-size: 18px;
    }

    .psw02 {
        margin: 0 0 20px 0;
    }

    .psw03 {
        margin: 0 0 0 170px;
    }

    .b1 {
        margin: 0 10px 0 0;
    }
</style>