<template>
    <div>
        <div class="top2">
            <div class="top-left2">
                考官抽签系统
            </div>
        </div>
        <div class="content2">
            <div class="content-left2">
                <div>
                    <div class="dr1">
                        <label></label>
                        <allot @on-selected-file='scData'></allot>
                    </div>
                    <p><label style="margin: 0 100px 0 0">面试点:</label>
                        <select v-model="selected" @change="geta2()">
                            <option v-for="item in a1" :value="item.value">{{item.txt}}</option>
                        </select>
                    </p>
                    <p><label style="margin: 0 100px 0 0">面试室:</label>
                        <select v-model="selected1">
                            <option v-for="item in a2" :value="item.value">{{item.txt}}</option>
                        </select>
                    </p>
                    <p><label>考官标签:</label>
                        <select v-model="selected2" @change="geta4()">
                            <option v-for="item in a3" :value="item">{{item}}</option>
                        </select>
                    </p>
                    <p><label>考官人数:</label>
                        <select v-model="selected3">
                            <option v-for="item in a4" :value="item.value">{{item.txt}}</option>
                        </select>
                    </p>
                </div>
                <div style="margin: 20px 0 0 0; ">
                    <button style="margin: 0 80px 0 0;color: black" @click="addData()">添加</button>
                    <button style="margin: 0 80px 0 0;color: black" @click="wcData">完成设置</button>
                    <button style="color:black" @click="goindex">返回</button>
                </div>
            </div>
            <div class="content-right2">
                <div class="content-div2">
                    <p v-for="item in tbData">考点:{{item.考点}} 考场号:{{item.考场号}} 考官标签:{{item.考官标签}}
                        考官人数:{{item.考官人数}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import allot from '@/base/UploadExcel/allot';

    import '@/common/js/underscore';
    import '@/common/js/calculate'

    export default {
        name: "rule",
        data() {
            return {
                a1: [],
                a2: [],
                a3: [],
                a4: [],
                exr: [],
                selected: '',
                selected1: '',
                selected2: '',
                selected3: '',
                regions: [],
                tagrules: [],
                kaoguans: [],
                itemcount: 0,
                tbData: [],
                endData: [],
                itemok: '',

            }
        },
        components: {
            allot,

        },
        methods: {
            getList() {
                this.$db.find({}, (err, docs) => {
                    if (docs.length > 0) {
                        this.$db1.find({}, (err, docs) => {
                            docs.forEach((value) => {
                                this.a1.push({txt: value['考点名称'], value: value['考点名称']});
                                this.regions.push([value['考点代码'], value['考点名称'], value['考场数'], value['起始序号']]);
                            });
                            //this.regions = JSON.stringify(this.regions);
                        });
                        this.$db.find({}, (err, docs) => {
                            docs.forEach((value) => {
                                if (this.a3.indexOf(value['考官类别']) === -1 && value['考官类别'] != null && value['考官类别'] !== '主考官' && value['考官类别'] !== '考官') {
                                    this.a3.push(value['考官类别']);
                                }
                                this.kaoguans.push(value);
                            })
                        });
                        this.$db4.findOne({}, (err, ret) => {
                            if (ret !== null) {
                                this.itemcount = ret.kgAmount;
                                this.itemok = (ret.value == 'true');
                                console.log(this.itemok);
                            } else {
                                alert('没有设置数量!');
                            }
                        });
                    } else {
                        alert('没有导入数据');
                    }
                })

            },
            geta2() {
                if (this.selected !== '') {
                    this.a2 = [];
                    this.$db1.find({'考点名称': this.selected}, (err, docs) => {
                        for (let i = 1; i <= docs[0]['考场数']; i++) {
                            this.a2.push({txt: i, value: i});
                        }
                    });
                }
            },
            geta4() {
                if (this.selected2 !== '') {
                    this.a4 = [];
                    this.$db.find({'考官类别': this.selected2}, (err, docs) => {
                        for (let i = 1; i <= docs.length; i++) {
                            this.a4.push({txt: i, value: i});
                        }
                    });
                }
            },
            addData() {
                if (this.selected && this.selected1 && this.selected2 && this.selected3) {
                    this.tbData.push({
                        考点: this.selected,
                        考场号: this.selected1,
                        考官标签: this.selected2,
                        考官人数: this.selected3
                    });
                }
            },
            scData(data) {
                let a = data.results;
                a.forEach((value) => {
                    this.tagrules.push([value['考点'], value['考场号'], value['考官人数'], value['考官标签']]);
                    this.tbData.push(value);
                });

                alert('导入成功!');
            },
            wcData() {
                if (this.regions && this.tagrules && this.kaoguans && this.itemcount) {
                    try {
                        this.endData = calculateprintablesiteinfos(this.itemcount, this.regions, this.tagrules, this.kaoguans, this.itemok);
                        //在这里运行代码
                        this.endData.sort(function (a, b) {
                            if (a.number === b.number) {
                                return b.index - a.index;
                            } else {
                                return a.number - b.number;
                            }
                        });
                        this.endData.reverse();
                        this.endData.forEach((value) => {
                            for (let a = 0; a < value.kgs.length; a++) {
                                value.kgs[a]['职务'] = value.name + '第' + value.index + '组';
                            }
                        });
                        this.$db5.remove({}, {multi: true}, function (err, numRemoved) {
                        });
                        this.$db5.insert(this.endData, function (err, newDocs) {

                        });
                        console.log(this.endData);
                        this.$router.push('/setLabel');
                        alert("抽签成功!");
                    }
                    catch (err) {
                        console.log(err);
                        alert(JSON.parse(err.message).msg);
                        //在这里处理错误
                    }
                }
            },
            goindex(){
                this.$router.push('/setLabel')
            }
        },
        mounted() {
            this.getList();

        }
    }
</script>

<style scoped>
    .top2 {
        background: rgb(0, 152, 254);
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .top-left2 {
        color: rgb(255, 255, 255);
        font-size: 25px;
        margin: 0 0 0 10px;
    }

    .content-left2 label {
        margin: 0 80px 0 0;
    }

    .content-left2 select {
        width: 150px;
        height: 30px;
        border: 1px solid rgb(0, 152, 254);
        border-radius: 5px;
        padding-left: 10px;
        font-size: 15px;
    }

    .content-left2 button {
        background-color: rgba(248, 248, 248, 0.9);
        border-radius: 5px;
        padding: 10px 30px 10px 30px;
        border: 2px solid rgb(241, 241, 241);
        font-size: 18px;
        color: rgb(141, 141, 141);
        cursor: pointer;
    }

    .content2 {
        display: flex;
        justify-content: space-between;
        margin: 5% 0 0 0;
    }

    .content-left2 {
        text-align: center;
        width: 50%;
        line-height: 50px;
        margin: 0 0 0 20px;
        font-size: 20px;

    }

    .content-right2 {
        width: 50%;
    }

    .content-div2 {
        text-align: center;
        border: 1px solid rgb(0, 152, 254);
        width: 95%;
        height: 400px;
        overflow: auto;
        line-height: 25px;
        letter-spacing: 3px;
    }

    .content-div2::-webkit-scrollbar { /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 5px;
    }

    .content-div2::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
        height: 5px;
    }

    .dr1 {
        margin: 0 0 30px 0;
    }

    .dr1 label {
        margin: 0 150px 0 0;
    }

    .dr1 button {
        font-size: 18px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
        letter-spacing: 1px;
    }
</style>