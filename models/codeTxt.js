/**
 * Created by geong on 2014/5/14.
 */
var gm = require('gm'),
    imageMagick = gm.subClass({ imageMagick: true });
var txtCode ='的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严';
var txtCodeL = txtCode.length;
var nCode = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var nCodeL = nCode.length;

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
    //var w;
    /*
    clearTimeout(w);
    w = setTimeout(function(){
        s.codeUrl = null;
        s.save(function(err){
            if(err){console.log(err);return;}
            console.log("超时失效codeUrl,保存成功!");
        });
    },10000);
    */
    //s.save();
    //console.log(s.codeUrl);

    //return t;
}

//生成静态JPEG图像
codeTxt.prototype.codeIMG = function(callb){
    var t = this.t;
    var x_x = [],y_y = [];
    for(var l=0;l<5;l++){
        x_x.push(parseInt(Math.random()*100));
        y_y.push(parseInt(Math.random()*30));
    }
    imageMagick(100, 30, "green")
        .fill('rgba(255,255,255,0.15)')//绘制图形的填充颜色
        .drawPolyline([0,10],[100,10])//画折线
        .drawPolyline([0,15],[100,15])//画折线
        .drawPolyline([0,20],[100,20])//画折线
        .drawCircle(x_x[0], y_y[0], x_x[0]+6, y_y[0]+6)//画圆
        .drawCircle(x_x[1], y_y[1], x_x[1]+3, y_y[1]+3)//画圆
        .drawCircle(x_x[2], y_y[2], x_x[2]+6, y_y[2]+6)//画圆
        .drawCircle(x_x[3], y_y[3], x_x[3]+5, y_y[3]+5)//画圆
        .drawCircle(x_x[4], y_y[4], x_x[4]+4, y_y[4]+4)//画圆
        .font('./public/fonts/stliti.ttf', !!this.img?20:30)
        .fill('rgba(255,255,255,0.4)')
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
            imageMagick(100, 30, "green")
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

module.exports = codeTxt;