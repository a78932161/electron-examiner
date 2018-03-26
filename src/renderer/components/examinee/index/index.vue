<template>
    <div>
        <div>
            <button @click="handleDownload">导出excel</button>
            <upload-excel style="display: inline-block" @on-selected-file='selected'></upload-excel>
        </div>

        <div>
            <ul style="display: inline-block">
                <li style="list-style: none" v-for="item in group.Arr">
                    <input type="radio" name="group" :value="item" v-model="group.val"/> {{item}}
                </li>
            </ul>
            <div v-show="group.Arr.length>0" style="display: inline-block;vertical-align:top;margin: 50px 0 0 50px ">
                <div style="margin-bottom: 50px">
                    同岗位连续：<input type="radio" name="continuity" value="true" v-model="continuity"/>
                    同岗位不连续：<input type="radio" name="continuity" value="false" v-model="continuity"/>
                </div>


                id:<input type="text" style="border:1px solid rebeccapurple" v-model.trim="user.id" placeholder="请输入身份证号或者准考证号"/>
                <button @click="onConfirmInfoClick">确定</button>
                <br>
                序号：<span v-text="user.randSort"></span><br>
                <input style="border:1px solid rebeccapurple" type="text" v-model.trim="user.revokeId"/>
                <button @click="onRevokeClick">撤销</button>
                <br>

                <div style="margin-top: 30px;">
                    <button @click="onEmptyClick">清空</button>
                </div>

                <ul>
                    <li v-for="item in extractArr" >
                        姓名：<span v-text="item['姓名']"></span>
                        序号：<span v-text="item.sort"></span>
                    </li>
                </ul>



            </div>
        </div>


    </div>
</template>
<script>





    let keyName = '岗位分组';
    let keyOccName = '岗位标识';
    import {shuffle} from '@/common/js/util';
    import uploadExcel from '@/base/UploadExcel/index';

    export default {
        data(){
            return {
                group: {
                    Arr: [],
                    val: '',
                    currentData: []
                },
                user: {
                    id: '',
                    sort: '',
                    randSort:'',
                    revokeId: ''
                },
                extractArr: [],
                continuity: 'true'



                /*  groupArr: [],
                 group: ''*/
            }
        },
        components: {
            uploadExcel

        },
        created(){

        },
        methods: {
            onResetClick(){
                this.$db.remove({}, {multi: true}, function (err, numRemoved) {
                });
                this.group.Arr = [];
            },
            onEmptyClick(){
                this._initSortData(this.group.val);
            },
            onRevokeClick(){
                let searchId = this.user.revokeId;
                let jsonExtra = JSON.stringify(this.extractArr);
                if (jsonExtra.indexOf(searchId) !== -1) {
                    this.extractArr.some((item, index) => {
                        if (item['身份证号'] === searchId || item['准考证号'] === searchId) {

                            if(this.continuity==='true'){
                                this.occArr.some((Aitem) => {
                                    if (Aitem.name === item[keyOccName]) {
                                        Aitem.val.push(item.sort);
                                        Aitem.val = shuffle(Aitem.val);
                                        console.log(this.occArr)
                                    }
                                });
                                this.extractArr.splice(index, 1);
                                alert('撤销成功');
                                console.log(this.extractArr);
                            }
                            else{
                              this.occArr.push(item.sort);
                              this.occArr=shuffle(this.occArr);
                                this.extractArr.splice(index, 1);
                                alert('撤销成功');
                              console.log(this.occArr)
                                console.log(this.extractArr)
                            }


                            return true;
                        }
                    })
                }
                else {
                    alert('撤销失败，无此考生排序记录')
                }

            },
            selected(data){
                let groupArr = [];
                let results = data.results;
                this.$db.remove({}, {multi: true}, function (err, numRemoved) {
                });
                this.$db.insert(results, function (err, newDocs) {
                });
                results.forEach((item) => {
                    if (groupArr.indexOf(item[keyName]) === -1 && item[keyName] != null) {
                        groupArr.push(item[keyName])
                    }
                });
                this.group.val = (groupArr.length === 0) ? null : groupArr[0];
                this.group.Arr = groupArr;

                 this.$db.find({}, function (err, docs) {

                });
            },
            onConfirmInfoClick(){  /*生成考生序号*/
                let searchId = this.user.id;
                /*let searchId = (this.user.id === '') ? this.user.ticket : this.user.id;*/
                if (searchId !== '') {
                    this.group.currentData.some((item, index) => {
                        if (item['身份证号'] === searchId || item['准考证号'] === searchId) {
                            let jsonExtra = JSON.stringify(this.extractArr);
                            if (jsonExtra.indexOf(searchId) !== -1) {
                                alert('此考生已经生成过序号')
                            }
                            else {
                                let currentItem;
                                if(this.continuity==='true'){
                                    this.occArr.some((Aitem, Aindex) => {
                                        if (Aitem.name === item[keyOccName]) {
                                            this.user.sort = Aitem.val[0];
                                            item.sort = Aitem.val[0];
                                            Aitem.val.shift();
                                            currentItem=item;
                                            console.log(this.extractArr)
                                            return true;
                                        }
                                    });
                                }
                                else{
                                    this.user.sort=this.occArr[0];
                                    item.sort=this.occArr[0];
                                    this.occArr.shift();
                                    currentItem=item;
                                }
                                 let num=0;
                                let myNumber= setInterval(()=>{  /*数字随机数滚动*/
                                    if(num>=30){
                                        this.user.randSort=this.user.sort;
                                        this.extractArr.push(currentItem);
                                        setTimeout(()=>{
                                            alert(`姓名:${currentItem['姓名']},序号:${currentItem.sort}`);
                                        },100);

                                        clearInterval(myNumber);
                                        return ;
                                    }
                                    this.user.randSort=(Math.random() * this.group.currentData.length+1)|0;
                                    num++;
                                },50)



                            }

                            return true;
                        }
                        if (this.group.currentData.length === index + 1) {
                            alert('无对应考生')
                        }

                    })

                }
                else {
                    alert('请输入身份证号或准考证号')
                }

            },
            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['姓名', '序号'];
                    const filterVal = ['姓名', 'sort'];
                    /* const list = this.list*/
                    const data = this.formatJson(filterVal, this.extractArr);
                    export_json_to_excel(tHeader, data, '列表excel');

                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            _for(start, end){
                let arr = [];

                for (let i = start; i <= end; i++) {
                    arr.push(i);
                }
                return arr;
            },
            _initSortData(flag){
                console.log(this.continuity)
                this.extractArr = [];
                this.user.randSort='';
                this.$db.find({[keyName]: flag}, (err, docs) => {
                    this.group.currentData = docs;
                    let occArr = [];
                    let occArrName = [];
                    if(this.continuity==='true'){
                        docs.forEach((item) => {
                            let strIndex = occArrName.indexOf(item[keyOccName]);

                            if (strIndex === -1 && item[keyOccName] != null) {
                                occArrName.push(item[keyOccName]);
                                occArr.push({name: item[keyOccName], val: [1]});
                            }
                            else {
                                let arrLength = occArr[strIndex].val.length;
                                occArr[strIndex].val.push(arrLength + 1);
                            }
                        });

                        occArr = shuffle(occArr);
                        let number = 0;
                        occArr.forEach((item, index) => {

                            let length = item.val.length;
                            number = length + number;
                            if (length === number) {
                                item.val = this._for(1, number);
                            }
                            else {
                                let start = occArr[index - 1].val[occArr[index - 1].val.length - 1];

                                item.val = this._for(start + 1, number);
                            }

                        });

                        for (let i = 0; i < occArr.length; i++) {
                            occArr[i].val = shuffle(occArr[i].val)
                        }
                    }
                    else{
                        for(let i=1;i<=docs.length;i++){
                            occArr.push(i);
                            occArr=shuffle(occArr);
                        }
                    }

                    this.occArr = occArr;
                    console.log( this.occArr)
                    // docs is an array containing documents Mars, Earth, Jupiter
                    // If no document is found, docs is equal to []
                });
            }
        },
        computed: {
            groupVal(){
                return this.group.val
            },

        },
        watch: {
            groupVal(newValue){
                this._initSortData(newValue);
            },
            continuity(){
                this._initSortData(this.group.val);
            }
        }
    }
</script>

<style>

</style>