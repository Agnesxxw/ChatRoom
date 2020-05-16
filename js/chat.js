
$(function(){
    /* establish the socket connection, using webSocket */
    var socket = io('ws://localhost:8081');
    /* define the username*/
    var uname = null;

    /* login */
    $('.login-btn').click(function(){
        uname = $.trim($('#loginName').val());
        if(uname){
            /* send login event to the server */
            socket.emit('login',{username:uname})
        }else{
            alert('Please enter username: ')
        }
    })

    /* login successfully*/
    socket.on('loginSuccess',function(data){
        if(data.username === uname){
            checkin(data)
        }else{
            alert('Please retry, username does not match');
        }
    })

    /* login fails*/
    socket.on('loginFail',function(){
        alert('Repeated username')
    })

    /* new user warning */
    socket.on('add',function(data){
        var html = '<p>System Info: '+data.username+' successfully join the group</p>';
        $('.chat-con').append(html);
    })

    /* hid the login page and show the chat page */
    function checkin(data){
        $('.login-wrapper').hide('slow');
        $('.chatroom-wrapper').show('slow');
    }
    socket.on('leave', function (name) {
        if(name != null){
            var html = '<p> System Info: ' + name + ' exited the group</p>'
            $('.chat-con').append(html);
        }
    })
    $('.send-btn').click(function () {
        sendMsg()
    });
    $(document).keydown(function(event){
        if(event.keyCode == 13){ // send the msg when pressing the enter
            sendMsg()
        }
    })
    function sendMsg() {
        var text = $('#sendtext').val();
        $('#sendtext').val(''); // reset the text after (reading)sending the msg
        if(text){
            socket.emit('sendMsg',{username:uname, message:text})
        }
    }
    socket.on('receiveMsg',function (data) {
        showMsg(data)
    })
    function showMsg(data) {
        var html
        if(data.username === uname){
            html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">' +data.message+'</span></div>';//msg sent by the user
        } else {
            html = '<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username+'</span><span class="img fl"></span><span class="fl message">'+data.message+'</span></div>' // msg from others
        }
        $('.chat-con').append(html);
    }
})