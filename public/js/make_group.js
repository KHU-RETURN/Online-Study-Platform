const make_button = document.getElementById("make_button");
const accept_button = document.getElementById("accept_button");
const modify_button = document.getElementById("modify_button");
const delete_button = document.getElementById("delete_button");

const invitation_code = document.getElementById("invitation_code");

const group_name = document.getElementById("group_name");
const group_description = document.getElementById("group_description");
const group_color = document.getElementById("group_color");

var form = document.getElementById("form_data");
let original_value;

if (accept_button) {
  accept_button.addEventListener("click", checkData);
  invitation_code.addEventListener("keypress", (e) => {
    if (e.code == "Enter") {
      e.preventDefault();
      checkData();
    }
  });
} else if (make_button) {
  make_button.addEventListener("click", checkData);
} else if (modify_button) {
  fetch("http://localhost:3000/groups/5") //id로 불러옴
    .then((response) => response.json())
    .then((data) => {
      original_value = data;
      group_name.value = original_value.name;
      group_description.value = original_value.description;
      group_color.value = original_value.color;
      console.log(original_value);
    });
  modify_button.addEventListener("click", checkData);
  delete_button.addEventListener("click", deleteGroup);
}

function joinGroup() {
  location.href = "index.html?" + invitation_code.value; //경로 수정
  // 받을 때
  /* 
    temp = location.href.split("?");
    data=temp[1].split("/");
    code = data[0];
    alert(code);
    
    */
}

function makeGroup() {
  var formData = new FormData(form);
  // 초대코드 추가하는 코드 있어야 함
  var group = serialize(formData);
  console.log(JSON.stringify(group));
  fetch("http://localhost:3000/groups", {
    method: "POST",
    body: JSON.stringify(group),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function modifyGroup() {
  var formData = new FormData(form);
  var group = serialize(formData);

  fetch("http://localhost:3000/groups/" + original_value.id, {
    method: "PUT",
    body: JSON.stringify(group),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function deleteGroup() {
  var con_test = confirm(original_value.name + " 그룹을 삭제하시겠습니까?");
  if (con_test == true) {
    fetch("http://localhost:3000/groups/" + original_value.id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }
}

function checkData(event) {
  if (event.target.id === "accept_button") {
    if (invitation_code.value == "") {
      alert("초대 코드를 입력하세요.");
    } else {
      joinGroup();
    }
  } else if (event.target.id === "make_button") {
    if (group_name.value == "") {
      alert("그룹 이름을 입력하세요.");
    } else if (group_description.value == "") {
      alert("그룹 설명을 입력하세요.");
    } else {
      makeGroup();
    }
  } else if (event.target.id === "modify_button") {
    if (group_name.value == "") {
      alert("그룹 이름을 입력하세요.");
    } else if (group_description.value == "") {
      alert("그룹 설명을 입력하세요.");
    } else {
      modifyGroup();
    }
  }
}

function serialize(rawData) {
  let rtnData = {};
  for (let [key, value] of rawData) {
    let sel = document.querySelectorAll("[name=" + key + "]");

    if (sel.length > 1) {
      if (rtnData[key] === undefined) {
        rtnData[key] = [];
      }
      rtnData[key].push(value);
    } else {
      rtnData[key] = value;
    }
  }

  return rtnData;
}
