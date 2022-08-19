const chatting = document.getElementById("chatting");
var chatting_list;
init();

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

function init() {
  const title = getParameter("title");
  const date = getParameter("date");
  document.querySelector("#title").textContent = title;
  document.querySelector("#date").textContent = date + " - ";
  // console.log(title, date);
  fetch("http://localhost:5000/conference?title=" + title + "&date=" + date)
    //title, date
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      // 넘어온 데이터 넘겨주기
      loadData(data[0]);
    });
}

function loadData(data) {
  // editor 생성
  var quill = new Quill("#editor", {
    modules: {
      toolbar: toolbarOptions,
    },
    theme: "snow",
  });
  document.querySelector(".ql-toolbar").style.display = "none";
  quill.enable(false); //보기만 가능 (viewer)

  quill.setContents(JSON.parse(JSON.stringify(data.record)));
  document
    .querySelector("#modify_contents_button")
    .addEventListener("click", function () {
      editData(quill);
    });
  chatting_list = data.chat; // 채팅 부분
  fetch("http://localhost:5000/users")
    //title, date
    .then((response) => response.json())
    .then((data2) => {
      // console.log(data2[0]); //user 정보
      // console.log(chatting_list);
      chatting_list.forEach((element) => {
        // 불러온 데이터 시간순 아니면 -> 정렬하는 부분 추가
        if (data2[0].displayName === element.displayName) {
          // owner이름과 같으면 이미지 오른쪽에 생성
          let chat = `<div class="chat_right"><span class="message">${element.message}</span><span class="photo"><img id="circle" src="data:image/png;base64, ${element.photos}"></span></div>`;
          chatting.innerHTML += chat;
        } else {
          // 다르면 왼쪽에 생성
          let chat = `<div class="chat_left"><span class="photo"><img id="circle" src="data:image/png;base64, ${element.photos}"></span><span class="message">${element.message}</span></div>`;
          // 이미지 넣는 코드는 chat.js에서 가져왔움
          chatting.innerHTML += chat;
        }
      });
    });
}

function editData(quill) {
  document.querySelector(".ql-toolbar").style.display = "block";
  document.querySelector("#modify_contents_button").textContent = "수정완료";
  quill.enable(); // 수정 가능
  document
    .querySelector("#modify_contents_button")
    .addEventListener("click", function () {
      submitData(quill.getContents());
    });
}

function submitData(record_body) {
  // 서버에 전송
  fetch("http://localhost:5000/conference/3", {
    method: "PUT",
    body: JSON.stringify({
      title: title.textContent,
      date: date.textContent,
      record: record_body,
      chat: chatting_list,
    }),
    headers: {
      "content-type": "application/json;charset=utf-8",
    },
  }).then((response) => location.reload());
}

function getParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
