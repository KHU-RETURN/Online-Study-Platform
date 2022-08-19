var socket = io();
var messages = document.getElementById("messages");

chatLoad();

$('#chatSend').on('submit', function (e) {
    if ($("#message").val() != "") {
        socket.emit("chat message", userId, $("#message").val(), groupId);
        $('#message').val('');
        $('#message').focus();
        setTimeout(() => { chatRefresh(); }, 100);
    }
    e.preventDefault();
});

socket.on('received', function (msg) {
    chatRefresh();
});

function chatLoad() {
    fetch("/api/get_chat")
        .then((response) => response.json())
        .then((response) => {
            var messages = document.getElementById("messages");
            messages.innerHTML = "";
            const userId = response[0].id;
            response.splice(0, 1);
            response.forEach((element, index) => {
                if (userId === element.id) {
                    // owner이름과 같으면 이미지 오른쪽에 생성
                    let chat = `<div class="chat_message"><div class="chat_right"><span class="message">${element.message}</span><span class="photo"><img id="circle" src="data:image/png;base64, ${element.profileImage}"></span></div></div>`;
                    messages.innerHTML += chat;
                  } else {
                    // 다르면 왼쪽에 생성
                    let chat = `<div class="chat_message">${element.name}<div class="chat_left"><span class="photo"><img id="circle" src="data:image/png;base64, ${element.profileImage}"></span><span class="message">${element.message}</span></div></div>`;
                    // 이미지 넣는 코드는 chat.js에서 가져왔움
                    messages.innerHTML += chat;
                  }
                // messages.innerHTML += `<div id=${element.date}><img id="circle" src="data:image/png;base64, ${element.profileImage}">${element.name}</div>`;
                // messages.innerHTML += `<div id=${element.date}>${element.message}</div>`;
                // messages.innerHTML += `<br>`;
                if(index+1 === response.length) messages.scrollTop = messages.scrollHeight;
            })
            
        });
}

function chatRefresh() {
    fetch("/api/get_chat")
        .then((response) => response.json())
        .then((response) => {
            var messages = document.getElementById("messages");
            var element = response[response.length - 1];
            const userId = response[0].id;
            response.splice(0, 1);
            if (userId === element.id) {
                // owner이름과 같으면 이미지 오른쪽에 생성
                let chat = `<div class="chat_message"><div class="chat_right"><span class="message">${element.message}</span><span class="photo"><img id="circle" src="data:image/png;base64, ${element.profileImage}"></span></div></div>`;
                messages.innerHTML += chat;
              } else {
                // 다르면 왼쪽에 생성
                let chat = `<div class="chat_message">${element.name}<div class="chat_left"><span class="photo"><img id="circle" src="data:image/png;base64, ${element.profileImage}"></span><span class="message">${element.message}</span></div></div>`;
                // 이미지 넣는 코드는 chat.js에서 가져왔움
                messages.innerHTML += chat;
              }
            messages.scrollTop = messages.scrollHeight;
        });
}
