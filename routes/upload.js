/**
 * Created by Administrator on 14-10-24.
 */
var express = require('express');
var router = express.Router();
var cropWatermark = require('../models/cropWatermark.js');

//图片上传
router.post('/blog', function(req, res) {
    var upfiles = req.files.upfile;
    var urllist = [],
        titlelist = [],
        originallist = [];
    if(upfiles){
        if(upfiles.length > 1){
            upfiles.forEach(function(n,i){
                if(n.truncated){
                    return;
                }
                var _url = n.path.replace(/^public/,'');
                _url = "http://"+ req.headers.host + _url.replace(/\\/g,'/');
                urllist.push(_url);
                titlelist.push(n.name);
                originallist.push(n.originalname);
            });
        }else{
            if(!upfiles.truncated){
                var _url = upfiles.path.replace(/^public/,'');
                _url = "http://"+ req.headers.host + _url.replace(/\\/g,'/');
                urllist.push(_url);
                titlelist.push(upfiles.name);
                originallist.push(upfiles.originalname);
            }
        }
        if(urllist.length == 1){
            urllist = urllist[0];
            titlelist = titlelist[0];
            originallist = originallist[0];
        }
    }
    if(urllist.length >= 1){
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
            res.send('{"state":"SUCCESS","url":"http://'+ req.headers.host+_url +'","title":"'+ upfiles.name +'","original":"'+ upfiles.originalname +'"}');
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
module.exports = router;