/**
 * Created by geong on 2014/5/14.
 */
var xls = require('exceljs');

function codeTxt(s,n,img) {
    var t = [];
    if (!!img) {
        for (var i = 0; i < n; i++) {
            t.push(txtCode[parseInt(Math.random() * txtCodeL)]);
        }
        this.img = true;
    }else{
        for (var l = 0; l < n; l++) {
            t.push(nCode[parseInt(Math.random() * nCodeL)].toLowerCase());
        }
    }
    t = t.join('');
    this.t = t;
    s.codeUrl = t;
}

//生成静态JPEG图像
codeTxt.prototype.codeIMG = function(callb){
    var t = this.t;
    var x_x = [],y_y = [];
    for(var l=0;l<5;l++){
        x_x.push(parseInt(Math.random()*100));
        y_y.push(parseInt(Math.random()*30));
    }
    imageMagick(100, 30, "rgb(49,176,213)")
        .fill('rgba(255,255,255,0.14)')//绘制图形的填充颜色
        .drawPolyline([0,10],[100,10])//画折线
        .drawPolyline([0,15],[100,15])//画折线
        .drawPolyline([0,20],[100,20])//画折线
        .drawCircle(x_x[0], y_y[0], x_x[0]+6, y_y[0]+6)//画圆
        .drawCircle(x_x[1], y_y[1], x_x[1]+3, y_y[1]+3)//画圆
        .drawCircle(x_x[2], y_y[2], x_x[2]+6, y_y[2]+6)//画圆
        .drawCircle(x_x[3], y_y[3], x_x[3]+5, y_y[3]+5)//画圆
        .drawCircle(x_x[4], y_y[4], x_x[4]+4, y_y[4]+4)//画圆
        .font('./public/fonts/stliti.ttf', !!this.img?20:30)
        .fill('rgba(255,255,255,0.8)')
        .drawText(12, 22, t)
        .toBuffer('jpeg', function (err, stdout) {
            //var codeData = "data:jpeg;base64," + stdout.toString('base64');
            //callb({"t":t,"codeUrl":codeData});
            callb({"t":t,"codeUrl":stdout});
        });
};

//生成动态GIF图像
codeTxt.prototype.codeGIF = function(callb){
    var t = this.t;
    var x_x = [],y_y = [];
    for(var l=0;l<5;l++){
        x_x.push(parseInt(Math.random()*100));
        y_y.push(parseInt(Math.random()*30));
    }
    imageMagick(100, 30, "rgba(255,255,255,0)")
        .font('./public/fonts/stliti.ttf', !!this.img?20:30)
        .fill('rgb(0, 210, 80)')
        .drawText(12, 22, t)
        .write('./public/fonts/code.png',function (err) {
            if (err) return console.log(err);
            imageMagick(100, 30, "rgb(49,176,213)")
                .in('./public/fonts/code.png')
                .delay(1000)//延迟似乎不起作用
                .loop(20)//循环次数，默认无限
                .fill('rgba(255,255,255,0.15)')//绘制图形的填充颜色
                .drawPolyline([0,10],[100,10])//画折线
                .drawPolyline([0,15],[100,15])//画折线
                .drawPolyline([0,20],[100,20])//画折线
                .drawCircle(x_x[0], y_y[0], x_x[0]+6, y_y[0]+6)//画圆
                .drawCircle(x_x[1], y_y[1], x_x[1]+3, y_y[1]+3)//画圆
                .drawCircle(x_x[2], y_y[2], x_x[2]+6, y_y[2]+6)//画圆
                .drawCircle(x_x[3], y_y[3], x_x[3]+5, y_y[3]+5)//画圆
                .drawCircle(x_x[4], y_y[4], x_x[4]+4, y_y[4]+4)//画圆
                .toBuffer('gif', function (err, stdout) {
                    //var codeData = "data:gif;base64," + stdout.toString('base64');
                    //callb({"t": t, "codeUrl": codeData});
                    callb({"t":t,"codeUrl":stdout});
            });
        })
};

//module.exports = codeTxt;