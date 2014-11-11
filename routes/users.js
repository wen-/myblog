var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var user = require('../models/user.js');
var post = require('../models/post.js');
var cropWatermark = require('../models/cropWatermark.js');
var sendmail = require('../models/sendMail.js');

/* GET users listing. */
//基本信息
router.get('*',checkLogin);
router.get('/userbasic', function(req, res) {
  res.render('admin/userbasic',{
      'title':"后台管理",
      'user': req.session.user
  });
});
router.post('/userbasic', function(req, res) {
  var basicData = {
    "name":req.body.username,
    "sex":req.body.sex,
    "birthday":req.body.birthday,
    "addressHome":req.body.addressHome,
    "addressReside":req.body.addressReside,
    "intro":req.body.intro
  };
  user.saveBasicData(req.body.email,basicData,function(err) {
    if(!!err){
      return res.json({"succeed":false});
    }
    req.session.user.basicData = basicData;
    res.json({"succeed":true});
  })
});

//教育信息
router.get('/usereducation', function(req, res) {
  res.render('admin/usereducation',{
    'title':"后台管理",
    'user': req.session.user
  });
});
router.post('/usereducation', function(req, res) {
  var educationData = {
    "schoolSort":req.body.schoolSort,
    "schoolName":req.body.schoolName,
    "schoolYear":req.body.schoolYear
  };
  user.saveEducationData(req.body.email,educationData,function(err) {
    if(!!err){
      return res.json({"succeed":false});
    }
    req.session.user.educationData = educationData;
    res.json({"succeed":true});
  })
});

//工作信息
router.get('/userwork', function(req, res) {
  res.render('admin/userwork',{
    'title':"后台管理",
    'user': req.session.user
  });
});
router.post('/userwork', function(req, res) {
  var workData = {
    "workCompany":req.body.workCompany,
    "fworkTime":req.body.fworkTime,
    "tworkTime":req.body.tworkTime
  };
  user.saveWorkData(req.body.email,workData,function(err) {
    if(!!err){
      return res.json({"succeed":false});
    }
    req.session.user.workData = workData;
    res.json({"succeed":true});
  })
});

//修改密码
router.get('/changepass', function(req, res) {
  res.render('admin/changepass',{
    'title':"后台管理",
    'user': req.session.user
  });
});
router.post('/changepass', function(req, res) {
  var email = req.body.email,
      oldPassword = req.body.oldPassword,
      newPassword = req.body.newPassword,
      newPassword1 = req.body.newPassword1;
  //生成口令散列
  var md5 = crypto.createHash('md5');
  var passwordMD5 = md5.update(req.body.oldPassword).digest('hex');
  var newmd5 = crypto.createHash('md5');
  var newPassWordMD5 = newmd5.update(req.body.newPassword).digest('hex');
  //检验密码是否存在
  if(!newPassword){
    req.flash('error','新密码不能为空！');
    return res.json({"succeed":false,"succeedMsg":"新密码不能为空！"})
  }
  if(passwordMD5 != req.session.user.password){
    req.flash('error','旧密码错误！');
    return res.json({"succeed":false,"succeedMsg":"旧密码错误！"})
  }
  //检验新密码是否存在
  if(!newPassword1){
    req.flash('error','确认新密码不能为空！');
    return res.json({"succeed":false,"succeedMsg":"确认新密码不能为空！"})
  }
  //检验用户再次输入的口令是否一致
  if(newPassword1 != newPassword){
    req.flash('error','两次输入的新密码不一致！');
    return res.json({"succeed":false,"succeedMsg":"两次输入的新密码不一致！"})
  }
  user.savePassword(email,newPassWordMD5,function(){
    req.session.user.password = newPassWordMD5;
    res.json({"succeed":true,"succeedMsg":"修改成功！"})
  })
});

//头像设置
router.get('/changehead', function(req, res) {
  res.render('admin/changehead',{
    'title':"后台管理",
    'user': req.session.user
  });
});
//头像文件上传
router.post('/headico', function(req, res) {
  var email = req.body.email;
  var upfiles = req.files.upfile;
  if(upfiles){
    if(!upfiles.truncated) {
      // 获得文件的路径
      var tmp_path = upfiles.path;

      //裁剪图片
      var opt = {
        w: req.body.w,
        h: req.body.h,
        x1: req.body.x1,
        y1: req.body.y1,
        x2: req.body.x2,
        y2: req.body.y2,
        tx: (parseInt(req.body.x1, 10) + req.body.w / 2 - 50),
        ty: (parseInt(req.body.y2, 10) - req.body.h / 3),
        tmp_path: tmp_path
      };
      var cropW = new cropWatermark(opt);
      cropW.cw(function () {
        var _url = tmp_path.replace(/^public/, '');
        _url = _url.replace(/\\/g, '/');
        user.saveHead(email,_url,function(err){
          if(err){
            if (req.xhr) {
              return res.json({
                "state": false,
                "msg": "头像地址存入数据库时出错。"
              });
            }else{
              res.set('Content-Type', 'text/html');
              return res.send('{"state":-1,"msg":"头像地址存入数据库时出错。"}');
            }
            return false;
          }
          if (req.xhr) {
            res.json({
              "state": "SUCCESS",
              "url": _url,
              "title": upfiles.name,
              "original": upfiles.originalname
            });
          } else {
            //如果不是ajax上传，返回字符串，返回JSON时会提示下载文件
            res.set('Content-Type', 'text/html');
            res.send('{"state":"SUCCESS","url":"'+ _url +'","title":"'+ upfiles.name +'","original":"'+ upfiles.originalname +'"}');
          }
        });

      });
    }else{
      if (req.xhr) {
        res.json({
          "state": false,
          "msg": "上传失败！文件格式或大小不匹配。"
        });
      }else{
        res.set('Content-Type', 'text/html');
        res.send('{"state":-1,"msg":"上传失败！文件格式或大小不匹配。"}');
      }
    }
  }else{
    if (req.xhr) {
      res.json({
        "state": false,
        "msg": "上传失败！文件格式或大小不匹配。"
      });
    }else{
      res.set('Content-Type', 'text/html');
      res.send('{"state":-1,"msg":"上传失败！文件格式或大小不匹配。"}');
    }
  }
});



//修改邮箱
/*
router.get('/changeemail', function(req, res) {
  res.render('admin/changeemail',{
    'title':"后台管理",
    'user': req.session.user
  });
});
router.post('/changeemail', function(req, res) {
  var email = req.body.email,
      newEmail = req.body.newEmail;
  //检验邮箱是否为空
  if(!newEmail){
    req.flash('error','新邮箱地址不能为空！');
    return res.json({"succeed":false,"succeedMsg":"新邮箱地址不能为空！"})
  }
  user.saveEmail(email,newEmail,function(){
    post.udemail(email,newEmail,function(err){
      if(err){
        req.flash('error','新邮箱修改失败！');
        return res.json({"succeed":false,"succeedMsg":"新邮箱修改失败！"})
      }else{
        req.session.user.email = newEmail;
        res.json({"succeed":true,"succeedMsg":"修改成功！"})
      }
    });

  })
});
*/

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


