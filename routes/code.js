/**
 * Created by Administrator on 14-10-24.
 */
var express = require('express');
var router = express.Router();
var qrcode = require('qr-image');
var codeTxt = require('../models/codeTxt.js');
var codeconf = require('../conf/code.js');

/* GET code listing. */
router.get('/numjpg',function(req,res) {
    var codeobj =new codeTxt(req.session,codeconf.length);
    codeobj.codeIMG(function(json){
        //req.session.codeUrl = json.t;
        res.set('Content-Type','image/jpeg');
        res.send(json.codeUrl);
    });
});

router.get('/numgif',function(req,res) {
    var codeobj =new codeTxt(req.session,codeconf.length);
    codeobj.codeGIF(function(json){
        //req.session.codeUrl = json.t;
        res.set('Content-Type','image/gif');
        res.send(json.codeUrl);
    });
});

router.get('/textjpg',function(req,res) {
    var codeobj =new codeTxt(req.session,codeconf.length,true);
    codeobj.codeIMG(function(json){
        //req.session.codeUrl = json.t;
        res.set('Content-Type','image/jpeg');
        //res.set('Content-Type','image/gif');
        res.send(json.codeUrl);
    });
});

router.get('/textgif',function(req,res) {
    var codeobj =new codeTxt(req.session,codeconf.length,true);
    codeobj.codeGIF(function(json){
        //req.session.codeUrl = json.t;
        res.set('Content-Type','image/gif');
        res.send(json.codeUrl);
    });

});

router.get('/qrcode',function(req,res) {//带上参数code="xxx"
    var codetxt = req.query.code;
    var qr_png = qrcode.image(codetxt);
    //var qr_png = qrcode.matrix(codetxt);
    //var qr_png = qrcode.imageSync(codetxt);
    res.set('Content-Type','image/png');
    qr_png.pipe(res);
});

module.exports = router;