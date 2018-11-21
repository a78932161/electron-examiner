<template>
    <div class="items">
        <scrol :items="qaq" :speed="this.ssd"></scrol>
        <scrol :items="qaq1" :speed="this.ssd"></scrol>
    </div>
</template>

<script>
    import scrol from '@/base/scrolling'

    export default {
        name: "transition",
        components: {
            scrol
        },
        data() {
            return {
                qaq: [],
                qaq1: [],
                kgAmount: '',
                ssd: 0,
            }
        },
        methods: {
            getList() {
                this.$db4.findOne({}, (err, ret) => {
                    if (ret.kgAmount) {
                        this.kgAmount = ret.kgAmount;
                    }
                });
                this.$db1.find({}, (err, docs) => {
                    if (docs) {
                        docs.forEach((value) => {
                            for (let i = 1; i <= value['考场数']; i++) {
                                for (let j = 1; j <= this.kgAmount; j++) {
                                    this.qaq.push(value['考点名称'] + i + '组');
                                    this.ssd = parseInt(30 / (this.qaq.length) * 1000);
                                }
                            }
                        });
                        console.log(this.ssd);
                    }
                });
                this.$db.find({}, (err, docs) => {
                    if (docs) {
                        docs.forEach((value) => {
                            this.qaq1.push(value['姓名']);
                        })
                    }
                });
            }
        },
        mounted() {
            let then = this;
            setTimeout(function () {
                then.$router.push('/homeEnd')
            }, 30000);
        },
        created() {
            this.getList();
        }
    }
</script>

<style>
    .items {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 15% auto;
    }
</style>