var mongoose = require('mongoose');
var commentDb = require('./Db');

var commentSchema = new mongoose.Schema({
    name : String,
    email : String,
    content : String,
    headico : String,
    time : String
}, {
    collection: 'posts'
});

var commentModel = commentDb.Db.model('comment', commentSchema);

function comment(_id, opt) {
    this._id = _id;
    this.name = opt.name;
    this.headico = opt.headico;
    this.email = opt.email;
    this.time = opt.time;
    this.content = opt.content;
}

module.exports = comment;

comment.prototype.save = function(callback) {

    var _id = this._id;
    var data = {
        name : this.name,
        email : this.email,
        content : this.content,
        headico : this.headico,
        time : this.time
    };

    /*
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //通过_id查找文档，并把一条留言添加到该文档的 comments 数组里
            collection.findAndModify({"_id":new ObjectID(_id)}
                , {'time':-1}
                , {$push:{"comments":comment}}
                , {new: true}
                , function (err,comment) {
                    mongodb.close();
                    callback(comment);
                });
        });
    });
    */
};
/*
Comment.getComments = function(_id,callback) {
    if(_id.length != 24) return;
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //通过_id查找文档，返回评论数
            collection.findOne({"_id": new ObjectID(_id)},{"comments":1},function (err, doc) {
                mongodb.close();
                if (err) {
                    callback(err);
                }
                //解析 markdown 为 html
                if(doc.comments){
                    doc.comments.forEach(function(comment){
                        comment.content = markdown.toHTML(comment.content);
                    });
                }
                callback(doc);//返回特定查询的文章
            });
        });
    });
};
*/