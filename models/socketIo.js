/**
 * Created by Administrator on 2014/7/7.
 */
var usernames = {};
var numUsers = 0;
var userDatas_chat = {};
var numUsers_chat = 0;
module.exports = function(io){
    /*
    io.on('connection', function (socket) {
        socket.broadcast.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
    */

    //分支命名空间
    var door = io
        .of('/door')
        .on('connection', function (socket) {
            //socket.emit() 1对1;socket.broadcast.emit() 频道广播（自己收不到）;door.emit() 频道广播（自己也可以收到）
            socket.emit("news","hello !");

            socket.on('my other event', function (data) {
                console.log(data);
            });
            socket.on('re', function(){
                door.emit("reda","重连成功");
            });
            socket.on('disconnect', function(){
                console.log("离线了！");
                door.emit("buy","走了 ？");
            });
        });


    //分支命名空间
    var chat = io
        .of('/chat')
        .on('connection', function (socket) {
            var addedUser1 = false;
            socket.on('new message', function (data) {
                // we tell the client to execute 'new message'
                chat.emit('new message', {
                    userData: socket.userData,
                    message: data
                });
            });

            // when the client emits 'add user', this listens and executes
            socket.on('add user', function (userData) {
                // we store the username in the socket session for this client
                socket.userData = userData;
                // add the client's username to the global list
                userDatas_chat[userData] = userData;
                ++numUsers_chat;
                addedUser1 = true;

                socket.emit('login', {
                    numUsers: numUsers_chat
                });
                // echo globally (all clients) that a person has connected

                chat.emit('refresh online',{
                    userData: userDatas_chat,
                    numUsers: numUsers_chat
                });

                socket.broadcast.emit('user joined', {
                    userData: socket.userData,
                    numUsers: numUsers_chat
                });
            });

            // when the client emits 'typing', we broadcast it to others
            socket.on('typing', function () {
                socket.broadcast.emit('typing', {
                    userData: socket.userData
                });
            });

            // when the user disconnects.. perform this
            socket.on('disconnect', function () {
                // remove the username from global usernames list
                if (addedUser1) {
                    delete userDatas_chat[socket.userData.id];
                    --numUsers_chat;

                    // echo globally that this client has left
                    chat.emit('user left', {
                        userData: socket.userData,
                        numUsers: numUsers_chat
                    });
                }
            });
        });

};