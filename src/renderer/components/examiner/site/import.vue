<template>
    <div class="content-mid11">
        <addres @on-selected-file='getData'></addres>
        <invigilator @on-selected-file='getData1'>></invigilator>
        <button @click="handleDownload">导出考官数据</button>
    </div>
</template>

<script>
    import addres from '@/base/UploadExcel/address';
    import invigilator from '@/base/UploadExcel/invigilator';

    export default {
        data() {
            return {
                listData:[],
            }
        },
        components: {
            addres,
            invigilator
        },

        methods: {
            getData(data) {
                if(data.header.indexOf("考点代码")>-1){
                    let adsResults = data.results;
                    this.$db1.remove({}, {multi: true}, function (err, numRemoved) {
                    });
                    this.$db1.insert(adsResults, function (err, newDocs) {
                    });
                    this.$db1.find({}, function (err, docs) {
                        console.log(docs);
                    });
                    alert('导入地点成功!');
                }else{
                    alert('导入数据出错!请重新导入');
                }

            },
            getData1(data) {
                if (data.header.indexOf("职务") > -1) {
                    let exrResults = data.results;
                    exrResults.forEach((value) => {
                        if (value['籍贯'] === '鹿城' || value['籍贯'] === '瓯海' || value['籍贯'] === '龙湾' || value['籍贯'] === '洞头') {
                            value['籍贯'] = '四区';
                        }
                        if (value['工作地'] === '鹿城' || value['工作地'] === '瓯海' || value['工作地'] === '龙湾' || value['工作地'] === '洞头') {
                            value['工作地'] = '四区';
                        }
                        if (value['籍贯'] === '温州') {
                            value['籍贯'] = '市本级';
                        }
                    });

                    this.$db.remove({}, {multi: true}, function (err, numRemoved) {
                    });
                    this.$db.insert(exrResults, function (err, newDocs) {
                        console.log(newDocs);
                    });
                    this.$db.find({'性别': '女'}, function (err, docs) {
                        console.log(docs);
                    });
                    alert('导入考官成功!');
                }else{
                    alert('导入数据出错!请重新导入');
                }
            },
            handleDownload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['组别', '考官姓名','性别','联系电话','工作单位及职务','备注'];
                    const filterVal = ['职务', '姓名','性别','手机','工作单位','考官类别'];
                    /* const list = this.list*/
                    const data = this.formatJson(filterVal, this.listData);
                    export_json_to_excel(tHeader, data, '列表excel');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        },
        mounted(){
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
                            this.listData.push(value.kgs[a]);
                        }
                    });
                }
            });
        }
    }
</script>

<style>

    .content-mid11 button {
        font-size: 18px;
        width: 190px;
        height: 40px;
        background: rgb(0, 125, 254);
        color: white;
        border: 1px solid rgb(0, 125, 254);
        border-radius: 5px;
    }

</style>