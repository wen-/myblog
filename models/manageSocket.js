/**
 * Created by Administrator on 14-12-31.
 */
var io1 = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
setInterval(function(){
    io1.of('/chat').emit('postmsg', {
        userData: {"nickname":"管理员"},
        message: "系统广播",
        time: new Date().getTime()
    });
    io1.of('/door').emit('postmsg', {
        userData: {"nickname":"管理员"},
        message: "系统广播",
        time: new Date().getTime()
    });
}, 5000);
