/**
 * Created by Administrator on 2014/7/7.
 */
var usernames = {};
var numUsers = 0;
var userDatas_chat = {};
var numUsers_chat = 0;

var userList = {};
var userN = 0;
var prefix = "sk";
var prefix_n = 1;
var group = "";
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
            socket.on('postmsg', function (data,fn) {
                // we tell the client to execute 'new message'
                if(data.gid) {
                    socket.broadcast.to(data.gid).emit('postmsg', {
                        userData: socket.userData,
                        message: data.msg,
                        gid:data.gid,
                        title:data.title,
                        time: new Date().getTime()
                    });
                }else{
                    if(data.from){
                        //socket.join("abc");
                        socket.broadcast.to(data.to.id).emit(data.to.uid, {
                            userData: socket.userData,
                            from: socket.userData,
                            to:userList[data.to.uid],
                            message: data.msg,
                            time: new Date().getTime()
                        });
                    }else{
                        socket.broadcast.emit('postmsg', {
                            userData: socket.userData,
                            message: data.msg,
                            time: new Date().getTime()
                        });
                    }
                }
                fn();
            });

            // when the client emits 'add user', this listens and executes
            socket.on('goin', function (userData) {
                if(userData.nickname){
                    userData.uid = prefix + prefix_n;
                    userData.id = socket.id;
                    userList[userData.uid] = userData;
                    prefix_n++;
                    userN++;

                    // we store the username in the socket session for this client
                    socket.userData = userData;
                    // add the client's username to the global list
                    //userDatas_chat[userData] = userData;
                    //++numUsers_chat;
                    addedUser1 = true;

                    socket.emit('login', {
                        num: userN,
                        userData:userData
                    });
                    // echo globally (all clients) that a person has connected

                    chat.emit('refreshOnline',userList);

                    socket.broadcast.emit('userJoined',userData);
                }
            });

            // when the client emits 'typing', we broadcast it to others
            socket.on('typing', function () {
                socket.broadcast.emit('typing', {
                    userData: socket.userData
                });
            });

            //新建讨论组
            socket.on('newgroup',function(data,fn){
                //socket.join("abc");
                var groupname = 'group'+new Date().getTime();
                var l=data.member.length;
                for(var i=0;i<l;i++){
                    var id = data.member[i].id;
                    chat.connected[id].join(groupname);
                }
                socket.broadcast.to(groupname).emit('newgroup', {
                    master:socket.userData,
                    title: data.title,
                    member: data.member,
                    gid:groupname,
                    time: new Date().getTime()
                });
                fn({
                    title: data.title,
                    member: data.member,
                    gid:groupname,
                    time: new Date().getTime()
                });
            });

            // when the user disconnects.. perform this
            socket.on('disconnect', function () {
                // remove the username from global usernames list
                if (addedUser1) {
                    //delete userDatas_chat[socket.userData.id];
                    //--numUsers_chat;

                    delete userList[socket.userData.uid];
                    --userN;
                    // echo globally that this client has left
                    chat.emit('left', {
                        userData: socket.userData,
                        num: userN
                    });
                }
            });
        });

};