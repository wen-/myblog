var compression = require('compression');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');
var fs = require("fs");
var routes = require('./routes/index');
var users = require('./routes/users');
var code = require('./routes/code');
var upload = require('./routes/upload');
var conf = require('./routes/conf');

//后台发请求测试
//var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('codelength',1);

app.use(compression());//启用压缩

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.text({limit:1024000}));//post内容不超过1000kb
app.use(bodyParser.json({limit:1024000}));//post内容不超过1000kb
app.use(bodyParser.urlencoded({ extended: false,limit:1024000 }));//post内容不超过1000kb
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload/blog',multer({
    dest: './public/uploads/blog',
    limits: {
        fileSize: 500000 //500k
    },
    onFileUploadStart: function (file) {
        var allowSuffix = "jpg,bmp,gif,png,jpeg";
        if (allowSuffix.indexOf(file.extension) < 0){
            return false;
        }
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    },
    rename: function (fieldname, filename) {
        var date = new Date().getDate()<10?"0"+""+new Date().getDate():new Date().getDate();
        return "blog_"+new Date().getFullYear()+""+(new Date().getMonth()+1)+""+date+"_" + Date.now();
    },
    onFileSizeLimit: function (file) {
        fs.unlink('./' + file.path); // 删除超过指定大小的文件，此时truncated为true
    }
}));

app.use('/users/headico',multer({
    dest: './public/uploads/headico',
    limits: {
        fileSize: 1000000 //2M
    },
    onFileUploadStart: function (file) {
        var allowSuffix = "jpg,bmp,gif,png,jpeg";
        if (allowSuffix.indexOf(file.extension) < 0){
            return false;
        }
    },
    onFileUploadData: function (file, data, req, res) {
        //console.log(data.length + ' of ' + file.fieldname + ' arrived')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    },
    rename: function (fieldname, filename) {
        var date = new Date().getDate()<10?"0"+""+new Date().getDate():new Date().getDate();
        return "blog_"+new Date().getFullYear()+""+(new Date().getMonth()+1)+""+date+"_" + Date.now();
    },
    onFileSizeLimit: function (file) {
        fs.unlink('./' + file.path); // 删除超过指定大小的文件，此时truncated为true
    }
}));

app.use(flash());

//提供session支持
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.database
        ,host: settings.host
        ,port: settings.port
        ,user: settings.user
        ,pass: settings.pass
    }),
    cookie:{
        //secure: true//加密，将导致每个请都生成一个新的session,在做验证码是不适用
        maxAge:1800000
        //等同于上面,expires:new Date(Date.now() + 1800000)
    }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/code', code);
app.use('/upload', upload);
app.use('/conf', conf);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/**发请求测试
var abc = {
    hostname: 'wap.muzhiwan',
    port: 80,
    path: '/search/testremote',
    method: 'GET'
    //method: 'POST',
    //headers: {
    //    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //}
};
var req = http.request(abc,function(res){
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
});
req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

req.end();
*/

module.exports = app;
