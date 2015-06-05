var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    user = require('../models/user.js'),
    test = require('../models/test.js'),
    post = require('../models/post.js'),
    sort = require('../models/sort.js'),
    sendmail = require('../models/sendMail.js');

//test数据库表名测试
router.get('/test',function(req,res){
    var t = new test({'name':"Aest"});
    t.save(function(){
        res.send('<h1>保存成功!</h1>');
    });
});

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
router.get('/socketall', function(req, res) {
    res.render('say1', {

    });
});

/* GET home page. */
router.get('/', function(req, res) {
    var page = req.query.page?parseInt(req.query.page):1;
    var recycle = req.query.recycle?parseInt(req.query.recycle):{$ne:1};
    var query = {
        "recycle":recycle,
        "page":page,
        "limit":10
    };

    //查询并返回第page页的10条记录
    post.getTenHome(query, function(err, posts,total) {
        if (err) {
            posts = [];
        }
        if(req.xhr){
            res.json({
                posts: posts,
                page:page,
                user: req.session.user,
                isFirstPage:(page-1)==0,
                isLastPage:((page-1)*10+posts.length)==total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        }else{
            res.render('index', {
                _t:'0',
                title:"时间去哪了",
                posts: posts,
                page:page,
                user: req.session.user,
                isFirstPage:(page-1)==0,
                isLastPage:((page-1)*10+posts.length)==total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }

    });
});

//首页查找文章
router.get('/search',function(req,res){
    var email;
    //email = req.session.user.email;
    var page = req.query.page?parseInt(req.query.page):1;
    var keyword = req.query.keyword;
    var recycle = req.query.recycle?parseInt(req.query.recycle):{$ne:1};
    var opt = {
        "keyword":keyword,
        "page":page,
        "pagelimit":10,
        "recycle":recycle
    };
    if(!!email){
        opt.email = email;
    }
    post.search(opt,function(err,docs,total){
        if(err){
            res.render('search',{
                "success":false,
                "msg":"搜索失败！"
            });
        }else{
            res.render('search',{
                "success":true,
                "posts":docs,
                "total":total
            });
        }
    });
});

//查看全文
router.get('/u/:_id',function(req,res){
    var _id = req.params._id;
    if(_id){
        post.getOne(_id,function(err,docs){
            if(err){
                return res.json({
                    'state':false,
                    'msg':"获取数据失败！"
                });
            }else{
                if(req.xhr){
                    res.json({
                        'state':"SUCCESS",
                        'posts':docs
                    });
                }else{
                    res.redirect('/');
                }
            }
        });
    }else{
        res.redirect('/');
    }
});

//查看评论
router.get('/getcomments/:_id',function(req,res){
    var _id = req.params._id;

    if(_id){
        post.getComment(_id,function(err,docs){
            if(err){
                res.json({
                    'state':false,
                    'msg':"获取数据失败！"
                });
            }else{
                if(req.xhr){
                    res.json({
                        'state':"SUCCESS",
                        'comments':docs[0]
                    });
                }else{
                    res.redirect('/');
                }
            }
        });
    }else{
        res.redirect('/');
    }
});
//提交评论
router.post('/getcomments/:_id',function(req,res){
    var _id = req.params._id;
    var name = req.body.name,
        email = req.body.email,
        content = req.body.content,
        codeIMG = req.body.codeIMG;
    if(name == "" || email == "" || content == "" || codeIMG == ""){
        return res.json({
            'state':false,
            'msg':"用户名/邮箱/评论内容/验证码 不能为空！"
        });
    }
    var opt = {
        name : name,
        email : email,
        content : content,
        headico : "",
        time : Date.now()
    };
    if(_id){
        post.commentSave(_id,opt,function(err,docs){
            if(err){
                res.json({
                    'state':false,
                    'msg':"获取数据失败！"
                });
            }else{
                if(req.xhr){
                    res.json({
                        'state':"SUCCESS",
                        'comment':opt
                    });
                }else{
                    res.redirect('/');
                }
            }
        });
    }else{
        res.redirect('/');
    }
});


//注册页
router.get('/reg',checkNotLogin);
router.get('/reg', function(req, res) {
    res.render('reg',{
        'title':"用户注册",
        'user': req.session.user,
        'success': req.flash('success').toString(),
        'error': req.flash('error').toString()
    });
});

//注册页提交并发激活邮件
router.post('/reg', function(req, res) {
    var password = req.body.password,
        password_r = req.body['password-repeat'],
        email = req.body.email,
        codeTxt = req.body.codeIMG;
    var time = new Date().getTime();
    var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{1,6})$/;
    //检验邮箱是否为空
    if(!email){
        req.flash('error','邮件地址不能为空！');
        return res.redirect('/reg');
    }
    if(!emailReg.test(email)){
        req.flash('error','邮件格式不正确！');
        return res.redirect('/reg');
    }
    //检验密码是否存在
    if(!password){
        req.flash('error','密码不能为空！');
        return res.redirect('/reg');
    }
    //检验用户再次输入的口令是否一致
    if(password_r != password){
        req.flash('error','两次输入的密码不一致');
        return res.redirect('/reg');
    }
    //检验验证码
    if(!req.session.codeUrl){
        req.flash('error','验证码已失效！');
        return res.redirect('/reg');
    }
    if(req.session.codeUrl != codeTxt){
        req.flash('error','验证码错误！');
        return res.redirect('/reg');
    }
    //生成口令的散列值
    var passmd5 = crypto.createHash('md5');
    password = passmd5.update(req.body.password).digest('hex');
    //var emailmd5 = crypto.createHash('md5');
    //email = emailmd5.update(req.body.password).digest('hex');
    //检查邮箱是否已存在
    user.getEmail(email,function(err,user){
        if(!!user && user.email){
            err = '该邮箱已被注册！';
        }
        if(err){
            req.flash('error',err);
            return res.redirect('/reg');
        }

        //req.session.regenerate(function(err){
            var hour = 24*60*60*1000;
            req.session.cookie.expires = new Date(Date.now() + hour);
            req.session.cookie.maxAge = hour;
            req.session.u = {
                "email": email,
                "password": password
            };
            req.session.save();

            var activationURL = "http://" + req.headers.host + "/reg/activation?uuid="+req.sessionID+"&current="+time;
            console.log(activationURL);

            var mailOptions = {
                from: "182820011@qq.com", // sender address
                to: email, // list of receivers
                subject: "新用户注册", // Subject line
                text: "新用户注册标题", // plaintext body
                html: '<a href="'+activationURL+'" target="_blank">激活地址：'+activationURL+'</a>' // html body
            };
            var smail = new sendmail(mailOptions);
            smail.send(function(error, response){
                if (error) {
                    req.flash('err', '发送失败！');
                    res.render('sendmail',{
                        err: req.flash('err').toString()
                    });
                } else {
                    req.flash('success', '发送成功！');
                    res.render('sendmail',{
                        success: req.flash('success').toString(),
                        mail:email
                    });
                }
            });
        //});
    });

});

//激活页面
router.get('/reg/activation',checkNotLogin);
router.get('/reg/activation',function(req,res){
    var uuid = req.query.uuid;
    if(uuid){
        req.sessionStore.get(uuid,function(err,sid){
            if(sid) {
                var newUser = new user({
                    email: sid.u.email,
                    password: sid.u.password
                });
                //新增用户
                newUser.save(function (err) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/reg');
                    }
                    req.session.user = newUser;
                    req.sessionStore.destroy(uuid, function () {
                        req.flash('success', '激活成功！');
                        res.render('mailactivation',{
                            success: req.flash('success').toString()
                        });
                    });
                });
            }else{
                req.flash('err','链接已失效！');
                res.render('mailactivation',{
                    err: req.flash('err').toString()
                });
            }
        });
    }else{
        res.redirect("/");
    }
});

//登录页
router.get('/login',function(req,res){
    res.render('login',{
        'title':"用户登录",
        'user': req.session.user
    });
});
router.post("/login",function(req,res){
    //生成口令散列
    var email = req.body.email;
    var password = req.body.password;
    var codetxt = req.body.codeIMG;
    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');
    if(!email){
        return res.json({"success":false,"error":"邮箱不能为空！"});
    }
    if(!password){
        return res.json({"success":false,"error":"密码不能为空！"});
    }
    if(!codetxt){
        return res.json({"success":false,"error":"验证码不能为空！"});
    }
    if(!req.session.codeUrl){
        return res.json({"success":false,"error":"验证码已失效！"});
    }
    if(req.session.codeUrl != codetxt){
        req.session.codeUrl = null;
        return res.json({"success":false,"error":"验证码错误！"});
    }
    user.get(email,function(err,user){
        if(!user){
            return res.json({"success":false,"error":"用户不存在！"});
        }
        if(user.password != password){
            return res.json({"success":false,"error":"用户密码错误！"});
        }
        req.session.user = user;
        res.json({"success":true});
        //res.redirect('/new_version');
    })
});
//退出登录
router.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/');
});

//后台管理页
router.get('/admin*',checkLogin);
router.get('/admin',function(req,res){
    res.render('admin/index',{
        'title':"后台管理",
        'user': req.session.user
    });
});

//文章列表
router.get('/admin/bloglist',function(req,res){
    var t = req.query.recycle?"del":"recycle";
    var page = req.query.page?parseInt(req.query.page):1;
    var recycle = req.query.recycle?parseInt(req.query.recycle):{$ne:1};
    var query = {
        "email":req.session.user.email,
        "recycle":recycle,
        "page":page,
        "limit":10
    };

    //查询并返回第page页的10条记录
    post.getTen(query, function(err, posts,total) {
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
            res.render('admin/bloglist', {
                "_t":t,
                "title":"后台管理",
                "posts": posts,
                "page":page,
                "user": req.session.user,
                "total":total
            });
        }

    });
});

//删除文章到回收站
router.get('/admin/blog/recycle',function(req,res){
    var email = req.session.user.email;
    var id = req.query.id;
    if(!id){
        return res.redirect('/admin/bloglist');
    }
    if(id.indexOf("|")>-1){
        id = id.split("|");
    }
    post.recycle(id,email,function(err,docs){
        if(err){
            res.redirect('/admin/bloglist');
        }else{
            res.redirect('/admin/bloglist');
        }
    })
});

//还原文章
router.get('/admin/blog/restore',function(req,res){
    var email = req.session.user.email;
    var id = req.query.id;
    if(!id){
        return res.redirect('/admin/bloglist?recycle=1');
    }
    if(id.indexOf("|")>-1){
        id = id.split("|");
    }
    post.restore(id,email,function(err,docs){
        if(err){
            res.redirect('/admin/bloglist?recycle=1');
        }else{
            res.redirect('/admin/bloglist?recycle=1');
        }
    })
});

//删除文章
router.get('/admin/blog/del',function(req,res){
    var email = req.session.user.email;
    var id = req.query.id;
    if(!id){
        return res.redirect('/admin/bloglist?recycle=1');
    }
    if(id.indexOf("|")>-1){
        id = id.split("|");
    }
    post.del(id,email,function(err,docs){
        if(err){
            res.redirect('/admin/bloglist?recycle=1');
        }else{
            res.redirect('/admin/bloglist?recycle=1');
        }
    })
});

//查找文章
router.get('/admin/blog/search',function(req,res){
    var email = req.session.user.email;
    var page = req.query.page?parseInt(req.query.page):1;
    var keyword = req.query.keyword;
    var recycle = req.query.recycle?parseInt(req.query.recycle):{$ne:1};
    var opt = {
        "keyword":keyword,
        "page":page,
        "pagelimit":10,
        "recycle":recycle
    };
    if(email){
        opt.email = email;
    }
    post.search(opt,function(err,docs,total){
        if(err){
            res.json({
                "success":false,
                "msg":"搜索失败！"
            });
        }else{
            res.json({
                "success":true,
                "posts":docs,
                "total":total
            });
        }
    });
});

//写文章
router.get('/admin/blog',function(req,res){
    sort.get(function(err,sorts){
        res.render('admin/blog',{
            'title':"后台管理",
            'user': req.session.user,
            'sorts':sorts
        });
    })
});
router.post('/admin/blog',function(req,res){
    var savePost = new post({
        email : req.body.email,
        title : req.body.title,
        sort : req.body.sort,
        time : Date.now(),
        post : req.body.post,
        digest : req.body.digest,
        pv : req.body.pv
    });
    savePost.save(function(err,data){
        //console.log(data);
        if(err){
            res.json({
                "success":false
            });
        }else{
            res.json({
                "success":true
            });
        }
    });
});

//编辑文章
router.get('/admin/blog/edit',function(req,res){
    var _id = req.query.id;
    if(_id){
        post.getOne(_id,function(err,docs){
            sort.get(function(err,sorts){
                res.render('admin/blog',{
                    'title':"后台管理",
                    'user': req.session.user,
                    'posts':docs,
                    'edit':true,
                    'sorts':sorts
                });
            });
        });
    }else{
        res.render('admin/blog',{
            'title':"后台管理",
            'user': req.session.user
        });
    }
});
router.post('/admin/blog/edit',function(req,res){
    var _id = req.body.id;
    var opt = {
        email : req.body.email,
        title : req.body.title,
        sort : req.body.sort,
        time : Date.now(),
        post : req.body.post,
        digest : req.body.digest,
        pv : req.body.pv
    };
    post.edit(_id,opt,function(err,data){
        console.log(data);
        if(err){
            res.json({
                "success":false
            });
        }else{
            res.json({
                "success":true
            });
        }
    });
});

//分类列表
router.get('/admin/sort',function(req,res){
    sort.get(function(err,sorts){
        res.render('admin/sort',{
            'title':"后台管理",
            'user': req.session.user,
            'sorts':sorts,
            'total':sorts.length
        });
    });

});
router.post('/admin/sort',function(req,res){
    var sorttxt = req.body.sort;
    var opt = {
        sorttxt:sorttxt
    };
    var saveSort = new sort(opt);
    saveSort.save(function(err,data){
        if(err){
            res.redirect('/admin/sort');
        }else{
            res.redirect('/admin/sort');
        }
    });
});
router.get('/admin/sort/del',function(req,res){
    var id = req.query.id;
    var opt = {
        _id:id
    };
    sort.del(opt,function(err,sorts){
        if(err){
            res.redirect('/admin/sort');
        }else{
            res.redirect('/admin/sort');
        }
    });

});

//忘记密码
router.get('/forgetpass', function(req, res) {
    res.render('forgetpassword',{
        'title':"找回密码"
    });
});
router.post('/forgetpass', function(req, res) {
    var email = req.body.email;
    var codeTxt = req.body.code;
    var time = new Date().getTime();
    var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{1,6})$/;
    //检验邮箱是否为空
    if(!email){
        req.flash('error','邮件地址不能为空！');
        return res.redirect('/users/forgetpass');
    }
    if(!emailReg.test(email)){
        req.flash('error','邮件格式不正确！');
        return res.redirect('/users/forgetpass');
    }
    //检验验证码
    if(!req.session.codeUrl){
        req.flash('error','验证码已失效！');
        return res.redirect('/users/forgetpass');
    }
    if(req.session.codeUrl != codeTxt){
        req.flash('error','验证码错误！');
        return res.redirect('/users/forgetpass');
    }

    //检查邮箱是否已存在
    user.getEmail(email,function(err,user){
        if(err){
            req.flash('error','邮箱对应的账户不存在！');
            return res.redirect('/users/forgetpass');
        }

        var hour = 24*60*60*1000;
        req.session.cookie.expires = new Date(Date.now() + hour);
        req.session.cookie.maxAge = hour;
        req.session.u = {
            "email": email,
            "current": time
        };
        req.session.save();

        var activationURL = "http://" + req.headers.host + "/forgetpass/activation?uuid="+req.sessionID+"&current="+time;
        console.log(activationURL);

        var mailOptions = {
            from: "182820011@qq.com", // sender address
            to: email, // list of receivers
            subject: "找回密码", // Subject line
            text: "找回密码", // plaintext body
            html: '<a href="'+activationURL+'" target="_blank">重置密码地址：'+activationURL+'</a>' // html body
        };
        var smail = new sendmail(mailOptions);
        smail.send(function(error, response){
            if (error) {
                res.json({
                    "state":false,
                    "msg":"邮件发送失败！"
                })
            } else {
                res.json({
                    "state":"SUCCESS",
                    "email":email
                })
            }
        });
    });

});
router.get('/forgetpass/activation', function(req, res) {
    var uuid = req.query.uuid;
    var current = req.query.current;

    req.sessionStore.get(uuid,function(err,sid){
        if(sid) {
            res.render('forgetpassactivation',{
                'email': sid.u.email,
                'uuid':uuid,
                'current':current
            });
        }else{
            req.flash('err','链接已失效！');
            res.render('forgetpassactivation',{
                err: req.flash('err').toString()
            });
        }
    });
});
router.post('/forgetpass/activation', function(req, res) {
    var uuid = req.body.uuid;
    var email = req.body.email;
    var p = req.body.password;
    var p1 = req.body.password1;
    if(p == "" || p1 == ""){
        return res.json({
            "state":false,
            "msg":"密码不能为空！"
        })
    }
    if(p != p1){
        return res.json({
            "state":false,
            "msg":"两次输入的密码不一致！"
        })
    }
    var md5 = crypto.createHash('md5');
    var passwordMD5 = md5.update(p).digest('hex');
    req.sessionStore.get(uuid,function(err,sid){
        if(sid && sid.u.email == email) {
            user.savePassword(email,passwordMD5,function(err){
                if(err){
                    return res.json({
                        "state":false,
                        "msg":"修改失败！"
                    })
                }
                res.json({
                    "state":"SUCCESS"
                })
            })

        }else{
            res.json({
                "state":false,
                "msg":"链接已失效!"
            })
        }
    });
});

//文章分类
router.get('/sort', function(req, res) {
    sort.get(function(err,sorts){
        res.render('sort', {
            title: "文章分类",
            user: req.session.user,
            sorts:sorts
        });
    });
});
//获取指定分类文章
router.get('/sort/:_sort', function(req, res) {
    var txt = req.params._sort;
    if(txt == "all"){
        txt = "";
    }
    post.getsort(txt,function(err,docs){
        if(err){
            return res.json({
                "state":false,
                "msg":"获取列表失败！"
            });
        }
        res.json({
            "state":"SUCCESS",
            posts:docs
        });
    });
});

//获取全部文章
router.get('/archive', function(req, res) {
    post.getArchive(function(err, posts){
        if(err){
            req.flash('error',err);
            return res.redirect('/archive',{error:err});
        }
        res.render('archive',{
            title: '所有文章列表',
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});

//获取指定文章
router.get('/article/:_id', function(req, res) {
    post.getOne(req.params._id, function(err, post){
        if(err){
            req.flash('error',err);
            return res.render('article',{
                title:"文章详情",
                error:err
            });
        }
        res.render('article',{
            title:"文章详情",
            user: req.session.user,
            "post": post
        });
    },true);
});

//生成二维码
router.get('/qrcode', function(req, res) {
    res.render('qrcode',{
        title:"二维码生成"
    });
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
