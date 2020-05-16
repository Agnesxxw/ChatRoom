/*app.js*/
var app = require('http').createServer()
var io = require('socket.io')(app);
var PORT = 8081;
/* define the login user */
var users = [];

app.listen(PORT);
io.on('connection', function (socket) {

    var isNewPerson = true;
    /* current login user */
    var username = null;
    /* watch the login */
    socket.on('login',function(data){
        for(var i = 0; i < users.length; i++){
            if(users[i].username === data.username){
                isNewPerson = false
                break;
            }else{
                isNewPerson = true
            }
        }
        if(isNewPerson){
            username = data.username
            users.push({
                username:data.username
            })
            /* successful login */
            socket.emit('loginSuccess',data)
            /* broadcast the add event to all clients */
            io.sockets.emit('add',data)
        }else{
            /* login fail */
            socket.emit('loginFail','')
        }
    })
    /* broadcast the leave event*/
    socket.on('disconnect', function () {
        io.sockets.emit('leave', username);
        users.map(function (val, index) {
            if(val.username === username){
                users.splice(index, 1); // delete the username from the users list
            }
        })
    })
   socket.on('sendMsg', function (data) {
        io.sockets.emit('receiveMsg',data)
   })


})

console.log('app listen at ' + PORT);