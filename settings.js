/**
 * Created with JetBrains WebStorm.
 * User: geong
 * Date: 13-6-27
 * Time: 上午9:42
 * To change this template use File | Settings | File Templates.
 */
var isDev = true;
module.exports = {
    cookieSecret: 'myblog'
    ,database: isDev ? 'myblog' : 'bae mongdb database'
    ,host: isDev ? 'localhost' : 'mongo.duapp.com'
    ,port: isDev ? '27017' : '8908'
    ,user: isDev ? '' : 'bae api key'
    ,pass: isDev ? '' : 'bae api secret'
};