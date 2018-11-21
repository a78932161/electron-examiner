/**
 * Created by liutim on 2018/3/16.
 */
/*
 注意：
 1.当前本排序规则要求，市本级的面试室个数不少于其他区的数量，也就是不少于8，否则女性比率上市本级
 就会出现超出平均比率以上
 2.抽签规则会被处理成按照一定优先级排列(市本级最低,四区最高，其他按照地区代号来排列）；

 3.四个参数的格式如下：
 var itemcount = 7;

 var regions = [
 ["01", '市本级', 11, 1],
 ["02", '四区', 7, 1],
 ["04", '乐清', 3, 1],
 ["05", '瑞安', 2, 1],
 ["03", '永嘉', 4, 1],
 ["07", '苍南', 5, 1],
 ["06", '平阳', 2, 1],
 ["09", '泰顺', 4, 1],
 ["08", '文成', 4, 1]
 ];


 var tagrules = [
   ["01", 1, 2, '公安考官 ']
 , ["02", 3, 4, '公安考官']
 , ["02", 3, 2, '教师考官']
 , ["02", 3, 4, '公安考官']
 ];

 kaoguans=[{
 "考官编号": "1",
 "姓名": "考官1",
 "性别": "女",
 "工作单位": "温州市人力社保局",
 "职务": "政策法规处处长",
 "手机": "12345678910",
 "工作地": "市本级",
 "籍贯": "温州",
 "考官类别": "主考官"
 },.....]


 onepertongdanwei: 是否同单位分开，true为分开，false或不设置为不作要求


 如果未算出合适的分配方案，则返回false

 计算时可能会抛出异常New Error(message)
 */

window.calculateprintablesiteinfos= function (itemcount, regions, tagrules, kaoguans,onepertongdanwei) {
    var MAXSECOND=2*60*1000;//最多计算时长，两分钟
    var STARTTIME=new Date().getTime();

    var checkvalidduration=function(){
        if(new Date().getTime()-STARTTIME>MAXSECOND){
            throw new Error(JSON.stringify({errorcode:4,msg:"时间过长"}));
        }
    }



    //给参数去空格,并排列好规则
    var initdataandsorttagrule = function () {
        //去空格
        _.each(regions, function (r) {
            r[0]= parseInt(r[0]);
            r[1] = r[1].trim();
            r[2]= parseInt(r[2]);
            r[3]= parseInt(r[3]);
        });

        _.each(tagrules, function (r) {
            r[0]= parseInt(r[0]);
            r[1]= parseInt(r[1]);
            r[2]= parseInt(r[2]);
            r[3] = r[3].trim();
        });
        //拿到四区的id
        var siquid = (_.find(regions, function (reg) {
            if ("四区" == reg[1]) {
                return true;
            }
        }))[2];

        //将市本级的标签规则放到最后，四区的规则排到最前
        tagrules = _.sortBy(tagrules, function (r) {
            if (r[0] == siquid){
                return 100;//四区优先级最高，因为能去四区的人太少
            }else {
                return 100 - r[0];
            }
        });
    }


    var getprintablesiteinfos = function () {
        var starttime = new Date().getTime();
        var result = calculate();
        var milseconds = new Date().getTime() - starttime;
        console.log(milseconds);
        //console.log(result);

        var printablesiteinfos = [];
        _.each(result, function (distobj) {
            _.times(distobj.sitecount, function (i) {
                var arr = distobj[i + distobj.sitestartidex];
                printablesiteinfos.push({
                    name: distobj.name, number: distobj.id, index: i + distobj.sitestartidex, count: arr.length
                    , female: _.reduce(arr, function (c, a) {
                        return c + (a["性别"] == "女" ? 1 : 0);
                    }, 0)
                    , zhukaoguan: _.reduce(arr, function (c, a) {
                        return c + (_.contains(a["考官类别数组"],"主考官") ? 1 : 0);
                    }, 0)
                    , kgs: _.sortBy(arr, function (kg) {
                        kg["考官类别数组"]=_.sortBy(kg["考官类别数组"],function(kglb){return ("主考官"==kglb)?0:1;});
                        kg["考官类别"]=kg["考官类别数组"].join(",");
                        return (_.contains(kg["考官类别数组"],"主考官") ? 0 : 1);
                    })
                });
            })
        });
        return _.sortBy(printablesiteinfos, function (siteinfo) {
            siteinfo.number2="0"+siteinfo.number;
            return siteinfo.number * 100 + siteinfo.index
        });
        //console.log(printablesiteinfos);

    }

    var deepclone = function (objorarray) {
        return JSON.parse(JSON.stringify(objorarray))
    }


    //各种全局参数准备。女性人数
    var femalecount = _.reduce(kaoguans, function (femalecount, kaoguan) {
        return (kaoguan.性别.trim() == "女") ? (femalecount + 1) : femalecount
    }, 0);

    var sitecount = _.reduce(regions, function (c, r) {
        return c + parseInt(r[2]);
    }, 0);//考点总数


    //给所有考官加上可去区域（但不包括市本级，因为市本级谁都可以去）
    var initkaoguans = function () {
        var allarea = _.reduce(regions, function (aa, r) {
            aa.push(r[1]);
            return aa;
        }, []);//从考点表中获取所有的区域名称。

        _.each(kaoguans, function (r) {
            r.性别 = r.性别.trim();
            //考官类别根据逗号分隔并去除无效符号，组成考官类别数组
            r.考官类别数组=_.filter(r.考官类别.trim().split(","),function(vsa){
                var vsat=vsa.trim();
                return (vsat!="" && vsat!=",");
            });
            r.工作单位=r.工作单位.trim();
            r.籍贯 = r.籍贯.trim();
            //根据逗号分隔并去除无效符号，组成工作地数组
            r.工作地=r.工作地.trim();
            r.工作地数组=_.filter(r.工作地.split(","),function(vsa){
                var vsat=vsa.trim();
                return (vsat!="" && vsat!=",");
            });
            if ((r.籍贯 == "市本级" || r.籍贯 == "温州") && (r.工作地 == "市本级" || r.工作地 == "温州")) {
                r.avaliableareas = allarea;
            }
            var jg = r.籍贯;
            if (r.籍贯 == "龙湾" || r.籍贯 == "洞头" || r.籍贯 == "瓯海" || r.籍贯 == "鹿城") {
                jg = "四区";
            }
            var gzd = _.map(r.工作地数组,function(tempgzd){
                return (tempgzd== "龙湾" || tempgzd == "洞头" || tempgzd == "瓯海" || tempgzd == "鹿城")?"四区":tempgzd;
            });

            //不包括市本级，因为市本级谁都可以去。
            r.avaliableareas = _.union(_.difference(allarea, gzd,[jg,"市本级"]));
        })

        return deepclone(kaoguans);
    }

    var initdist = function () {
        //初始化求解数据
        var dist = {};
        _.each(regions, function (item) {
            var distobj = {
                name: item[1],
                id: item[0],
                sitecount: item[2],
                sitestartidex: item[3],
                currentkgcount: 0,
                mainkgcount: 0,
                femailkgcount: 0,
                temp: [],//临时存放分配至区域的考官。
            };
            _.times(item[2], function (n) {
                distobj[item[3] + n] = [];//给面试点分配考官数据
            });
            dist[item[1]] = distobj;
        });
        return dist;
    }

    /*把考官添加到某个区域的临时数组中，并更新该区域中的主考官/女考官/所有考官数量*/
    var addkg = function (distobj, kg, siteidx) {
        siteidx ? distobj[siteidx].push(kg) : distobj.temp.push(kg);
        distobj.currentkgcount++;
        if (_.contains(kg.考官类别数组, "主考官")) {
            distobj.mainkgcount++;
        }
        if (kg.性别 == "女") {
            distobj.femailkgcount++;
        }
    }

    /*启动总的计算*/
    var calculate = function () {
        initdataandsorttagrule();
        var dist = initdist();
        var avaliablekaoguans = initkaoguans();
        var starttime=new Date().getTime();
        for (var i = 0; i < (avaliablekaoguans.length * avaliablekaoguans.length); i++) {
            console.log(i);
            var result = matchtagrules(deepclone(dist), _.shuffle(avaliablekaoguans));
            if (result) {
                console.log(_.map(result, function (m) {
                    return {n: m.name, c: m.currentkgcount, f: m.femailkgcount, s: m.sitecount}
                }));
                var distributeexception=_.find(_.values(result), function (distobj) {
                    var isfinished=false,count=0;
                    while(!isfinished &&  count++<(distobj.currentkgcount*distobj.currentkgcount)){
                        isfinished=distributetosite(distobj)
                    }
                    return !isfinished;
                });
                if(!distributeexception){
                    return result;
                }else{
                    continue;
                }
            }else{
                checkvalidduration();
            }
        }
        return false;
    }

/*判断每个面试室添加新考官时是否可行*/
    var checksiteavaliable = function (sitekgs, kg,isfemaleceil) {
        var alreayfemale = _.reduce(sitekgs, function (t, kg) {
            return t + ((kg["性别"] == "女") ? 1 : 0);
        }, 0);
        if (alreayfemale + ((kg && kg["性别"] == "女") ? 1 : 0) > (isfemaleceil?Math.ceil(femalecount / sitecount):Math.floor(femalecount / sitecount))) {
            return false;
        }
        var alreayzhukaoguan = _.reduce(sitekgs, function (t, kg) {
            return t + (_.contains(kg["考官类别数组"],"主考官")) ? 1 : 0;
        }, 0);
        if (alreayzhukaoguan + ((kg &&_.contains(kg["考官类别数组"],"主考官"))? 1 : 0) > 1) {
            return false;
        }
        if ((sitekgs.length + (kg ? 1 : 0)) > itemcount) {
            return false;
        }
        //判断是否已经存在同单位
        if(onepertongdanwei && kg){

            if(_.find(sitekgs,function(k){return k.工作单位==kg.工作单位;})){
                return false;
            }
        }
        return true;
    }

    var distributetosite = function (distobj) {
        var kggroup=_.groupBy(distobj.temp,function(kg){
                if (_.contains(kg.考官类别数组, "主考官")) {
                    return 0;
                } else if (kg.性别 == "女") {
                    return 1;
                } else {
                    return 2;
                }
            });

        var mainkaoguans = kggroup[0];
        var normalfemalekaoguans = kggroup[1];
        var normalmalekaoguans = kggroup[2];

        //某区域各单位人数对照表：
        var distributekgstragety = (function (distobj) {

            var result = {};
            if (onepertongdanwei) {
                var countdanweikgs = function (k) {
                    if (_.has(result, k.工作单位)) {
                        result[k.工作单位] = result[k.工作单位] + 1;
                    } else {
                        result[k.工作单位] = 1;
                    }
                };
                _.times(distobj.sitecount, function (i) {
                    var arr = distobj[i + distobj.sitestartidex];
                    _.each(arr, countdanweikgs);
                });
                _.each(distobj.temp, countdanweikgs);
            }
            //找到单位最多的排序并分组,
            result.getkgswaitfordistribute = function (categorykgs) {
                if (!onepertongdanwei) {
                    return categorykgs;
                } else {
                    var kgsarray= _.map(_.sortBy(_.pairs(_.groupBy(categorykgs, function (ckg) {
                            return result[ckg.工作单位];
                        }))
                        , function (dwkgarray) {//排序规则
                            return -1 * dwkgarray[0];
                        }), function (dwkgarray) {//映射规则
                        return dwkgarray[1];
                    });
                    var kgswaitfordistributearray=[];//待分配的考官数组
                    _.each(kgsarray,function(kgs){
                        kgswaitfordistributearray.push.apply(kgswaitfordistributearray,_.shuffle(kgs));//一定程度上的随机
                    });
                    return kgswaitfordistributearray;
                }
            };

            result.getsortedobjarray = function (distobj) {//对已有面试室根据已有人数从多到少进行排序，一次性的先试试看，后面再决定是否需要把它变成每次放入都需要重算顺序
                var sortedobjarray = _.sortBy(_.map(_.range(0, distobj.sitecount), function (ra) {
                    return {siteindex: distobj.sitestartidex + ra, kgcount: distobj[distobj.sitestartidex + ra].length};
                }), function (rr) {
                    return -1 * rr.kgcount;
                });
                return sortedobjarray;
            }
            return result;
        })(distobj);

        /*分配各类考官的函数，考虑到有可能多次分配不成功，因此设定随机分配上线maxrepeat，一旦超过maxrepeat次还未分配成功，则返回false*/
        var distruteintositeforcategory=function(distobj,categorykgs,conditionfunc,exceptionfunc){

            var distruteintositeforcategoryonce=function(kgswaitfordistributearray,sortedobjarray,distobj){
                //依次安插人数，为的是将工作单位最多的人尽可能先也给人最多的组先分，这样就能避免出现一般的随机
                try {
                    _.each(kgswaitfordistributearray, function (kg) {
                        var i = 0;
                        while (i < sortedobjarray.length) {
                            if (conditionfunc(distobj[sortedobjarray[i].siteindex], kg)) {
                                distobj[sortedobjarray[i].siteindex].push(kg);
                                break;
                            }
                            i++;
                        }
                        if (i == sortedobjarray.length) {//如果未找到，则抛异常。
                            if (exceptionfunc) {
                                exceptionfunc(kg);
                            } else {
                                throw new Error(JSON.stringify({errorcode:2,msg:"放不下去!",target:rule}));
                            }
                        }
                    });
                } catch (e) {

                    return false;
                }
                return true;
            };

            var destdistobj=distobj,repeat=0;
            while(repeat++<distobj.currentkgcount*distobj.currentkgcount){
                distobj=deepclone(destdistobj);
                //拿到按照分配策略排好的待分配考官数组
                var kgswaitfordistributearray=distributekgstragety.getkgswaitfordistribute(categorykgs);
                //拿到按照分配策略排好的等待分配的数组
                var sortedobjarray=distributekgstragety.getsortedobjarray(distobj);
                if (distruteintositeforcategoryonce(kgswaitfordistributearray, sortedobjarray, distobj)) {
                    //成功前先把分配结果拷贝回来
                    _.each(_.keys(distobj), function (k) {
                        destdistobj[k] = distobj[k];
                    });
                    if (repeat >= distobj.currentkgcount) {
                        console.log(repeat, kgsarray, distobj);
                    }
                    return true;
                }
            }
            return false;//超过一定次数还没成功
        }

        var reminder = [];//第一次分配后剩余的女考官
        var arr=[{kgswaitfordistribute:mainkaoguans
            ,condition:function(sitekgs,kg){
            return checksiteavaliable(sitekgs, kg);
        }},
            {kgswaitfordistribute:normalfemalekaoguans,condition:function(sitekgs,kg){
            return checksiteavaliable(sitekgs, kg);
        },exception:function(kg){
            reminder.push(kg);
                return false;
        }},
            {kgswaitfordistribute:reminder
                ,condition:function(sitekgs,kg){
                return checksiteavaliable(sitekgs, kg,true);  //进一步分配女考官，以math.ceil为标准来分配，应该是全都能分配完的。
            }}
            ,{kgswaitfordistribute:normalmalekaoguans
                ,condition:function(sitekgs,kg){
                    return checksiteavaliable(sitekgs, kg,true);  //进一步分配女考官，以math.ceil为标准来分配，应该是全都能分配完的。
                }}
                ];

        var destdistobj=distobj;
        distobj=deepclone(distobj);

        //一旦分配未成功，则直接对应的规则元素。
        var result=_.find(arr,function(a){
                return !distruteintositeforcategory(distobj,a.kgswaitfordistribute,a.condition,a.exception)
        });

        if(!result){
            //一旦可行了，就把分配方案copy回原对象
            _.each(_.keys(distobj),function(k){
                destdistobj[k]=distobj[k];
            });
            return true;
        }else{
            return false;
        }
    }

    /*根据标签规则，分配标签考官*/
    var matchtagrules = function (dist, avaliablekaoguans) {
        for (var i = 0; i < tagrules.length; i++) {
            var rule = tagrules[i];
            //得到规则相关联的区域名称
            var areaobj = _.find(dist, function (distobj) {
                return distobj.id == rule[0];
            });
            var areaname = areaobj.name;
            //过滤满足可去区域的标签考官
            //TODO 标签考官是否可以重复算？比如说某组需要一个教师考官，一个公安考官，那选中了一个教师（同时也是公安）考官后，还需要再选公安考官吗？
            var tagkaoguans = _.filter(avaliablekaoguans, function (kg) {
                return (_.contains(kg.考官类别数组,rule[3]) &&
                (_.contains(kg.avaliableareas, areaname) || areaname == "市本级"));
            });
            if (tagkaoguans && tagkaoguans.length >= rule[2]) {
                var selectedkgs = tagkaoguans.slice(0, rule[2]);
                var tempkgs = _.union(areaobj[rule[1]], selectedkgs);

                var tempareakgs=deepclone(areaobj[rule[1]]);
                var tempareakgsnotavaliable=_.find(selectedkgs, function (kg) {
                    if(checksiteavaliable(tempareakgs,kg)){
                        tempareakgs.push(kg);
                        return false;
                    }else{
                        return true;
                    }
                });
                //如果不可行
                if (tempareakgsnotavaliable) {
                    return false;
                }

                //真正的添加到某个面试室中去
                _.each(selectedkgs, function (kg) {
                    addkg(areaobj, kg, rule[1]);
                });

                avaliablekaoguans = _.difference(avaliablekaoguans, selectedkgs);
            } else {
                throw new Error(JSON.stringify({errorcode:1,msg:"标签考官不够!",target:rule}));//某标签考官不够！
            }

        }
        for (var j = 0; j < avaliablekaoguans.length*avaliablekaoguans.length; j++) {
            checkvalidduration();
            var deepdist = deepclone(dist);
            if (matcharealkaoguan(deepdist, _.shuffle(avaliablekaoguans))) {
                return deepdist;
            }
        }
        return false;
    }


    var matcharealkaoguan = function (newdist, avaliablekaoguans) {
        var kggroup = _.groupBy(avaliablekaoguans, function (kg) {
            if (_.contains(kg.考官类别数组, "主考官")) {
                return 0;
            } else if (kg.性别 == "女") {
                return 1;
            } else {
                return 2;
            }
        });

        var mainkaoguans = kggroup[0];
        var normalfemalekaoguans = kggroup[1];
        var normalmalekaoguans = kggroup[2];

        var distributekgs = function (dist, kgs, continuecondition, checkcondition, afterexecute) {

            while (continuecondition(kgs.length)) {
                var clonekgs = kgs;
                var countbefore=clonekgs.length;
                kgs = [];
                _.each(clonekgs, function (kg) {
                    var x = _.find(kg.avaliableareas, function (area) {
                        if (checkcondition(newdist[area], kg)) {
                            addkg(dist[area], kg);
                            return true;
                        } else {
                            return false;
                        }
                    })
                    if (!x) {
                        kgs.push(kg);
                    }
                });

                console.log("clonekgs:"+clonekgs.length+" , kgs:"+kgs.length);
                if(kgs.length==countbefore){
                    throw new Error(JSON.stringify({errorcode:3,msg:"放不下去!",target:rule}));;//TODO 怎么写？
                    return false;//一个都没有分配出去，表明这中就是死循环了。直接退出。早点失败fast-failure
                }
            }
            return afterexecute(kgs);
        }

        //分配主考官
        var distributeresult = distributekgs(newdist, mainkaoguans
            //循环是否进行由此控制
            , function (count) {
                return count > newdist["市本级"].sitecount;
            }
            //添加前必须检查是否满足这个条件
            , function (distobj, kg) {
                return checkareaavaliable(distobj, kg);
            }
            , function (kgs) {
                //剩余的11个主考官打算直接赋给市本级
                var someexception= _.find(kgs, function (kg) {
                    if(checkareaavaliable(newdist["市本级"],kg)){//可能会因为工作单位导致分配违反规则，因此需要检查
                        addkg(newdist["市本级"], kg);
                        return false;
                    }else{
                        return true;//发现违反规则的放入
                    }
                });
                return !someexception;//意味着没有破坏规则的情况出现
            }
        );
        if (!distributeresult) {
            return false
        }

        //准备分配女考官，市本级最少得分配多少个？
        var shouldgetfemalecount = Math.floor(femalecount / sitecount * newdist["市本级"].sitecount);
        //平均最少分配后应剩余多少个
        var shouldremainfemalecount = femalecount + (shouldgetfemalecount - newdist["市本级"].femailkgcount)
            - _.reduce(regions, function (t, r) {
                return t + Math.floor(femalecount / sitecount * r[2])
            }, 0);
        //分配到最后真有多余的，留待最后给市本级。
        var shouldremainfemail = [];
        //开始分配
        distributeresult = distributekgs(newdist, normalfemalekaoguans
            , function (count) {
                return count > shouldremainfemalecount;
            }
            , function (distobj, kg) {//必须满足的条件
                return checkareaavaliable(distobj,kg);
            }
            , function (kgs) {
                var someexception= _.find(kgs.splice(0, shouldgetfemalecount - newdist["市本级"].femailkgcount), function (kg) {
                    if(checkareaavaliable(newdist["市本级"],kg)){//可能会因为工作单位导致分配违反规则，因此需要检查
                        addkg(newdist["市本级"], kg);
                        return false;
                    }else{
                        return true;//发现违反规则的放入
                    }
                });
                shouldremainfemail = kgs;
                return !someexception;//意味着没有破坏规则的情况出现
            }
        )
        if (!distributeresult) {
            return false
        }

        //分配普通考官
        //平均最小分配后应剩余多少个
        var shouldremainmale = newdist["市本级"].sitecount * itemcount - newdist["市本级"].currentkgcount - shouldremainfemail.length;

        return distributekgs(newdist, normalmalekaoguans
            , function (count) {
                return count > shouldremainmale;
            }
            , function (distobj, kg) {//必须满足的条件
                return checkareaavaliable(distobj,kg);
                //return distobj.currentkgcount < distobj.sitecount * itemcount;
            }
            , function (kgs) {
                //console.log(kgs);
                //把上次剩余女考官加入分配，不用担心过量，详见整个函数的说明
                var reminders=_.union(kgs, shouldremainfemail);
                var someexception= _.find(reminders, function (kg) {
                    if(checkareaavaliable(newdist["市本级"],kg,true)){//可能会因为工作单位导致分配违反规则，因此需要检查
                        addkg(newdist["市本级"], kg);
                        return false;
                    }else{
                        checkareaavaliable(newdist["市本级"],kg,true);
                       // console.log(_.groupBy(reminders,function(r){return r.工作单位;}));
                        return true;//发现违反规则的放入
                    }
                });

                return !someexception && (newdist["市本级"].currentkgcount == newdist["市本级"].sitecount * itemcount);
            }
        );
    }


    var checkareaavaliable = function (distobj, kg,isfemaleceil)  {
        if (distobj.femailkgcount + ((kg && kg["性别"] == "女") ? 1 : 0)
            > (isfemaleceil?Math.ceil(femalecount / sitecount)* distobj.sitecount:Math.floor(femalecount / sitecount * distobj.sitecount))) {
            return false;
        }
        if (distobj.mainkgcount + (kg && (_.contains(kg["考官类别数组"],"主考官") ? 1 : 0)) > distobj.sitecount) {
            return false;
        }
        if ((distobj.currentkgcount + (kg ? 1 : 0)) > distobj.sitecount * itemcount) {
            return false;
        }
        //同单位每面试点只能有一个，因此整个区域只能有n个
        if(onepertongdanwei){
            var gongzuodanweicount=0;
            _.times(distobj.sitecount, function (i) {
                var arr = distobj[i + distobj.sitestartidex];
                gongzuodanweicount+=_.reduce(arr,function(c,k){return c+(k.工作单位==kg.工作单位?1:0);},0);
            });
            gongzuodanweicount+=_.reduce(distobj.temp,function(c,k){return c+(k.工作单位==kg.工作单位?1:0);},0);
            if(gongzuodanweicount>=distobj.sitecount ){
                return false;
            }
            /*if( kg.工作单位=='温州市人力社保局'){
                console.log(distobj.sitecount,gongzuodanweicount,"======",distobj.name,kg.考官编号);
            }*/
        }
        return true;
    }


     var printresult=getprintablesiteinfos();
    return printresult;

}