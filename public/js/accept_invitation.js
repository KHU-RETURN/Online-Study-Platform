const accept_button = document.getElementById("accept_button");
const invitation_code = document.getElementById("invitation_code");
const user_id = document.getElementById("user_id");
var form = document.getElementById("form_data");

accept_button.addEventListener("click", joinGroup);
invitation_code.addEventListener("keypress", (e) => {
  if (e.code == "Enter") {
    e.preventDefault();
    joinGroup();
  }
});
//request.onload = joinGroup();

function joinGroup() {
  var formData = new FormData(form);
  formData.append("user_id", "test_user"); //user_id 추가해서 전달
  var request = new XMLHttpRequest();
  var requestURL = form.getAttribute("action"); //서버에 요청. 아니면 새로 정의

  request.open("GET", requestURL, true);
  request.responseType = "json";
  request.send(formData);
  return false;
  //var groupInfo = request.response;
  // 코드를 서버로 보내고 서버에서 보내준 넘어오는 데이터
  // 기본 데이터 생성
}
