var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    im = require('../models/im.js');
var redis = require('../node_modules/socket.io-redis/node_modules/redis');


router.get('/socket', function(req, res) {
    //生成加密KEY
    var md5 = crypto.createHash('md5');
    var time = new Date(),y = time.getFullYear(),m = time.getMonth()+1,d = time.getDate(),s = time.getHours(),_m = Math.floor(time.getMinutes()/3)*3;
    time = y+''+m+''+d+''+s+''+_m;
    var keyMD5 = md5.update('IM'+time).digest('hex');
    var testmd5 = crypto.createHash('md5').update('abc').digest('hex');
    console.log(testmd5);
    res.render('say', {
        "key":keyMD5
    });
});
router.get('/socket/key', function(req, res) {
    //验证用户名和密码
    var userName = req.body.username,
        password = crypto.createHash('md5').update(req.body.password).digest('hex');

    //生成加密KEY
    var md5 = crypto.createHash('md5');
    //var time = new Date(),y = time.getFullYear(),m = time.getMonth()+1,d = time.getDate(),s = time.getHours(),_m = Math.floor(time.getMinutes()/3)*3;
    //time = y+''+m+''+d+''+s+''+_m;
    var time = new Date().getTime();
    var keyMD5 = md5.update('IM'+time).digest('hex');

    res.json({
        "key":keyMD5
    });
});

router.get('/socketlist',checkLogin);
router.get('/socketlist', function(req, res) {
    var page = req.query.page?parseInt(req.query.page):1;
    var query = {
        "page":page,
        "limit":10
    };

    //查询并返回第page页的10条记录
    im.getTen(query, function(err, posts,total) {
        if (err) {
            posts = [];
        }
        if(req.xhr){
            res.json({
                "posts": posts,
                "page":page,
                "total":total
            });
        }else{
            res.render('admin/socketlist', {
                "title":"后台管理",
                "posts": posts,
                "page":page,
                "user": req.session.user,
                "total":total
            });
        }

    });
});

router.get('/addsocket',checkLogin);
router.get('/addsocket', function(req, res) {
    res.render('admin/addsocket', {

    });
});

router.post('/addsocket',checkLogin);
router.post('/addsocket', function(req, res) {
    var userName = req.body.username,
        password = crypto.createHash('md5').update(req.body.password).digest('hex'),
        activate = req.body.activate;
    var newIM = new im({
        email: userName,
        password: password,
        activate: activate
    });
    //新增用户
    newIM.save(function (err) {
        if (err) {
            return res.json({
                success : -100
            });
        }
        res.json({
            success : 200
        });
    });
});

router.get('/activatesocket',checkLogin);
router.get('/activatesocket', function(req, res) {
    var id = req.query.id;
    var state = req.query.state;
    im.activateIM(id,state,function(){
        res.json({
            success:200
        })
    })

});

router.get('/delsocket',checkLogin);
router.get('/delsocket', function(req, res) {
    var id = req.query.id;
    im.delIM(id,function(){
        res.json({
            success:200
        })
    })
});


//获取im key
router.get('/key',function(req,res){
    //var userName = req.body.username;
    //var passWord = req.body.password;
    var userName = req.query.username;
    var passWord = req.query.password;
    var md5 = crypto.createHash('md5');
    var passwordMD5 = md5.update(passWord).digest('hex');
    im.get(userName,function(err,user){
        if(err){
            return res.json({
                success: -100,
                msg: '账号/密码不正确'
            });
        }
        if(!user || passwordMD5 !== user.password){
            return res.json({
                success: -100,
                msg: '账号/密码不正确'
            });
        }

        var time = new Date().getTime();
        var keyMD5 = crypto.createHash('md5').update(user.email+time).digest('hex');
        var client = redis.createClient(6379, '127.0.0.1', {});
        client.on("connect", function () {
            client.select(3,function(){
                //console.log("选择3号库成功！");
                client.hmset('keys', keyMD5,'',function(err,replies){
                    res.json({
                        success: 200,
                        key: keyMD5
                    })
                });
                client.quit();
            });
        });
        client.on("error", function (err) {
            console.log("连接redis出错了(存入imKey)：" + err);
        });
    })
});

function checkLogin(req, res, next){
    if(!req.session.user){
        req.flash('error','未登录!');
        return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登录!');
        return res.redirect('/');
    }
    next();
}

module.exports = router;
