<template>
    <div class="lottery">
        <div class="b2">
            <label>抽签完成!</label>
        </div>
        <div class="b1">
            <table id="tableToExcel" v-show="false">
                <tr>
                    <th width="15%">组别</th>
                    <th width="15%">考官名字</th>
                    <th width="15%">性别</th>
                    <th width="15%">联系电话</th>
                    <th width="30%">工作单位以及职务</th>
                    <th width="10%">备注</th>
                </tr>
                <tr v-for="item in arrData1">
                    <td>{{item.职务}}</td>
                    <td>{{item.姓名}}</td>
                    <td>{{item.性别}}</td>
                    <td>{{item.手机}}</td>
                    <td>{{item.工作单位}}</td>
                    <td>{{item.考官类别}}</td>
                </tr>

            </table>
            <router-link :to="{ path: '/homeData'}">
                <button id="button1">查看结果</button>
            </router-link>
            <a download="导出Excel"  id="excelOut" href="#">
                <button id="button2">导出结果</button>
            </a>

        </div>
    </div>
</template>

<script>

    export default {
        name: "home-end",
        data() {
            return {
                kgAmount: 0,
                arrData:[],
                arrData1:[],
            }
        },
        methods: {


        },
        mounted() {
            this.$db5.find({}, (err, docs) => {
                if(docs.length >0){
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
                            this.arrData1.push(value.kgs[a]);
                        }
                    });
                    this.arrData1.forEach((value)=>{
                        if(value.考官类别.indexOf('主考官')>-1){
                            value.考官类别='主考官';
                        }else{
                            value.考官类别='考官'
                        }
                    });


                    this.$db4.findOne({}, (err, ret) => {
                        if (ret !== null) {
                            if (ret.kgAmount == 7) {
                                var base64 = function (s) {
                                    return window.btoa(unescape(encodeURIComponent(s)));

                                };
                                var format = function (s, c) {
                                    return s.replace(/{(\w+)}/g,
                                        function (m, p) {
                                            return c[p];
                                        });
                                };
                                function tableToExcel(tableid, sheetName) {
                                    var uri = 'data:application/vnd.ms-excel;base64,';
                                    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
                                        'xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" charset=utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
                                        + '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>'
                                        + '</x:ExcelWorkbook></xml><![endif]-->' +
                                        ' <style type="text/css">' +
                                        'table td  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:58.1pt;' +
                                        ' text-align: center;' +
                                        'background-color: #ffffff;' +
                                        'color: #000000;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        'table th  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:58.1pt;' +
                                        'text-align: center;' +
                                        'color: black;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        '</style>' +
                                        '</head><body ><table class="excelTable">{table}</table></body></html>';
                                    if (!tableid.nodeType) tableid = document.getElementById(tableid);
                                    var ctx = {worksheet: sheetName || 'Worksheet', table: tableid.innerHTML};
                                    document.getElementById("excelOut").href = uri + base64(format(template, ctx));

                                }
                                tableToExcel('tableToExcel', '考官分组表');

                            } else if (ret.kgAmount == 3) {
                                var base64 = function (s) {
                                    return window.btoa(unescape(encodeURIComponent(s)));

                                };
                                var format = function (s, c) {
                                    return s.replace(/{(\w+)}/g,
                                        function (m, p) {
                                            return c[p];
                                        });
                                };
                                function tableToExcel1(tableid, sheetName) {
                                    var uri = 'data:application/vnd.ms-excel;base64,';
                                    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
                                        'xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" charset=utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
                                        + '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>'
                                        + '</x:ExcelWorkbook></xml><![endif]-->' +
                                        ' <style type="text/css">' +
                                        'table td  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:135.5pt;' +
                                        ' text-align: center;' +
                                        'background-color: #ffffff;' +
                                        'color: #000000;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        'table th  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:135.5pt;' +
                                        'text-align: center;' +
                                        'color: black;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        '</style>' +
                                        '</head><body ><table class="excelTable">{table}</table></body></html>';
                                    if (!tableid.nodeType) tableid = document.getElementById(tableid);
                                    var ctx = {worksheet: sheetName || 'Worksheet', table: tableid.innerHTML};
                                    document.getElementById("excelOut").href = uri + base64(format(template, ctx));

                                }
                                tableToExcel1('tableToExcel', '考官分组表');
                            }else if(ret.kgAmount==5){
                                var base64 = function (s) {
                                    return window.btoa(unescape(encodeURIComponent(s)));

                                };
                                var format = function (s, c) {
                                    return s.replace(/{(\w+)}/g,
                                        function (m, p) {
                                            return c[p];
                                        });
                                };
                                function tableToExcel2(tableid, sheetName) {
                                    var uri = 'data:application/vnd.ms-excel;base64,';
                                    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
                                        'xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" charset=utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
                                        + '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>'
                                        + '</x:ExcelWorkbook></xml><![endif]-->' +
                                        ' <style type="text/css">' +
                                        'table td  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:81.34pt;' +
                                        ' text-align: center;' +
                                        'background-color: #ffffff;' +
                                        'color: #000000;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        'table th  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:81.34pt;' +
                                        'text-align: center;' +
                                        'color: black;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        '</style>' +
                                        '</head><body ><table class="excelTable">{table}</table></body></html>';
                                    if (!tableid.nodeType) tableid = document.getElementById(tableid);
                                    var ctx = {worksheet: sheetName || 'Worksheet', table: tableid.innerHTML};
                                    document.getElementById("excelOut").href = uri + base64(format(template, ctx));

                                }
                                tableToExcel2('tableToExcel', '考官分组表');
                            }else if(ret.kgAmount==9){
                                var base64 = function (s) {
                                    return window.btoa(unescape(encodeURIComponent(s)));

                                };
                                var format = function (s, c) {
                                    return s.replace(/{(\w+)}/g,
                                        function (m, p) {
                                            return c[p];
                                        });
                                };
                                function tableToExcel3(tableid, sheetName) {
                                    var uri = 'data:application/vnd.ms-excel;base64,';
                                    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"' +
                                        'xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" charset=utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
                                        + '<x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets>'
                                        + '</x:ExcelWorkbook></xml><![endif]-->' +
                                        ' <style type="text/css">' +
                                        'table td  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:45.1pt;' +
                                        ' text-align: center;' +
                                        'background-color: #ffffff;' +
                                        'color: #000000;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        'table th  {' +
                                        'border: .5pt solid windowtext;' +
                                        'width: 113pt;' +
                                        'height:45.1pt;' +
                                        'text-align: center;' +
                                        'color: black;' +
                                        'font-size: 14.0pt' +
                                        ' }' +
                                        '</style>' +
                                        '</head><body ><table class="excelTable">{table}</table></body></html>';
                                    if (!tableid.nodeType) tableid = document.getElementById(tableid);
                                    var ctx = {worksheet: sheetName || 'Worksheet', table: tableid.innerHTML};
                                    document.getElementById("excelOut").href = uri + base64(format(template, ctx));

                                }
                                tableToExcel3('tableToExcel', '考官分组表');
                            }

                        } else {
                            this.kgAmount = 7;
                        }
                    });
                }
            });
        },
    }
</script>

<style scoped>
    .lottery label {
        font-size: 60px;
        height: 100px;
        width: 850px;
        text-align: center;
        letter-spacing: 15px;
    }

    .lottery button {
        font-family: Microsoft YaHei;
        font-size: 35px;
        height: 80px;
        width: 20%;
        box-shadow: -1px 1px 10px #888888;
        border-radius: 5px;
        background: white;
        letter-spacing: 10px;
    }

    .b1  {
        text-align: center;
        margin:0 0 0 0;
    }
    .b2 {
        text-align: center;
        color: white;
        margin:8% 0 25% 0;
    }

    #button1 {
        margin: 0 40px 0 0;
    }

    #tableToExcel tr td {
        font-size: 18px;
        width: 200px;
        height: 66.8pt;
        text-align: center;
        border: 1px solid black;
        color: #ffffff;
    }
</style>