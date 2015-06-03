var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    im = require('../models/im.js');

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
router.get('/addsocket', function(req, res) {
    res.render('admin/addsocket', {

    });
});
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
router.get('/activatesocket', function(req, res) {
    var id = req.query.id;
    var state = req.query.state;
    im.activateIM(id,state,function(){
        res.json({
            success:200
        })
    })

});

module.exports = router;
