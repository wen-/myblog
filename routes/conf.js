var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');

router.get('*',checkLogin);
//验证码配置
router.get('/codesetting', function(req, res) {
    var codeconf = require('../conf/code.js');
  var codesetting = {
    "length":codeconf.length
  };
  res.render('admin/codesetting',{
      'title':"后台管理",
      'user': req.session.user,
      'codeconf':codesetting
  });
});
router.post('/codesetting', function(req, res) {
  var codeData = {
    "length":req.body.codelength
  };

  var codePath = __dirname+'\\..\\conf\\code.js';
  var codeString = "module.exports = "+JSON.stringify(codeData);
  fs.writeFile(codePath,codeString,function(err){
    if(err){
     return res.json({"state":false,"msg":"数据写入失败！"})
    }
      //配置文件写入成功后，清除配置缓存模块，才能加载新配置
      delete require.cache[require.resolve('../conf/code.js')];
    res.json({"state":"success","msg":"保存成功！"})
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


