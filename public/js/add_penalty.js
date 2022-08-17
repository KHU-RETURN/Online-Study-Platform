adds.addEventListener("click",addPenalty);

fetch("http://localhost:5000/groups/5") //id로 불러옴
    .then((response) => response.json())
    .then((data) => {
      data_list = data.fine;
      console.log(data_list);
})

function addPenalty(){
    var input_id=document.getElementById("input_id").value;
    var input_date=document.getElementById("input_date").value;
    var input_amount=document.getElementById("input_amount").value;
    var _fine={
        date: input_date,
        id: input_id,
        amount: input_amount
    };
    fetch("http://localhost:5000/groups/5/fine", {//이게 맞나?
        method: "POST",
        body: JSON.stringify(_fine),
        headers: {
          "content-type": "application/json",
        },
    })
    .then((response) => response.text())
    .then((text) => {
        console.log(text);//location을 어떻게 해야할지,,
    })
}