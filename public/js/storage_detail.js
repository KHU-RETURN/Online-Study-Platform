const chatting = document.getElementById("chatting");
var chatting_list;
var confId = getParameter("id");
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
  // console.log(groupId, confId);
  fetch("/api/get_conference/" + confId)
    .then((response) => response.json())
    .then((response) => {
      var dateFormat = new Date(response.endTime);
      dateFormat = (dateFormat.getFullYear()) + "년 " + (dateFormat.getMonth() + 1) + "월 " + dateFormat.getDate() + "일";
      document.getElementById("date").innerHTML = dateFormat;
      document.getElementById("title").innerHTML = response.title;
      var quill = new Quill("#editor", {
        modules: {
          toolbar: toolbarOptions,
        },
        theme: "snow",
      });
      document.querySelector(".ql-toolbar").style.display = "none";
      quill.enable(false); //보기만 가능 (viewer)
      // console.log(JSON.parse(JSON.stringify(response.record)));
      quill.setContents(JSON.parse(JSON.stringify(response.record)));
      document
        .querySelector("#modify_contents_button")
        .addEventListener("click", function () {
          editData(quill);
        });

      fetch("/api/get_chat")
        //title, date
        .then((response2) => response2.json())
        .then((data2) => {
          // console.log(data2[0]); //user 정보
          // console.log(chatting_list);
          const userId = data2[0].id;
          data2.splice(0, 1);

          const startDate = new Date(response.startTime);
          const endDate = new Date(response.endTime);

          data2.forEach((element) => {
            const chatDate = new Date(element.date);
            if (chatDate.getTime() > startDate.getTime() && chatDate.getTime() < endDate.getTime()) {
              // 불러온 데이터 시간순 아니면 -> 정렬하는 부분 추가
              if (userId === element.id) {
                // owner이름과 같으면 이미지 오른쪽에 생성
                let chat = `<div class="chat_right"><span class="message">${element.message}</span><span class="photo"><img id="circle" src="data:image/png;base64, ${element.profileImage}"></span></div>`;
                chatting.innerHTML += chat;
              } else {
                // 다르면 왼쪽에 생성
                let chat = `<div class="chat_left"><span class="photo"><img id="circle" src="data:image/png;base64, ${element.profileImage}"></span><span class="message">${element.message}</span></div>`;
                // 이미지 넣는 코드는 chat.js에서 가져왔움
                chatting.innerHTML += chat;
              }
            }

          });
        });
    })

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
  // console.log(record_body);
  fetch("/api/edit_conference/"+confId, {
    method: "PUT",
    body: JSON.stringify({
      record: record_body,
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
