var adds = document.getElementById("add");
adds.addEventListener("click", addPenalty);

var select = document.getElementById("input_name");
select.addEventListener("change", selectFinish);

fetch("/api/group/" + groupId) //id로 불러옴
    .then((response) => response.json())
    .then((data) => {
        groupMembers = data.groupMember;
        groupMembers.forEach((member) => {
            fetch("/api/get_user/" + member.id)
                .then((response2) => response2.json())
                .then((response2) => {
                    var opt = document.createElement('option');
                    opt.value = member.id;
                    opt.innerHTML = response2.displayName;
                    select.appendChild(opt);
                    selectFinish();
                })
        })
    })

function selectFinish() {
    fetch("/api/get_user/" + select.options[select.selectedIndex].value)
        .then((response2) => response2.json())
        .then((response2) => {
            document.getElementById("circle").setAttribute("src", "data:image/png;base64, " + response2.photos);
        })
}

function addPenalty() {
    var input_id = select.options[select.selectedIndex].value;
    var input_date = document.getElementById("input_date").value;
    var date = new Date(input_date);
    var input_amount = document.getElementById("input_amount").value;
    var amount = parseInt(input_amount);
    var _fine = {
        date: date,
        id: input_id,
        amount: amount
    };
    if(input_id == "" || input_date == "" || input_amount == "") return;
    console.log(_fine);
    fetch("/api/add_penalty", {
        method: "POST",
        body: JSON.stringify(_fine),
        headers: {
            "content-type": "application/json",
        },
    })
        .then((response) => response.text())
        .then((text) => {
            console.log(text);
            setTimeout(() => { location.href = "/penalty"; },100);
        })
}