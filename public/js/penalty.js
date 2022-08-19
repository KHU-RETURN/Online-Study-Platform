var contents = document.getElementById("contents");
//const user_name = document.getElementById("user-name");
var header=document.getElementById("header");
var closes=document.getElementById("close");
var adds=document.getElementById("add");
var form=document.getElementById("form_data");
var user_name="정주희";
var all_amount=0;

init();

function init() {
  fetch("http://localhost:5000/groups/5") //id로 불러옴
    .then((response) => response.json())
    .then((data) => {
      data_list = data.fine;
      console.log(data_list);
      
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
          item.innerHTML += `<div class="date">${date}</div>`;
        }
        var item1 = document.createElement("div");
        item1.setAttribute("class","item1");
        var date_id= element.id;
        var date_amount= element.amount;
        item1.innerHTML += `<div class="id">${date_id}</div>`;
        item1.innerHTML += `<div class="amount">${date_amount}원</div>`;
        item.append(item1);
        if(user_name===element.id){
            all_amount+=element.amount;
        }
      });

      contents.append(item);
      header.innerText="누적금액 - ";
      header.innerText+=all_amount;
      header.innerText+="원";
    });
}


