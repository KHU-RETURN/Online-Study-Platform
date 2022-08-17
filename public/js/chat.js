var socket = io();
var messages = document.getElementById("messages");

chatLoad();

$('#chatSend').on('submit', function (e) {
    socket.emit("chat message", userId, $("#message").val(), groupId);
    $('#message').val('');
    $('#message').focus();
    setTimeout(() => { chatRefresh(); }, 100);
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
            response.forEach((element) => {
                fetch("/api/get_user/"+element.id)
                .then((response2) => response2.json())
                .then((response2) =>{
                    messages.innerHTML += `<div id=${element.date}><img id="circle" src="data:image/png;base64, ${response2.photos}">    ${response2.displayName}</div>`;
                    messages.innerHTML += `<div id=${element.date}>${element.message}</div>`;
                    messages.innerHTML += `<br>`;
                    if(messages.getElementsByTagName("div").length/2 === response.length) messages.scrollTop = messages.scrollHeight;
                })
            })
            
        });
}

function chatRefresh() {
    fetch("/api/get_chat")
        .then((response) => response.json())
        .then((response) => {
            var messages = document.getElementById("messages");
            var element = response[response.length - 1];
            fetch("/api/get_user/"+element.id)
                .then((response2) => response2.json())
                .then((response2) =>{
                    messages.innerHTML += `<div id=${element.date}><img id="circle" src="data:image/png;base64, ${response2.photos}">   ${response2.displayName}</div>`;
                    messages.innerHTML += `<div id=${element.date}>${element.message}</div>`;
                    messages.innerHTML += `<br>`;
                    messages.scrollTop = messages.scrollHeight;
                })
        });
}
