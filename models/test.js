/**
 * Created by Administrator on 14-10-24.
 * 数据库表名测试：collection选项会覆盖model定义的表名
 */
var mongoose = require('mongoose');
var userDb = require('./Db');
//userDb.Db.on('open',function(){
    //Db.js用的是exports.Db而不是module.exports = Db所以调用是userDb.Db.on而不是userDb.on
//});

var userSchema = new mongoose.Schema({
    name : String
}, {
    collection: 'ABC' //此处的表名会取代Aest
});

//var userModel = mongoose.model('User', userSchema);//方法二就用这个
var userModel = userDb.Db.model('Aest', userSchema);

function user(user) {
    this.name = user.name;
}

//保存用户信息
user.prototype.save = function(callback) {
    var user = {
        name : this.name
    };

    var newUser = new userModel(user);

    newUser.save(function (err, user) {
        if (err) {
            return callback(err);
        }
        callback(null, user);
    });
};

module.exports = user;