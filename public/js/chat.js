var socket = io();
var messages = document.getElementById("messages");
const chatting = document.getElementById("chatting");
var chatting_list;
var confId = getParameter("id");

let _startTime;

chatLoad();
meetingLoad();

window.addEventListener("beforeunload", (event) => {
  if (_startTime) {
    event.preventDefault();
    event.returnValue = "";
  }
});

var toolbarOptions = [
  //toolbar 원하는 것 넣기
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ list: "ordered" }, { list: "bullet" }],

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  ["link", "image"],
];

$("#chatSend").on("submit", function (e) {
  if ($("#message").val() != "") {
    socket.emit("chat message", userId, $("#message").val(), groupId);
    $("#message").val("");
    $("#message").focus();
    setTimeout(() => {
      chatRefresh();
    }, 100);
  }
  e.preventDefault();
});

socket.on("received", function (msg) {
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
        if (index + 1 === response.length)
          messages.scrollTop = messages.scrollHeight;
      });
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

function meetingLoad() {
  // console.log(groupId, confId);
  var quill = new Quill("#editor", {
    modules: {
      toolbar: toolbarOptions,
    },
    theme: "snow",
  });

  // 시작하기 버튼을 누르지 않았을 때
  quill.enable(false);
  $("#editor").click(function () {
    if (!_startTime) {
      alert("'시작하기' 버튼을 눌러 회의를 시작해주세요.");
    }
  });

  // 시작하기 버튼을 눌렀을 때 회의 시작시간 저장
  document
    .querySelector("#start_button")
    .addEventListener("click", function () {
      startMeeting(quill);
    });
}

// 회의 시작 시간 저장
function startMeeting(quill) {
  if (!_startTime) {
    alert("회의를 시작합니다. (채팅도 저장소에서 확인할 수 있습니다.)");
    quill.enable();
    _startTime = new Date();
    document.querySelector("#start_button").textContent = "저장하기";
    document.querySelector(".toggle_button").setAttribute("id", "save_button");
    $("#save_button").click(function () {
      saveMeeting(quill.getContents());
    });
  }
}

function saveMeeting(record_body) {
  var _title = $("#meeting_title").val();
  var _endTime = new Date(); // 채팅 확인을 위한 회의 종료 시간 기록

  fetch("/api/add_conference/", {
    //api 수정
    method: "POST",
    body: JSON.stringify({
      title: _title,
      startTime: _startTime,
      endTime: _endTime,
      record: record_body,
    }),
    headers: {
      "content-type": "application/json;charset=utf-8",
    },
  }).then(() => {
    _startTime = 0;
    location.reload();
  });
}

function getParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
