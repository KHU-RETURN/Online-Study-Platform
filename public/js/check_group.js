var group_name = document.getElementById("group_name");
var description = document.getElementById("description");
var icons = document.getElementsByClassName("material-symbols-outlined");
var nav = document.getElementById("nav");
var nav_items = document.getElementsByClassName("nav-item");
var id = getParameter("id");
var code = getParameter("code");

/*
console.log(location.href);
temp = location.href.split("?");
console.log(temp);
data = temp[1].split("/");
code = data[0];
alert(code);
*/

if (id) {
  loadGroup("/" + id);
} else if (code) {
  loadGroup("?code=" + code);
}

function loadGroup(url) {
  fetch("/api/group" + url) //id로 불러옴
    .then((response) => response.json())
    .then((data) => {
      if (data.length) {
        //배열이 넘어오면
        original_value = data[0]; //배열 데이터. 일치하는 모든 데이터가 불러와짐. 실제로 데이터 불러올 때는 하나만 가져올거니까 -> [0] 없애면 됨.
      } else {
        original_value = data;
      }
      group_name.innerText = original_value.name;
      description.innerText = original_value.description;
      for (let i = 0; i < icons.length; i++) {
        icons[i].style.backgroundColor = original_value.color;
        icons[i].style.color = getTextColorByBackgroundColor(
          original_value.color
        );
      }
      nav.style.backgroundColor = original_value.color;
      for (let i = 0; i < nav_items.length; i++) {
        nav_items[i].style.borderColor = original_value.color;
        nav_items[i].style.color = getTextColorByBackgroundColor(
          original_value.color
        );
      }
      console.log(original_value);
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
  const r = (rgb >> 16) & 0xff; // red 추출
  const g = (rgb >> 8) & 0xff; // green 추출
  const b = (rgb >> 0) & 0xff; // blue 추출
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709     // 색상 선택
  return luma < 127.5 ? "white" : "black"; // 글자색이}
}
