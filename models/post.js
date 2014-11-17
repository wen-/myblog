/**
 * Created by Administrator on 14-10-24.
 */
var mongoose = require('mongoose');
var postDb = require('./Db');
//userDb.Db.on('open',function(){
    //Db.js用的是exports.Db而不是module.exports = Db所以调用是userDb.Db.on而不是userDb.on
//});

var commentSchema = new mongoose.Schema({
    name : String,
    email : String,
    content : String,
    headico : String,
    time : String
});

var postSchema = new mongoose.Schema({
    name : String,
    headico : String,
    email : String,
    title : String,
    sort : String,
    time : String,
    post : String,
    digest : String,
    pv : Number,
    comments : [commentSchema],
    recycle : 0
}, {
    collection: 'posts'
});

//var userModel = mongoose.model('User', userSchema);//方法二就用这个
var postModel = postDb.Db.model('post', postSchema);

function post(opt) {
    this.name = opt.name;
    this.headico = opt.headico;
    this.email = opt.email;
    this.title = opt.title;
    this.sort = opt.sort;
    this.time = opt.time;
    this.post = opt.post;
    this.digest = opt.digest;
    this.pv = opt.pv;
    this.comments = opt.comments;
    this.recycle = 0;
}

//保存文章
post.prototype.save = function(callback) {
    var post = {
        name : this.name,
        headico : this.headico,
        email : this.email,
        title : this.title,
        sort : this.sort,
        time : this.time,
        post : this.post,
        digest : this.digest,
        pv : this.pv,
        comments : this.comments,
        recycle : this.recycle
    };

    var newPost = new postModel(post);

    newPost.save(function (err, post) {
        if (err) {
            return callback(err);
        }
        callback(null, post);
    });
};

//查找指定数量文章
post.getTen = function(opt,callback){//opt:email,page,pagelimit
    var query = {};
    if(opt.email){
        query.email = opt.email;
    }
    query.recycle = opt.recycle;//{$exists:false};
    postModel.count(query,function(err,total){
        postModel.find(query,"-digest -email -pv -comments -post",{skip:(opt.page-1)*opt.limit,limit:opt.limit,sort:{time:-1}},function(err,docs) {
            if (err) {
                return callback(err, null);//失败返回null
            }
            //postModel.update({"_id": {"$in": look}}, {$inc: {"pv": 1}}, {"multi": true});
            callback(null, docs, total);//成功返回结果
        })
    })
};
//查找指定数量文章
post.getTenHome = function(opt,callback){//opt:email,page,pagelimit
    var query = {};
    if(opt.email){
        query.email = opt.email;
    }
    query.recycle = opt.recycle;//{$exists:false};
    postModel.count(query,function(err,total){
        postModel.find(query,"-post",{skip:(opt.page-1)*opt.limit,limit:opt.limit,sort:{time:-1}},function(err,docs) {
            if (err) {
                return callback(err, null);//失败返回null
            }
            docs.forEach(function(doc){
                if(doc.comments){
                    doc._doc.commentstotal = doc.comments.length;
                    //doc.comments = doc.comments.slice(0,10);
                    doc.comments = [];
                }else{
                    doc.comments = 0;
                    doc._doc.commentstotal = 0;
                }
            });
            //postModel.update({"_id": {"$in": look}}, {$inc: {"pv": 1}}, {"multi": true});
            callback(null, docs, total);//成功返回结果
        })
    })
};

//查找一篇文章
post.getOne = function(id,callback){
    var query = {};
    if(id){
        query._id = id;
    }
    postModel.findOne(query,function(err,docs) {
        if (err) {
            return callback(err, null);//失败返回null
        }
        docs.pv = docs.pv+1;
        docs.save(function(err,docs){
            callback(null, docs);//成功返回结果
        });

    })
};

//文章放到回收站
post.recycle = function(id,email,callback){
    var query = {};
    if(typeof(id) != "string"){
        var ids = [];
        id.forEach(function (_id) {
            var o = {};
            o._id = _id;
            o.email = email;
            ids.push(o);
        });
        query.$or = ids;
    }else{
        query._id = id;
        query.email = email;
    }
    postModel.update(query,{"recycle":1},{multi:true},function(err,docs) {
        if (err) {
            return callback(err, null);//失败返回null
        }
        callback(null, docs);//成功返回结果
    })
};
//文章还原
post.restore = function(id,email,callback){
    var query = {};
    if(typeof(id) != "string"){
        var ids = [];
        id.forEach(function (_id) {
            var o = {};
            o._id = _id;
            o.email = email;
            ids.push(o);
        });
        query.$or = ids;
    }else{
        query._id = id;
        query.email = email;
    }
    postModel.update(query,{"recycle":0},{multi:true},function(err,docs) {
        if (err) {
            return callback(err, null);//失败返回null
        }
        callback(null, docs);//成功返回结果
    })
};

//删除文章
post.del = function(id,email,callback){
    var query = {};
    if(typeof(id) != "string"){
        var ids = [];
        id.forEach(function (_id) {
            var o = {};
            o._id = _id;
            o.email = email;
            ids.push(o);
        });
        query.$or = ids;
    }else{
        query._id = id;
        query.email = email;
    }
    postModel.remove(query,function(err,docs) {
        if (err) {
            return callback(err, null);//失败返回null
        }
        callback(null, docs);//成功返回结果
    })
};

//文章编辑
post.edit = function(id,opt,callback){
    var query = {};
    query._id = id;
    query.email = opt.email;
    var posts = {
        email : opt.email,
        title : opt.title,
        sort : opt.sort,
        time : opt.time,
        post : opt.post,
        digest : opt.digest,
        pv : opt.pv
    };

    postModel.update(query,posts,function(err,docs) {
        if (err) {
            return callback(err, null);//失败返回null
        }
        callback(null, docs);//成功返回结果
    })
};

//文章列表搜索
post.search = function(opt,callback){
    var query = {};
    var pattern = new RegExp("^.*"+opt.keyword+".*$", "i");
    if(opt.keyword){
        query.title = pattern;
    }
    if(opt.email){
        query.email = opt.email;
    }

    query.recycle = opt.recycle;
    postModel.count(query,function(err,total){
        postModel.find(query,"-digest -email -pv -comments -post",{skip:(opt.page-1)*opt.pagelimit,limit:opt.pagelimit,sort:{time:-1}},function(err,docs) {
            if (err) {
                return callback(err, null);//失败返回null
            }
            //postModel.update({"_id": {"$in": look}}, {$inc: {"pv": 1}}, {"multi": true});
            callback(null, docs, total);//成功返回结果
        })
    })
};

//获取评论
post.getComment = function(id,callback){
    var query = {};
    if(id){
        query._id = id;
    }
    postModel.find(query,"comments",{sort:{time:-1}},function(err,docs) {
        if (err) {
            return callback(err, null);//失败返回null
        }
        //postModel.update({"_id": {"$in": look}}, {$inc: {"pv": 1}}, {"multi": true});
        callback(null, docs);//成功返回结果
    })
};

//保存评论
post.commentSave = function(id,opt,callback) {
    var query = {};
    if(id){
        query._id = id;
    }
    postModel.update(query,{'$push':{"comments":opt}},function(err,docs) {
        if(err){
            return callback(err,null);
        }else{
            callback(null,docs);
        }

    })
};

//获取分类文章
post.getsort = function(txt,callback){
    var query = {};
    if(txt){
        query.sort = txt;
    }
    query.recycle = {$ne:1};
    postModel.count(query,function(err,total){
        postModel.find(query,"-digest -email -pv -comments -post",{sort:{sort:1,time:-1}},function(err,docs) {
            if (err) {
                return callback(err, null);//失败返回null
            }
            //postModel.update({"_id": {"$in": look}}, {$inc: {"pv": 1}}, {"multi": true});
            callback(null, docs, total);//成功返回结果
        })
    })
};

//获取全部文章
post.getArchive = function(callback){
    var query = {};
    query.recycle = {$ne:1};
    postModel.count(query,function(err,total){
        postModel.find(query,"-digest -email -pv -comments -post",{sort:{time:-1}},function(err,docs) {
            if (err) {
                return callback(err, null);//失败返回null
            }
            //postModel.update({"_id": {"$in": look}}, {$inc: {"pv": 1}}, {"multi": true});
            callback(null, docs, total);//成功返回结果
        })
    })
};

//更新邮箱
post.udemail = function(email,newemail,callback){
    var query = {};
    query.email = email;
    postModel.update(query,{"email":newemail},{multi:true},function(err,docs) {
        if (err) {
            return callback(err, null);//失败返回null
        }
        callback(null, docs);//成功返回结果
    });
};





module.exports = post;