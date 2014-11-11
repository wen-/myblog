var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var codeconf = require('../conf/code.js');

//验证码配置
router.get('/codesetting', function(req, res) {
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
    res.json({"state":"success","msg":"保存成功！"})
  })
});

module.exports = router;


