// let button_mode = document.querySelector("#modify_contents_button");

init();

function init() {
  const title = getParameter("title");
  const date = getParameter("date");
  document.querySelector("#title").textContent = title;
  document.querySelector("#date").textContent = date;
  console.log(title, date);
  fetch("http://localhost:5000/conference?title=" + title + "&date=" + date)
    //title, date
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      loadData(data[0]);
    });
}

function loadData(data) {
  var quill = new Quill("#editor", {
    theme: "snow",
  });
  document.querySelector(".ql-toolbar").style.display = "none";
  quill.enable(false);
  quill.setContents(JSON.parse(JSON.stringify(data.record)));
  document
    .querySelector("#modify_contents_button")
    .addEventListener("click", function () {
      editData(quill);
    });
}

function editData(quill) {
  document.querySelector(".ql-toolbar").style.display = "block";
  document.querySelector("#modify_contents_button").textContent = "수정완료";
  quill.enable();
  document
    .querySelector("#modify_contents_button")
    .addEventListener("click", function () {
      submitData(quill.getContents());
    });
}

function submitData(record_body) {
  fetch("http://localhost:5000/conference/3", {
    method: "PUT",
    body: JSON.stringify({
      title: title.textContent,
      date: date.textContent,
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
