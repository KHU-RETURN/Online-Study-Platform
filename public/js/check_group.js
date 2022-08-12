var group_name = document.getElementById("group_name");
var description = document.getElementById("description");
var icons = document.getElementsByClassName("material-symbols-outlined");
var nav = document.getElementById("nav");
var nav_items = document.getElementsByClassName("nav-item");
var id = getParameter("id");
var code = getParameter("code");
const footer = document.getElementById("footer");
const exit_button = document.getElementById("exit_group");
let key;

init();
function init() {
  if (id) {
    key = id;
  } else if (code) {
    key = code;
  }
  exit_button.addEventListener("click", exitGroup);
  loadGroup(key);
  displayCode(key);
}

function loadGroup(id) {
  fetch("/api/group/" + id) //id로 불러옴
    .then((response) => response.json())
    .then((data) => {
      if (data.length) {
        //배열이 넘어오면
        original_value = data[0];
      } else {
        original_value = data;
      }
      group_name.innerText = original_value.name;
      description.innerText = original_value.description;
      icons.forEach((element) => {
        element.style.backgroundColor = original_value.color;
        element.style.color = getTextColorByBackgroundColor(
          original_value.color
        );
      });
      nav.style.backgroundColor = original_value.color;
      nav_items.forEach((element) => {
        element.style.borderColor = original_value.color;
        element.style.color = getTextColorByBackgroundColor(
          original_value.color
        );
      });
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

function getTextColorByBackgroundColor(hexColor) {
  const c = hexColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 127.5 ? "white" : "black";
}

function displayCode(id) {
  const code = `<span>초대코드&nbsp; &nbsp; ${id}</span>`;
  footer.innerHTML = code;
}

function exitGroup() {
  var con_test = confirm("그룹에서 나가시겠습니까?");
  if (con_test == true) {
    fetch("/api/exit_group/" + key, {
      method: "DELETE",
    }).then(
      setTimeout(() => {
        location.href = "/";
      }, 100)
    );
  }
}
