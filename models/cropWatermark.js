var fs = require("fs"),
    path = require("path"),
    gm = require('gm'),
    imageMagick = gm.subClass({ imageMagick: true });

function cropWatermark(opt){
    this.w = opt.w;
    this.h = opt.h;
    this.x1 = opt.x1;
    this.y1 = opt.y1;
    this.x2 = opt.x2;
    this.y2 = opt.y2;
    this.tx = opt.tx;
    this.ty = opt.ty;
    this.tmp_path = opt.tmp_path;
};

cropWatermark.prototype.cw = function(callb){
    imageMagick(this.tmp_path)
    .crop(this.w, this.h,this.x1,this.y1)
    .font('./public/fonts/stliti.ttf',50)
    .fill('rgba(255,255,255,0.3)')
    .drawText(this.tx,this.ty, '岁月')
    .write(this.tmp_path,function(err){
        if(err){
            console.log(err);
            return false;
        }
        callb();
    });
};

module.exports = cropWatermark;