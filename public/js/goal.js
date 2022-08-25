var content = document.getElementById("goal_graph");
const user_name = "정주희"
let _data;

var _groupTodoList = [];



loadGroupTodoList(); 
lengthCheck(); 
checkedCount();
loadGoal();



/* 투두리스트 영역*/
//투두 리스트 생성
$("#todo-entry").on("keyup", function (e) { //엔터시 입력된 값 투두리스트에 추가
    if (e.keyCode == 13 && $("#text-entry").val() != "") { // 입력된 값이 없을 경우 추가 안됨
        addGroupTodoList({ text: $("#text-entry").val(), checked: false });
    }
})

$("#button-addon2").on("click", function () { //추가 버튼 클릭 시 투두리스트에 추가
    if ($("#text-entry").val() != "") {
        addGroupTodoList({ text: $("#text-entry").val(), checked: false });
    }
})

function loadGroupTodoList() {
    fetch("/api/group/"+groupId)
        .then((response) => response.json())
        .then((data) => {
            var todo = data.todo;
            _groupTodoList = todo;
            var todo_length = todo.length;

            for (var i = 0; i < todo_length; i++) {

                var groupTodoList = todo[i].text;
                var groupTodoValue = todo[i].checked;
                addList(groupTodoList, groupTodoValue);
                var _length = lengthCheck();
                var _checked = checkedCount();

            }
            var _rate = 0;
            if (_length == 0) _rate = 0;
            else _rate = _checked / _length;
            // let _content = `<div class='item'><div class='name'>그룹 공동 목표</div>`;
            // _content += `<div id='rate'>${_rate}</div></div>`;

            // content.innerHTML += _content;

            document.getElementById('rate').innerHTML = _rate;
            var str = String(_rate * 80) + '%';
            // console.log(str);
            // console.log(_rate);
            document.getElementById('rate').style.width = str;
        })
}

function addGroupTodoList(listInfo) {
    _groupTodoList.push(listInfo);
    addList(listInfo.text, listInfo.checked);
    var _length = lengthCheck();
    var _checked = checkedCount();
    var _rate = 0;
    if (_length == 0) _rate = 0;
    else _rate = _checked / _length;
    document.getElementById('rate').innerHTML = _rate;
    var str = String(_rate * 80) + '%';
    document.getElementById('rate').style.width = str;
    fetch("/api/edit_goal", {
        method: "PUT",
        body: JSON.stringify(_groupTodoList),
        headers: {
            "content-type": "application/json; charset=UTF-8"
        }
    })
}

function editGroupTodoList(updateData) {
    var removeIndex = -1;
    for (var i = 0; i < _groupTodoList.length; i++) {
        if (_groupTodoList[i].text == updateData.text) {
            _groupTodoList[i] = updateData;
            if (updateData.checked == null) removeIndex = i;
        }
    }
    if (removeIndex != -1) _groupTodoList.splice(removeIndex, 1);
    // _data.todo = _groupTodoList;
    // console.log(_groupTodoList);
    fetch("/api/edit_goal", {
        method: "PUT",
        body: JSON.stringify(_groupTodoList),
        headers: {
            "content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) =>{
        var _length = lengthCheck();
        var _checked = checkedCount();
        var _rate = 0;
        if (_length == 0) _rate = 0;
        else _rate = _checked / _length;
        document.getElementById('rate').innerHTML = _rate;
        var str = String(_rate * 80) + '%';
        document.getElementById('rate').style.width = str;
    })
}

//todo리스트에 추가하는 함수
function addList(text, checked) {
    var inputGroup = $("<div class='input-group mb-3 list-item'></div>");
    var form = $("<div class='form-control', aria-label='Example text with button addon', aria-describedby='button-addon1'></div>");

    var task = $("<span id='task'></span>").text(text);
    var check = $("<button class='material-symbols-outlined' type='button' id='check' value=" + checked + " >check_circle</button>");

    var data = { text, checked };

    $(check).on('click', function () {
        if ($(this).attr('value') == "false") {
            $(this).attr("value", "true"); //체크 시 True로 속성값 변경
            $(this).css({ "color": "#677e25" });
            $(task).css({ "color": "#7D7D7D" });
            checkedCount();

            data.checked = !data.checked;
            editGroupTodoList(data);
        } else if ($(this).attr('value') == "true") {
            $(this).attr("value", "false"); //한 번 더 체크 시 False로 속성값 변경
            $(this).css({ "color": "#D4D4D4" });
            $(task).css({ "color": "black" });
            checkedCount();

            data.checked = !data.checked;
            editGroupTodoList(data);
        }
    });

    var del = $("<button class='material-symbols-outlined', id='del'>close</button>").on('click', function () {
        inputGroup.fadeOut(function () {
            inputGroup.remove();
            var _length = lengthCheck();
            checkedCount();

            data.checked = null;
            editGroupTodoList(data);
        })
    });

    form.append(task, del);
    inputGroup.append(check, form);
    $(inputGroup).appendTo("#check-list");

    //입력창 다시 비워주기
    $("#text-entry").val("");
}


//할 일 개수 세기
function lengthCheck() {
    var length = $(".input-group.mb-3.list-item").length;
    $("#list-number").text(length);
    return length;
}
//한 일 개수 세기
function checkedCount() {
    var _checked = $(".list-item button[value = true]").length;
    $("#success").text(_checked);
    return _checked;
}

function sortRate (a, b) {
    return b.rate - a.rate;
 }

//기존에 있던 리스트 불러오기
function loadGoal() {

    var member_name = [];
    var success_count = [];
    var todo_count = [];
    var goal_rate = [];
    fetch("/api/get_todo")
        .then((response) => response.json())
        .then((data) => {
            var member = data;
            const userId = member[0].id;
            member.splice(0, 1);
            var memberNumber = member.length;
            var count = 0;
            var me = 0;
            for (var i = 0; i < memberNumber; i++) {
                var Todo = member[i].todo;
                
                member_name.push(member[i].name);
                var length = member[i].todo.length;
                todo_count.push(length);
                for (var j = 0; j < length; j++) {
                    if (Todo[j].checked == true) {
                        count += 1
                    }
                }
                if (member[i].id === userId) {
                    me = i;
                }
                success_count.push(count);
                count = 0;
                if (todo_count[i] == 0) {
                    goal_rate.push({ name: member[i].name, id: member[i].id, rate: 0 });
                } else {
                    goal_rate.push({ name: member[i].name, id: member[i].id, rate: success_count[i] / todo_count[i] });
                }
            }
            // console.log(me);
            var i = 0;
            var new_name = [];
            var new_goalrate = [];
            let _content = `<div class='item'><div class='name'>나</div>`;
            _content += `<div id='rate${i}'>${goal_rate[me].rate}</div></div>`;
            content.innerHTML += _content;

            var str = 'rate' + String(i);
            var str1 = String(goal_rate[me].rate * 80) + '%';
            document.getElementById(str).style.width = str1;

            goal_rate.splice(me, 1);

            if (memberNumber != 1) {
                // for (var z = 0; z < memberNumber; z++) {
                //     if (member_name[z] != user_name) {
                //         new_name.push(member_name[z]);
                //         new_goalrate.push(goal_rate[z]);
                //     }
                // }
                goal_rate.sort(sortRate);
                if (goal_rate.length == 1) {
                    i++;
                    _content = `<div class='item'><div class='name' id='name${goal_rate[0].id}'>${goal_rate[0].name}</div>`;
                    _content += `<div id='rate${i}'></div>${goal_rate[0].rate}</div>`;
                    content.innerHTML += _content;
                    var str = 'rate' + String(i);
                    var str1 = String(goal_rate[0].rate * 80) + '%';
                    document.getElementById(str).style.width = str1;
                    if(goal_rate[0].name.length > 11 ) document.getElementById(`name${goal_rate[0].id}`).innerHTML = goal_rate[0].name.slice(0,10)+'...';
                // } else if (goal_rate.length == 2) {
                //     i++;
                //     if (new_goalrate[0] < new_goalrate[1]) {
                //         _content = `<div class='item'><div class='name'>${new_name[1]}</div>`;
                //         _content += `<div id='rate${i}'>${new_goalrate[1]}</div></div>`;
                //         content.innerHTML += _content;
                //         var str = 'rate' + String(i);
                //         var str1 = String(new_goalrate[1] * 800) + 'px';
                //         document.getElementById(str).style.width = str1;
                //         i++;
                //         _content = `<div class='item'><div class='name'>${new_name[0]}</div>`;
                //         _content += `<div id='rate${i}'>${new_goalrate[0]}</div></div>`;
                //         content.innerHTML += _content;
                //         var str = 'rate' + String(i);
                //         var str1 = String(new_goalrate[0] * 800) + 'px';
                //         document.getElementById(str).style.width = str1;
                //     } else {
                //         _content = `<div class='item'><div class='name'>${new_name[0]}</div>`;
                //         _content += `<div id='rate${i}'>${new_goalrate[0]}</div></div>`;
                //         content.innerHTML += _content;
                //         var str = 'rate' + String(i);
                //         var str1 = String(new_goalrate[0] * 800) + 'px';
                //         console.log(str1);
                //         document.getElementById(str).style.width = str1;
                //         i++;
                //         _content = `<div class='item'><div class='name'>${new_name[1]}</div>`;
                //         _content += `<div id='rate${i}'>${new_goalrate[1]}</div></div>`;
                //         content.innerHTML += _content;
                //         var str = 'rate' + String(i);
                //         var str1 = String(new_goalrate[1] * 800) + 'px';
                //         document.getElementById(str).style.width = str1;
                //     }
                // } else if (goal_rate.length >= 3) {
                } else if (goal_rate.length >= 2) {
                    // var first = new_goalrate[0], second = 0;
                    // var first_index = 0, second_index = 0;
                    // for (var m = 1; m < new_name.length; m++) {
                    //     if (m == 1 && new_goalrate[m] < first) {
                    //         second_index = m;
                    //         second = new_goalrate[second];
                    //     }
                    //     else if (m == 1 && new_goalrate[m] > first) {
                    //         second_index = first_index;
                    //         second = first;
                    //         first_index = m;
                    //         first = new_goalrate[first_index];
                    //     }
                    //     else {
                    //         if (new_goalrate[m] < first) {
                    //             second_index = first_index;
                    //             second = first;
                    //             first_index = m;
                    //             first = new_goalrate[first_index];
                    //         } else if (new_goalrate[m] >= first && new_goalrate[m] >= second) {
                    //             second_index = m;
                    //             second = new_goalrate[second_index];
                    //         }
                    //     }
                    // }
                    i++;
                    _content = `<div class='item'><div class='name' id='name${goal_rate[0].id}'>${goal_rate[0].name}</div>`;
                    _content += `<div id='rate${i}'>${goal_rate[0].rate}</div></div>`;
                    content.innerHTML += _content;
                    var str = 'rate' + String(i);
                    var str1 = String(goal_rate[0].rate * 80) + '%';
                    document.getElementById(str).style.width = str1;
                    if(goal_rate[0].name.length > 11 ) document.getElementById(`name${goal_rate[0].id}`).innerHTML = goal_rate[0].name.slice(0,10)+'...';
                    i++;
                    _content = `<div class='item'><div class='name'>${goal_rate[1].name}</div>`;
                    _content += `<div id='rate${i}'>${goal_rate[1].rate}</div></div>`;
                    content.innerHTML += _content;
                    var str = 'rate' + String(i);
                    var str1 = String(goal_rate[1].rate * 80) + '%';
                    document.getElementById(str).style.width = str1;
                    if(goal_rate[1].name.length > 11 ) document.getElementById(`name${goal_rate[1].id}`).innerHTML = goal_rate[1].name.slice(0,10)+'...';
                }
            }


        })
    /*
    var c=0;
    for(var k=0; k<goal_rate.length; k++){
        if(goal_rate[k]>c){
            c=goal_rate[k];

        }
    }*/
}