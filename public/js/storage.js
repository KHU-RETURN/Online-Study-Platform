const contents = document.getElementById("contents");

init();

function init() {
  fetch("http://localhost:5000/groups/5") //id로 불러옴
    .then((response) => response.json())
    .then((data) => {
      data_list = data.conference;
      console.log(data_list);
      // 날짜 데이터 형식? 시간 순?
      // 정렬된 데이터 -> 수정 필요 x
      // 날짜순으로 정렬되지 않은 데이터 -> 정렬하는 과정 필요
      if (data_list.length === 0) {
        console.log("no data");
        return;
      }
      var item = document.createElement("div");
      item.setAttribute("class", "item");
      let date = data_list[0].date;
      item.innerHTML += `<div class="date" id=${date}>${date}</div>`;
      data_list.forEach((element) => {
        if (element.date !== date) {
          contents.append(item);
          item = document.createElement("div");
          item.setAttribute("class", "item");
          date = element.date;
          item.innerHTML += `<div class="date" id=${date}>${date}</div>`;

          //          item.innerHTML += `<button type="button" id="title_button" onclick={${loadDetail}}>${element.title}</button>`;
        }
        var button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("id", "title_button");
        button.innerHTML = element.title;
        item.append(button);

        button.addEventListener("click", loadDetail);
      });
      contents.append(item);
    });
}

function loadDetail(event) {
  const selected_date = event.target.parentNode.firstChild.id;
  const selected_title = event.target.innerText;
  //encodeURI(encodeURIComponent(selected_date));
  //encodeURI(encodeURIComponent(selected_title));

  console.log(selected_date);
  console.log(selected_title);
  location.href = `/storage_detail?title=${selected_title}&date=${selected_date}`; //경로 수정
  // date, title 정보 전달 -> detail page로
}
