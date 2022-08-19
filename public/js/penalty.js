var contents = document.getElementById("contents");
//const user_name = document.getElementById("user-name");
var header = document.getElementById("header");
var closes = document.getElementById("close");
var adds = document.getElementById("add");
var form = document.getElementById("form_data");
var user_name = "정주희";
var all_amount = 0;

const openModal = document.getElementById("plus")
openModal.addEventListener("click", e => {
  document.getElementById("modal").style.display = "flex";
})

const closeModal = document.getElementById("close")
closeModal.addEventListener("click", e => {
  document.getElementById("modal").style.display = "none";
})

init();

function custom_sort(a, b) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function init() {
  fetch("api/get_penalty") //id로 불러옴
    .then((response) => response.json())
    .then(async (data) => {
      data_list = data;

      if (data_list.length === 0) {
        return;
      }
      data_list.sort(custom_sort);
      var item = document.createElement("div");
      item.setAttribute("class", "item");
      let date = data_list[0].date;
      var dateFormat = new Date(date);
      dateFormat = (dateFormat.getMonth() + 1) + "월 " + dateFormat.getDate() + "일";
      item.innerHTML += `<div class="date" id=${date}>${dateFormat}</div>`;

      data_list.forEach((element, index) => {
        const prevDateFormat = dateFormat;
        date = element.date;
        dateFormat = new Date(date);
        dateFormat = dateFormat.getMonth() + 1 + "월 " + dateFormat.getDate() + "일";
        if (prevDateFormat !== dateFormat) {
          contents.append(item);
          item = document.createElement("div");
          item.setAttribute("class", "item");
          date = element.date;
          item.innerHTML += `<div class="date" id=${date}>${dateFormat}</div>`;
        }
        var item1 = document.createElement("div");
        item1.setAttribute("class", "item1");
        var date_id = element.id;
        var date_amount = element.amount;
        item1.innerHTML += `<div class="id" id=${date_id + index}><img id="circle30" src="data:image/png;base64, ${element.profileImage}">${element.name}</div>`;
        item1.innerHTML += `<div class="amount">${date_amount}원</div>`;
        item.append(item1);
        if (userId === element.id) {
          all_amount += element.amount;
        }
      });

      contents.append(item);
      header.innerText = "누적금액 -  ";
      header.innerText += all_amount;
      header.innerText += "원";
    });
}


