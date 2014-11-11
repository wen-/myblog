/**
 * Created by Administrator on 14-10-24.
 */
var mongoose = require('mongoose');
var userDb = require('./Db');
//userDb.Db.on('open',function(){
    //Db.js用的是exports.Db而不是module.exports = Db所以调用是userDb.Db.on而不是userDb.on
//});

var userSchema = new mongoose.Schema({
    name : String,
    password : String,
    email : String,
    headIco : String,
    basicData : {} ,
    educationData : {} ,
    workData : {}
}, {
    collection: 'users'
});

//var userModel = mongoose.model('User', userSchema);//方法二就用这个
var userModel = userDb.Db.model('user', userSchema);

function user(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.headIco = user.headIco;
    this.basicData = user.basicData;
    this.educationData = user.educationData;
    this.workData = user.workData;
}

//保存用户信息
user.prototype.save = function(callback) {
    var user = {
        name : this.name,
        password : this.password,
        email : this.email,
        headIco : this.headIco ,
        basicData : this.basicData ,
        educationData : this.educationData ,
        workData : this.workData
    };

    var newUser = new userModel(user);

    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

//获取用户信息
user.get = function(email, callback) {
    userModel.findOne({"email": email}, function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

//更新用户基本信息
user.saveBasicData = function(email,basicData,callback){
    //更新基本资料
    userModel.update({"email":email},{"basicData":basicData},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};

//更新用户教育信息
user.saveEducationData = function(email,educationData,callback){
    //更新教育信息
    userModel.update({"email":email},{"educationData":educationData},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};

//更新用户工作信息
user.saveWorkData = function(email,workData,callback){
    //更新工作信息
    userModel.update({"email":email},{"workData":workData},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};

//更新用户头像信息
user.saveHead = function(email,headIco,callback){
    //更新头像信息
    userModel.update({"email":email},{"headIco":headIco},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};

//更新用户密码信息
user.savePassword = function(email,password,callback){
    //更新密码信息
    userModel.update({"email":email},{"password":password},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};

//更新用户邮箱信息
/*
user.saveEmail = function(email,callback){
    //更新邮箱信息
    userModel.update({"email":email},{"email":email},function(err){
        if(err){
            callback(err);//失败返回出错信息
        }else{
            callback(null);//成功返回结果
        }
    });
};
*/

//获取邮箱信息
user.getEmail = function(email,callback){
    userModel.findOne({"email":email},function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};


/*
var uu = {
    "name" : "小f",
    "password" : "123456",
    "email" : "yellowwen@126.com"
};
mongoose.on('open',function(){

    var ua = new user(uu);
    ua.save(function(err,user){
        if(err){
            console.log("保存出错！");
            return false;
        }else{
            console.log("保存成功---"+user);
        }
    });

});
*/
module.exports = user;