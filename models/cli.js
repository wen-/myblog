/**
 * Created by Administrator on 14-10-24.
 */
var mongoose = require('mongoose');
var imDb = require('./Db');

imDb.Db.on('open',function(){//成功连接数据库
    var ims = imDb.Db.collection("ims");//使用ims表
    //对已入库的数据进行类型转换(互转)
    ims.find({activate:{$type:16}}).toArray(function(err, documents) {
        documents.forEach(function(doc){
            doc.activate = Boolean(doc.activate);
            ims.save(doc,function(){
                console.log(documents);
            });
        })
    });
     /*ims.find({activate:{$type:8}}).toArray(function(err, documents) {
        documents.forEach(function(doc){
            doc.activate = Number(doc.activate);
            ims.save(doc,function(){
                console.log(documents);
            });
        })
    });*/
});
