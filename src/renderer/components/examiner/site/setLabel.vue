<template>
    <div class="mid3">
        <div class="d1"><label>设置每组考官数:</label><input type="text" v-model="kgAmount"/></div>
        <div class="d2"><label>同单位随机平均分配:</label>
            <input type="radio" value="true" v-model="value"/><span id="r1">是</span>
            <input type="radio" value="false" v-model="value"/><span id="r2">否</span>
        </div>
        <div class="d3">
            <button @click="getKg()">确定</button>
            <button @click="okbq()">设置考官标签</button>
        </div>
    </div>
</template>

<script>


    export default {
        data() {
            return {
                value: true,
                kgAmount: '',
            }
        },
        methods: {
            getKg() {
                if (this.kgAmount) {
                    this.$db4.remove({}, {multi: true}, function (err, numRemoved) {
                    });
                    this.$db4.insert({
                        kgAmount: this.kgAmount,
                        value: this.value,
                    }, (err, newDocs) => {
                    });
                    this.$db4.findOne({}, (err, ret) => {
                        console.log(ret);
                    });
                    alert('设置完成!');
                } else {
                    alert('请输入考官数!');
                }
            },
            okbq() {
                this.$db1.find({}, (err, docs) => {
                    if (docs.length>0) {
                        this.$db.find({}, (err, docs1) => {
                            if (docs1.length>0) {
                                this.$router.push('/rule');
                            } else {
                                alert('请导入考官数据!');
                            }
                        });
                    } else {
                        alert('请导入考点数据!');
                    }
                });
            }
        },
        mounted() {
            this.$db4.findOne({}, (err, ret) => {
                if (ret !== null) {
                    this.kgAmount = ret.kgAmount;
                    this.value = ret.value;
                } else {
                    this.kgAmount = 0;
                    this.value = false;
                }
            });
        }

    }
</script>

<style>
    .mid3 input {
        height: 30px;
        border: 1px solid rgb(130, 155, 233);
    }

    .mid3 button {
        font-size: 18px;
        width: 185px;
        height: 40px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
        letter-spacing: 1px;
    }

    .d1 label {
        margin: 0 20px 0 0;
    }

    .d2 label {
        margin: 0 20px 0 0;
    }

    .d1 input {
        width: 200px;
    }

    .d2 input {
        margin: 10px 20px 0 0;
    }

    .d2 {
        display: flex;
        justify-content: center;
    }

    #r1 {
        margin: 0 65px 0 0;
    }

    .mid3 {
        margin: 0 auto;
        width: 50%;
        font-size: 20px;
    }


</style>