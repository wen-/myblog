/**
 * Created by Administrator on 14-10-24.
 */
var mongoose = require('mongoose');
var imDb = require('./Db');
//userDb.Db.on('open',function(){
    //Db.js用的是exports.Db而不是module.exports = Db所以调用是userDb.Db.on而不是userDb.on
//});

var userSchema = new mongoose.Schema({
    password : String,
    email : String,
    activate : Number
}, {
    collection: 'ims'
});
//userSchema.path('activate',Number);
//var userModel = mongoose.model('User', userSchema);//方法二就用这个
var imModel = imDb.Db.model('im', userSchema);

function im(opt) {
    this.password = opt.password;
    this.email = opt.email;
    this.activate = opt.activate;
}

//保存用户信息
im.prototype.save = function(callback) {
    var user = {
        password : this.password,
        email : this.email,
        activate : this.activate
    };

    var newUser = new imModel(user);
    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

//查找指定数量用户
im.getTen = function(opt,callback){
    imModel.count(function(err,total){
        imModel.find(null,"-password",{skip:(opt.page-1)*opt.limit,limit:opt.limit},function(err,docs) {
            if (err) {
                return callback(err, null);//失败返回null
            }
            callback(null, docs, total);//成功返回结果
        })
    })
};
//获取用户信息
im.get = function(email, callback) {
    imModel.findOne({"email": email}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

//更新用户密码信息
im.savePassword = function(email,password,callback){
    //更新密码信息
    imModel.update({"email":email},{"password":password},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};

//更新状态
im.activateIM = function(aid,state,callback){
    //更新密码信息
    imModel.update({"_id":aid},{"activate":state},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};

//更新用户邮箱信息
/*
im.saveEmail = function(email,callback){
    //更新邮箱信息
    imModel.update({"email":email},{"email":email},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};
*/

//获取邮箱信息
im.getEmail = function(email,callback){
    imModel.findOne({"email":email},function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

module.exports = im;