<template>
    <div style="min-width: 1000px">
        <div class="top">
            <div class="top-left">
                考官抽签
            </div>

            <div class="top-right">
                <invigilator style="display: inline-block" @on-selected-file='selected'></invigilator>
                <addres style="display: inline-block;margin: 0 0 0 20px" @on-selected-file='selected1'></addres>
                <a style="margin: 0 0 0 20px" href="#" @click="handleDownload">导出excel</a>
            </div>
        </div>
        <div class="content">
            <div class="content-left">
                <div>
                    <p><label style="margin: 0 140px 0 -50px">设置每组考官数:</label><input type="text" v-model="kgAmount"
                                                                                     style="border: 1px solid rgb(109,138,230);width: 100px;height: 30px"/>
                    </p>
                    <p><label style="margin: 0 120px 0 0">平均分配女考官:</label><input type="radio" value="true"
                                                                                 v-model="radio1"/>是
                        <input style="margin: 0 0 0 100px" type="radio" value="false" v-model="radio1"/>否</p>
                    <p><label>回避户籍和曾工作地:</label><input type="radio" value="true" v-model="radio2"/>是
                        <input style="margin: 0 0 0 100px" type="radio" value="false" v-model="radio2"/>否</p>
                    <p><label>同单位随机平均分配:</label><input type="radio" value="true" v-model="radio3"/>是
                        <input style="margin: 0 0 0 100px" type="radio" value="false" v-model="radio3"/>否</p>
                </div>
                <div style="margin: 20px 0 0 0; ">
                    <router-link :to="{ path: '/rule'}">
                        <button style="margin: 0 80px 0 0;color: black">设置考官标签</button>
                    </router-link>
                    <button style="color:black" @click="lot()">抽取面试教室</button>
                </div>
            </div>

            <div class="content-right">
                <div class="content-div">
                    <p>姓名:玲玲一 面试室为:1100 考官标签:公安考官</p>
                    <p>姓名:玲玲一 面试室为:1100 考官标签:公安考官</p>
                </div>
            </div>
        </div>
        <!--<ul style="display: inline-block">-->
        <!--<li style="list-style: none" v-for="item in group.Arr">-->
        <!--<input type="radio" name="group" :value="item" v-model="group.val"/> {{item}}-->
        <!--</li>-->
        <!--</ul>-->

    </div>

</template>

<script>
    let keyName = '工作地';
    let keyOccName = '岗位标识';

    import {shuffle} from '@/common/js/util';
    import addres from '@/base/UploadExcel/address';
    import invigilator from '@/base/UploadExcel/invigilator';

    export default {
        data() {
            return {
                radio1: true,
                radio2: true,
                radio3: true,
                group: {
                    Arr: [],
                    val: '',
                    currentData: []
                },
                census: [],
                workPlace: [],
                arr: [],//考官原始数据
                arrAds: '',//地点原始数据
                arrAddress: [],
                kgAmount: 7,
                mmp: [],

            }
        },
        components: {
            addres,
            invigilator
        },
        methods: {

            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['姓名', '职务'];
                    const filterVal = ['姓名', '职务'];
                    /* const list = this.list*/
                    const data = this.formatJson(filterVal, this.mmp);
                    export_json_to_excel(tHeader, data, '列表excel');

                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            selected(data) {
                this.$db.find({}, (err, docs) => {
                    this.arr = docs;
                });

            },
            selected1(data) {

                let a = data.results;
                a.forEach((value) => {
                    if (this.arrAddress.indexOf(value['考点名称']) === -1 && value['考点名称'] != null) {
                        this.arrAddress.push(value['考点名称']);
                    }
                });
                this.arrAds = a;
                console.log(this.arrAds);

            },
            lot() {
                Array.prototype.shuffle = function () {
                    let input = this;
                    for (let i = input.length - 1; i >= 0; i--) {
                        let randomIndex = Math.floor(Math.random() * (i + 1));
                        let itemAtIndex = input[randomIndex];
                        input[randomIndex] = input[i];
                        input[i] = itemAtIndex;
                    }
                    return input;
                };//洗牌排序法
                Array.prototype.remove = function (val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };//移除数组指定元素

                if (this.arr) {
                    let a = [];//主考官
                    let aa = '';//主考官的选择区域
                    let b = [];//考官
                    let bb = '';//考官的选择区域;
                    let c = 0;//考点数
                    let e = 0;//女考官人数
                    let f = 0;//所有人数量
                    let d1 = '';//市本级次数
                    let d2 = '';//四区
                    let d3 = '';//乐清
                    let d4 = '';//瑞安
                    let d5 = '';//永嘉
                    let d6 = '';//苍南
                    let d7 = '';//平阳
                    let d8 = '';//文成
                    let d9 = '';//泰顺次数

                    let e1 = [];//市本级分配数组
                    let e2 = [];//四区
                    let e3 = [];//乐清
                    let e4 = [];//瑞安
                    let e5 = [];//永嘉
                    let e6 = [];//苍南
                    let e7 = [];//平阳
                    let e8 = [];//文成
                    let e9 = [];//泰顺
                    this.arr.forEach((value) => {
                        if (value['考官类别'] === '主考官') {
                            value['职务'] = value['籍贯'] + ',' + value['工作地'];
                            a.push(value);
                        } else {
                            value['职务'] = value['籍贯'] + ',' + value['工作地'];
                            b.push(value);
                        }
                    });
                    a.shuffle();
                    b.shuffle();
                    b.forEach((value) => {
                        let b = this.arrAddress.join();
                        let a = (value['职务']).split(',');

                        if (this.arrAddress.indexOf(a[0]) > -1) {
                            if (a[0] === '市本级') {
                            } else {
                                if (value['籍贯'] === this.arrAddress[this.arrAddress.length - 1]) {
                                    bb = b.replace(',' + value['籍贯'], '');
                                } else {
                                    bb = b.replace(value['籍贯'] + ',', '');
                                }
                            }
                        }
                        if (this.arrAddress.indexOf(a[1]) > -1) {
                            if (a[1] === '市本级') {
                            } else {
                                if (value['工作地'] === this.arrAddress[this.arrAddress.length - 1]) {
                                    bb = bb.replace(',' + value['工作地'], '');
                                } else {
                                    bb = bb.replace(value['工作地'] + ',', '');
                                }
                            }
                        }

                        value['职务'] = bb;
                        if (value['性别'] === '女') {
                            e = e + 1;
                        }
                    });//完成考官的分配区间
                    a.forEach((value) => {
                        let b = this.arrAddress.join();
                        let c = (value['职务']).split(',');

                        if (this.arrAddress.indexOf(c[0]) > -1) {
                            if (c[0] === '市本级') {

                            } else {
                                aa = b.replace(value['籍贯'] + ',', '');
                            }
                        }
                        if (this.arrAddress.indexOf(c[1]) > -1) {
                            if (c[1] === '市本级') {

                            } else {
                                aa = aa.replace(value['工作地'] + ',', '');

                            }
                        }
                        value['职务'] = aa;
                    });//完成主考官的分配区间
                    this.arrAds.forEach((value) => {
                        value['起始序号'] = this.kgAmount * (value['考场数']);
                        c = c + parseInt(value['考场数']);
                        switch (value['考点名称']) {
                            case '市本级':
                                d1 = (value['起始序号']);
                                break;
                            case '四区':
                                d2 = (value['起始序号']);
                                break;
                            case '乐清':
                                d3 = (value['起始序号']);
                                break;
                            case '瑞安':
                                d4 = (value['起始序号']);
                                break;
                            case '永嘉':
                                d5 = (value['起始序号']);
                                break;
                            case '苍南':
                                d6 = (value['起始序号']);
                                break;
                            case '平阳':
                                d7 = (value['起始序号']);
                                break;
                            case '文成':
                                d8 = (value['起始序号']);
                                break;
                            case '泰顺':
                                d9 = (value['起始序号']);
                                break;
                        }
                    });//分配场次数
                    let dd1 = d1;
                    let dd2 = d2;
                    let dd3 = d3;
                    let dd4 = d4;
                    let dd5 = d5;
                    let dd6 = d6;
                    let dd7 = d7;
                    let dd8 = d8;
                    let dd9 = d9;

                    function z(x, values, amount, sex) {
                        switch (x) {
                            case '市本级':
                                if (dd1 > 0 && e1.length < d1 - (d1 / amount)) {
                                    if (sex) {
                                        if (e1.length >= (d1 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e1.push(values);
                                            dd1 = dd1 - 1;
                                            return 1;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e1.push(values);
                                        dd1 = dd1 - 1;
                                        return 1;
                                    }
                                } else {
                                    z();
                                }
                                break;
                            case '四区':
                                if (dd2 > 0 && e2.length < d2 - (d2 / amount)-2) {
                                    if (sex) {
                                        if (e2.length >= (d2 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e2.push(values);
                                            dd2 = dd2 - 1;
                                            return 2;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e2.push(values);
                                        dd2 = dd2 - 1;
                                        return 2;
                                    }
                                } else {
                                    z();
                                }

                                break;
                            case '乐清':
                                if (dd3 > 0 && e3.length < d3 - (d3 / amount)) {
                                    if (sex) {
                                        if (e3.length >= (d3 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e3.push(values);
                                            dd3 = dd3 - 1;
                                            return 3;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e3.push(values);
                                        dd3 = dd3 - 1;
                                        return 3;
                                    }
                                } else {
                                    z();
                                }

                                break;
                            case '瑞安':
                                if (dd4 > 0 && e4.length < d4 - (d4 / amount)) {
                                    if (sex) {
                                        if (e4.length >= (d4 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e4.push(values);
                                            dd4 = dd4 - 1;
                                            return 4;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e4.push(values);
                                        dd4 = dd4 - 1;
                                        return 4;
                                    }
                                } else {
                                    z();
                                }
                                break;
                            case '永嘉':
                                if (dd5 > 0 && e5.length < d5 - (d5 / amount)) {
                                    if (sex) {
                                        if (e5.length >= (d5 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e5.push(values);
                                            dd5 = dd5 - 1;
                                            return 5;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e5.push(values);
                                        dd5 = dd5 - 1;
                                        return 5;
                                    }
                                } else {
                                    z();
                                }
                                break;
                            case '苍南':
                                if (dd6 > 0 && e6.length < d6 - (d6 / amount)) {
                                    if (sex) {
                                        if (e6.length >= (d6 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e6.push(values);
                                            dd6 = dd6 - 1;
                                            return 6;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e6.push(values);
                                        dd6 = dd6 - 1;
                                        return 6;
                                    }
                                } else {
                                    z();
                                }
                                break;
                            case '平阳':
                                if (dd7 > 0 && e7.length < d7 - (d7 / amount)) {
                                    if (sex) {
                                        if (e7.length >= (d7 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e7.push(values);
                                            dd7 = dd7 - 1;
                                            return 7;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e7.push(values);
                                        dd7 = dd7 - 1;
                                        return 7;
                                    }
                                } else {
                                    z();
                                }
                                break;
                            case '文成':
                                if (dd8 > 0 && e8.length < d8 - (d8 / amount)-2) {
                                    if (sex) {
                                        if (e8.length >= (d8 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e8.push(values);
                                            dd8 = dd8 - 1;
                                            return 8;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e8.push(values);
                                        dd8 = dd8 - 1;
                                        return 8;
                                    }
                                } else {
                                    z();
                                }
                                break;
                            case '泰顺':
                                if (dd9 > 0 && e9.length < d9 - (d9 / amount)) {
                                    if (sex) {
                                        if (e9.length >= (d9 / amount * sex) + 3) {
                                            z();
                                        } else {
                                            values['职务'] = x;
                                            e9.push(values);
                                            dd9 = dd9 - 1;
                                            return 9;
                                        }
                                    } else {
                                        values['职务'] = x;
                                        e9.push(values);
                                        dd9 = dd9 - 1;
                                        return 9;
                                    }
                                } else {
                                    z();
                                }
                                break;
                        }
                    }//考官核心算法
                    function zz(x, values) {
                        switch (x) {
                            case '市本级':
                                if (dd1 > 0 && e1.length < d1) {
                                    values['职务'] = x;
                                    e1.push(values);
                                    dd1 = dd1 - 1;
                                    return 1;
                                } else {
                                    z();
                                }
                                break;
                            case '四区':
                                if (dd2 > 0 && e2.length < d2) {
                                    values['职务'] = x;
                                    e2.push(values);
                                    dd2 = dd2 - 1;
                                    return 2;
                                } else {
                                    z();
                                }

                                break;
                            case '乐清':
                                if (dd3 > 0 && e3.length < d3) {
                                    values['职务'] = x;
                                    e3.push(values);
                                    dd3 = dd3 - 1;
                                    return 3;
                                } else {
                                    z();
                                }
                                break;
                            case '瑞安':
                                if (dd4 > 0 && e4.length < d4) {
                                    values['职务'] = x;
                                    e4.push(values);
                                    dd4 = dd4 - 1;
                                    return 4;
                                } else {
                                    z();
                                }
                                break;
                            case '永嘉':
                                if (dd5 > 0 && e5.length < d5) {
                                    values['职务'] = x;
                                    e5.push(values);
                                    dd5 = dd5 - 1;
                                    return 5;
                                } else {
                                    z();
                                }
                                break;
                            case '苍南':
                                if (dd6 > 0 && e6.length < d6) {
                                    values['职务'] = x;
                                    e6.push(values);
                                    dd6 = dd6 - 1;
                                    return 6;
                                } else {
                                    z();
                                }
                                break;
                            case '平阳':
                                if (dd7 > 0 && e7.length < d7) {

                                    values['职务'] = x;
                                    e7.push(values);
                                    dd7 = dd7 - 1;
                                    return 7;

                                } else {
                                    z();
                                }
                                break;
                            case '文成':
                                if (dd8 > 0 && e8.length < d8) {
                                    values['职务'] = x;
                                    e8.push(values);
                                    dd8 = dd8 - 1;
                                    return 8;
                                } else {
                                    z();
                                }
                                break;
                            case '泰顺':
                                if (dd9 > 0 && e9.length < d9) {
                                    values['职务'] = x;
                                    e9.push(values);
                                    dd9 = dd9 - 1;
                                    return 9;
                                } else {
                                    z();
                                }
                                break;
                        }
                    }//主考官核心算法
                    let dd = parseInt(e / c);
                    f = (d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8 + d9);
                    b.forEach((values) => {
                        if (values['性别'] === '女') {
                            let a = values['职务'].split(',');
                            a.reverse();
                            for (let i = 0; i <= a.length; i++) {
                                let j = z(a[i], values, this.kgAmount, dd);
                                if (j == 1 || j == 2 || j == 3 || j == 4 || j == 5 || j == 6 || j == 7 || j == 8 || j == 9) {
                                    break;
                                } else {
                                    z(a[i], values, this.kgAmount, dd);

                                }
                            }
                        }
                    });//分配考官女
                    b.forEach((values) => {
                        {
                            if (values['性别'] === '男') {
                                let aa = values['职务'].split(',');
                                aa.reverse();
                                for (let i = 0; i <= aa.length; i++) {
                                    let j = z(aa[i], values, this.kgAmount);
                                    if (j == 1 || j == 2 || j == 3 || j == 4 || j == 5 || j == 6 || j == 7 || j == 8 || j == 9) {
                                        break;
                                    } else {
                                        z(aa[i], values, this.kgAmount);
                                    }
                                }
                            }
                        }
                    });//分配考官男
                    a.forEach((values) => {
                        let aa = values['职务'].split(',');
                        aa.reverse();
                        for (let i = 0; i <= aa.length; i++) {
                            let j = zz(aa[i], values);
                            if (j == 1 || j == 2 || j == 3 || j == 4 || j == 5 || j == 6 || j == 7 || j == 8 || j == 9) {
                                break;
                            } else {
                                zz(aa[i], values);
                            }
                        }
                    });//分配主考官

                    if(e1.length + e2.length + e3.length + e4.length + e5.length + e6.length + e7.length + e8.length + e9.length!==f-4){
                        this.lot();
                    }else{

                        // {
                        //     let e1a = 0;
                        //     let e1aa = 0;
                        //     for (let i = this.kgAmount; i <= d1; i = i + this.kgAmount) {
                        //         e1a = e1a + 1;
                        //         for (let j = 1; j <= i / e1a; j++) {
                        //             e1[e1aa]['职务'] = e1[e1aa]['职务'] + '第' + e1a + '组';
                        //             e1aa = e1aa + 1;
                        //         }
                        //     }
                        //
                        //     let e2a = 0;
                        //     let e2aa = 0;
                        //     for (let i = this.kgAmount; i <= d2; i = i + this.kgAmount) {
                        //         e2a = e2a + 1;
                        //         for (let j = 1; j <= i / e2a; j++) {
                        //             e2[e2aa]['职务'] = e2[e2aa]['职务'] + '第' + e2a + '组';
                        //             e2aa = e2aa + 1;
                        //         }
                        //     }
                        //
                        //     let e3a = 0;
                        //     let e3aa = 0;
                        //     for (let i = this.kgAmount; i <= d3; i = i + this.kgAmount) {
                        //         e3a = e3a + 1;
                        //         for (let j = 1; j <= i / e3a; j++) {
                        //             e3[e3aa]['职务'] = e3[e3aa]['职务'] + '第' + e3a + '组';
                        //             e3aa = e3aa + 1;
                        //         }
                        //     }
                        //
                        //     let e4a = 0;
                        //     let e4aa = 0;
                        //     for (let i = this.kgAmount; i <= d4; i = i + this.kgAmount) {
                        //         e4a = e4a + 1;
                        //         for (let j = 1; j <= i / e4a; j++) {
                        //             e4[e4aa]['职务'] = e4[e4aa]['职务'] + '第' + e4a + '组';
                        //             e4aa = e4aa + 1;
                        //         }
                        //     }
                        //
                        //     let e5a = 0;
                        //     let e5aa = 0;
                        //     for (let i = this.kgAmount; i <= d5; i = i + this.kgAmount) {
                        //         e5a = e5a + 1;
                        //         for (let j = 1; j <= i / e5a; j++) {
                        //             e5[e5aa]['职务'] = e5[e5aa]['职务'] + '第' + e5a + '组';
                        //             e5aa = e5aa + 1;
                        //         }
                        //     }
                        //
                        //     let e6a = 0;
                        //     let e6aa = 0;
                        //     for (let i = this.kgAmount; i <= d6; i = i + this.kgAmount) {
                        //         e6a = e6a + 1;
                        //         for (let j = 1; j <= i / e6a; j++) {
                        //             e6[e6aa]['职务'] = e6[e6aa]['职务'] + '第' + e6a + '组';
                        //             e6aa = e6aa + 1;
                        //         }
                        //     }
                        //
                        //     let e7a = 0;
                        //     let e7aa = 0;
                        //     for (let i = this.kgAmount; i <= d7; i = i + this.kgAmount) {
                        //         e7a = e7a + 1;
                        //         for (let j = 1; j <= i / e7a; j++) {
                        //             e7[e7aa]['职务'] = e7[e7aa]['职务'] + '第' + e7a + '组';
                        //             e7aa = e7aa + 1;
                        //         }
                        //     }
                        //
                        //     let e8a = 0;
                        //     let e8aa = 0;
                        //     for (let i = this.kgAmount; i <= d8; i = i + this.kgAmount) {
                        //         e8a = e8a + 1;
                        //         for (let j = 1; j <= i / e8a; j++) {
                        //             e8[e8aa]['职务'] = e8[e8aa]['职务'] + '第' + e8a + '组';
                        //             e8aa = e8aa + 1;
                        //         }
                        //     }
                        //
                        //     let e9a = 0;
                        //     let e9aa = 0;
                        //     for (let i = this.kgAmount; i <= d9; i = i + this.kgAmount) {
                        //         e9a = e9a + 1;
                        //         for (let j = 1; j <= i / e9a; j++) {
                        //             e9[e9aa]['职务'] = e9[e9aa]['职务'] + '第' + e9a + '组';
                        //             e9aa = e9aa + 1;
                        //         }
                        //     }
                        // }//分组
                        this.mmp = e1.concat(e2, e3, e4, e5, e6, e7, e8, e9);
                    }

                     console.log(e1.length + e2.length + e3.length + e4.length + e5.length + e6.length + e7.length + e8.length + e9.length);

                } else {

                }
            }

        },
    }

</script>

<style scoped>
    a {
        color: #000
    }

    a:hover {
        color: white
    }

    .content-left label {
        margin: 0 80px 0 0;
    }

    .content-left button {
        background-color: rgba(248, 248, 248, 0.9);
        border-radius: 5px;
        padding: 10px 30px 10px 30px;
        border: 2px solid rgb(241, 241, 241);
        font-size: 19px;
        color: rgb(141, 141, 141);
        cursor: pointer;
    }

    .top {
        background: rgb(97, 127, 223);
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

    .top-right {
        margin: 15px 40px 0 0;

    }

    .content {
        display: flex;
        justify-content: space-between;
        margin: 5% 0 0 0;
    }

    .content-left {
        text-align: center;
        width: 50%;
        line-height: 50px;
        margin: 0 0 0 20px;
        font-size: 20px;
    }

    .content-right {
        width: 50%;
    }

    .content-div {
        text-align: center;
        border: 1px solid rgb(109, 138, 230);
        width: 95%;
        height: 400px;
        overflow: auto;
        line-height: 25px;
        letter-spacing: 3px;
    }

    .content-div::-webkit-scrollbar { /*滚动条整体样式*/
        width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 5px;
    }

    .content-div::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
        height: 5px;
    }

</style>