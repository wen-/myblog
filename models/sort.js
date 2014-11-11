/**
 * Created by Administrator on 14-10-24.
 */
var mongoose = require('mongoose');
var userDb = require('./Db');
//userDb.Db.on('open',function(){
    //Db.js用的是exports.Db而不是module.exports = Db所以调用是userDb.Db.on而不是userDb.on
//});

var sortSchema = new mongoose.Schema({
    sorttxt : String
}, {
    collection: 'sort'
});

//var userModel = mongoose.model('User', userSchema);//方法二就用这个
var sortModel = userDb.Db.model('sort', sortSchema);

function sort(sort) {
    this.sorttxt = sort.sorttxt;
}

//新增分类
sort.prototype.save = function(callback) {
    var sort = {
        sorttxt : this.sorttxt
    };

    var newSort = new sortModel(sort);

    newSort.save(function (err, sort) {
        if (err) {
            return callback(err);
        }
        callback(null, sort);
    });
};

//获取分类
sort.get = function(callback) {
    sortModel.find(function (err, sort) {
        if (err) {
            return callback(err);
        }
        callback(null, sort);
    });
};
//删除分类
sort.del = function(opt,callback){
    var query = {};
    query._id = opt._id;

    sortModel.remove(query,function(err,docs) {
        if (err) {
            callback(err, null);//失败返回null
        }
        callback(null, docs);//成功返回结果
    })
};

module.exports = sort;