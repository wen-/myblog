/**
 * Created by Administrator on 14-10-24.
 */
var mongoose = require('mongoose');
var settings = require('../settings');
var db = exports.Db = mongoose.createConnection();
/*
mongoose.connect('mongodb://localhost/myblog',function(){
    console.log("数据库连接成功！");
});
*/
var options = {
    db: { native_parser: true }
    ,server: { poolSize: 5 }
    ,user: settings.user
    ,pass: settings.pass
};

var host =      settings.host;
var port =      settings.port;
var database =  settings.database;
var user =      settings.user;
var pass =      settings.pass;

db.open(host, database, port, options);

db.on('error', function (err) {
    //logger.error("connect error :" + err);
    //监听BAE mongodb异常后关闭闲置连接
    console.log("mongodb连接异常");
    db.close();
});

//监听db close event并重新连接
db.on('close', function () {
    //logger.info("connect close retry connect ");
    console.log("重新连接");
    db.open(host, database, port, options);
});
db.on('open',function(){
    console.log("数据库连接成功！");
});