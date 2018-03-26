<template>
    <div>
        <div class="top1">
            <div class="top-left1">
                考官抽签系统
            </div>
        </div>
        <div class="center1">
            <div class="table1">
                <table>
                    <tr>
                        <th width="15%">组别</th>
                        <th width="15%">考官名字</th>
                        <th width="15%">性别</th>
                        <th width="15%">联系电话</th>
                        <th width="30%">工作单位以及职务</th>
                        <th width="10%">备注</th>
                    </tr>
                    <tr v-for="item in goods">
                        <td>{{item.职务}}</td>
                        <td>{{item.姓名}}</td>
                        <td>{{item.性别}}</td>
                        <td>{{item.手机}}</td>
                        <td>{{item.工作单位}}</td>
                        <td>{{item.考官类别}}</td>
                    </tr>

                </table>
            </div>
            <div class="button1">
                <button @click="clickPage1()">上一页</button>
                <button @click="clickPage()">下一页</button>
                <router-link :to="{ path: '/homeEnd'}">
                    <button >返回</button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home-date",
        data(){
            return{
                page:1,
                size:2,
                tableData: [],
                goods:[],
            }
        },
        methods:{
            getList(){
                this.$db5.find({}, (err, docs) => {
                    if(docs.length>0){
                        docs.sort(function(a, b){
                            if (a.number === b.number) {
                                return b.index - a.index;
                            } else {
                                return a.number - b.number;
                            }
                        });
                        docs.reverse();
                        docs.forEach((value) => {
                            for (let a = 0; a < value.kgs.length; a++) {
                                this.tableData.push(value.kgs[a]);
                            }
                        });
                        this.tableData.forEach((value)=>{
                            if(value.考官类别.indexOf('主考官')>-1){
                                value.考官类别='主考官';
                            }else{
                                value.考官类别='考官'
                            }
                        });


                        this.$db4.findOne({}, (err, ret) => {
                            if(ret!==null) {
                                this.size = ret.kgAmount;
                                let arr = this.tableData;//数据
                                let currentArr = [];
                                let page = this.size;
                                let currentPage = this.page;
                                let StartNum = (currentPage - 1) * page;
                                let EndNum = currentPage * page;
                                for (let i = StartNum; i < EndNum; i++) {
                                    if (!arr[i]) {
                                        break;
                                    }
                                    currentArr.push(arr[i]);

                                }
                                this.goods = currentArr;//显示的数据

                            }
                        });


                    }
                });


            },

            clickPage(){
                if(this.page<this.tableData.length/this.page){
                    this.page=this.page+1;
                    this.getList();
                }else{

                }

            },
            clickPage1(){
                if(this.page>1){
                    this.page=this.page-1;
                    this.getList();
                }else{

                }

            },

        },
        mounted(){
            this.getList();
        }

    }
</script>

<style scoped>
    .top1 {
        background: rgb(0, 152, 254);
        width: 100%;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .top-left1 {
        color: rgb(255, 255, 255);
        font-size: 25px;
        margin: 0 0 0 10px;
    }

    .table1 {
        width: 100%;
    }

    .table1 table {
        width: 100%;
        font-size: 30px;
        color: #333333;
    }

    .table1 th {
        border: 1px solid #666666;
        padding: 8px;
        background-color: rgb(166, 166, 166);
        color: white;
    }

    .table1 tr {
        height: 8.5vh;
    }

    .table1 table, th, td {
        text-align: center;
        border: 1px solid black;
        vertical-align: middle
    }

    .button1 {
        margin: 3% 0 0 0;
        text-align: center;

    }

    .button1 button {
        cursor: pointer;
        width: 90px;
        height: 40px;
        background: rgb(248, 248, 248);
        border: 1px solid rgb(226, 226, 226);
        font-size: 16px;
        margin: 0 0 0 20px;
        border-radius: 5px;
    }


</style>