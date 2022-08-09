const group_name = document.getElementById("group_name");
const description = document.getElementById("description");
const icons = document.getElementsByClassName("material-symbols-outlined");
const nav = document.getElementById("nav");
const nav_items = document.getElementsByClassName("nav-item");
const id = getParameter("id");
const code = getParameter("code");
const footer = document.getElementById("footer");

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
  loadGroup("/" + code);
}

function loadGroup(id) {
  fetch("http://localhost:5000/groups" + id) //id로 불러옴
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
      displayCode(original_value.id);
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
