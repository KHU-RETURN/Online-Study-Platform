$(document).ready(function () {
    calendarInit();
    choiceDate();
});


var thisMonth;

var currentYear;
var currentMonth;
var currentDate;


var startDay;
var prevDate;
var prevDay;

var endDay;
var nextDate;
var nextDay;

var dateText;

var _myTodoList = [];

/*
    달력 렌더링 할 때 필요한 정보 목록 

    현재 월(초기값 : 현재 시간)
    금월 마지막일 날짜와 요일
    전월 마지막일 날짜와 요일
*/

function calendarInit() {

    // 날짜 정보 가져오기
    var date = new Date(); // 현재 날짜(로컬 기준) 가져오기
    var utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // uct 표준시 도출
    var kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
    var today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)

    thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // 달력에서 표기하는 날짜 객체

    currentYear = thisMonth.getFullYear(); // 달력에서 표기하는 연
    currentMonth = thisMonth.getMonth(); // 달력에서 표기하는 월
    currentDate = thisMonth.getDate(); // 달력에서 표기하는 일

    // kst 기준 현재시간
    // console.log(thisMonth);

    // 캘린더 렌더링
    renderCalender(thisMonth);

    //시작화면부터 띄워야할 값들
    loadList(currentYear, currentMonth, currentDate); //기존에 저장돼있던 리스트 
    dateBox(currentYear, currentMonth, currentDate); //현재 날짜 기준으로 날짜박스 생성
    lengthCheck(); //리스트 길이 체크
    checkedCount(); //체크된 리스트 개수

    function renderCalender(thisMonth) {
        // 렌더링을 위한 데이터 정리
        currentYear = thisMonth.getFullYear();
        currentMonth = thisMonth.getMonth();
        currentDate = thisMonth.getDate();

        // 이전 달의 마지막 날 날짜와 요일 구하기
        startDay = new Date(currentYear, currentMonth, 0);
        prevDate = startDay.getDate();
        prevDay = startDay.getDay();

        // 이번 달의 마지막날 날짜와 요일 구하기
        endDay = new Date(currentYear, currentMonth + 1, 0);
        nextDate = endDay.getDate();
        nextDay = endDay.getDay();

        // 현재 월 표기
        $('.year-month').text(currentYear + '.' + (currentMonth + 1));

        // 렌더링 html 요소 생성
        calendar = document.querySelector('.dates')
        calendar.innerHTML = '';

        // 지난달
        for (var i = prevDate - prevDay + 1; i <= prevDate; i++) {
            calendar.innerHTML = calendar.innerHTML + '<button class="day prev disable">' + i + '</button>'
        }
        // 이번달
        for (var i = 1; i <= nextDate; i++) {
            calendar.innerHTML = calendar.innerHTML + '<button class="day current-month">' + i + '</button>'
        }
        // 다음달
        for (var i = 1; i <= (7 - nextDay == 7 ? 0 : 7 - nextDay); i++) {
            calendar.innerHTML = calendar.innerHTML + '<button class="day next disable">' + i + '</button>'
        }

        // 오늘 날짜 표기
        if (today.getMonth() == currentMonth) {
            todayDate = today.getDate();
            var currentMonthDate = document.querySelectorAll('.dates .current-month');
            currentMonthDate[todayDate - 1].setAttribute('id', 'today');
        }
    }

    // 이전달로 이동
    $('.go-prev').on('click', function () {
        thisMonth = new Date(currentYear, currentMonth - 1, 1);
        renderCalender(thisMonth);
    });

    // 다음달로 이동
    $('.go-next').on('click', function () {
        thisMonth = new Date(currentYear, currentMonth + 1, 1);
        renderCalender(thisMonth);
    });
}
var once = 0;
//버튼 동적으로 생성 -> on 사용
function choiceDate() {
    //날짜 선택시 선택된 날짜 표시
    $('.dates').on('click', 'button.day.current-month', function () {
        $('button.day.current-month').css({
            "color": "#999",
            "background-color": "#ffffff"
        });
        $('.day.current-month:nth-child(7n -1)').css({ "color": "#3c6ffa" });
        $('.day.current-month:nth-child(7n)').css({ "color": "#ed2a61" });
        $('.day#today').css({ "background-color": "rgb(242 242 242)" });
        $(this).css({
            "color": "black",
            "background-color": "#efefef"
        });

        dateText = $(this).text(); //선택된 날짜
        once = 0;
        //버튼 클릭 시 선택된 날짜대로 날짜 생성
        $('.btn-primary').click(function () {
            if (once == 0) {
                currentDate = dateText;
                // console.log(dateText);
                $('.list-item').remove();
                $('.dropdown').remove();
                loadList(currentYear, currentMonth, currentDate);
                dateBox(currentYear, currentMonth, currentDate);
                lengthCheck();
                checkedCount();
                once++;
            }
        });
    });
}

//이전, 이후 버튼 클릭으로 날짜 변경
$('#nav-before').click(function () {
    currentDate = Number(currentDate);
    currentDate = currentDate - 1
    $('.list-item').remove(); //다른 날짜의 리스트 제거
    $('.dropdown').remove(); //다른 날짜의 다른 멤버 리스트 제거
    loadList(currentYear, currentMonth, currentDate); //날짜 바뀔 때마다 기존 리스트 불러옴
    dateBox(currentYear, currentMonth,currentDate); //날짜 변경시 날짜박스의 날짜도 변경
    lengthCheck();
    checkedCount();
});
$('#nav-after').click(function () {
    currentDate = Number(currentDate);
    currentDate = currentDate + 1
    $('.list-item').remove();
    $("#mb-todo").children().remove();

    loadList(currentYear, currentMonth, currentDate);
    dateBox(currentYear, currentMonth ,currentDate);
    lengthCheck();
    checkedCount();
});

// datebox에 날짜 넣기
function dateBox(currentYear, currentMonth, currentDate) {
    currentYear = Number(currentYear);
    currentMonth = Number(currentMonth);
    currentDate = Number(currentDate);

    //원래 있던 날짜 제거
    $('button.date').remove();

    //표시될 날짜 생성하기
    var yesterday = new Date(currentYear, currentMonth, currentDate - 1);
    var tdbYesterday = new Date(currentYear, currentMonth, currentDate - 2);
    var today = new Date(currentYear, currentMonth, currentDate);
    var tomorrow = new Date(currentYear, currentMonth, currentDate + 1);
    var tdaTomorrow = new Date(currentYear, currentMonth, currentDate + 2);


    var yesterdayMonth = yesterday.getMonth() + 1;
    var yesterdayDate = yesterday.getDate();

    var tdbYesterdayMonth = tdbYesterday.getMonth() + 1;
    var tdbYesterdayDate = tdbYesterday.getDate();

    var todayMonth = today.getMonth() + 1;
    var todayDate = today.getDate();

    var tomorrowMonth = tomorrow.getMonth() + 1;
    var tomorrowDate = tomorrow.getDate();

    var tdaTomorrowMonth = tdaTomorrow.getMonth() + 1;
    var tdaTomorrowDate = tdaTomorrow.getDate();

    $('<button class="date notToday">' + tdaTomorrowMonth + '월 ' + tdaTomorrowDate + '일</button>').insertAfter('button#nav-before');
    $('<button class="date notToday">' + tomorrowMonth + '월 ' + tomorrowDate + '일</button>').insertAfter('button#nav-before');
    $('<button class="date">' + todayMonth + '월 ' + todayDate + '일</button>').insertAfter('button#nav-before');
    $('<button class="date notToday">' + yesterdayMonth + '월 ' + yesterdayDate + '일</button>').insertAfter('button#nav-before');
    $('<button class="date notToday">' + tdbYesterdayMonth + '월 ' + tdbYesterdayDate + '일</button>').insertAfter('button#nav-before');
}

$("#todo-entry").on("keydown", function (e) {
    if (e.keyCode == 13 && $("#text-entry").val() != "") {
        //리스트에 입력 값 넣기
        // console.log("list");
        // addList($("#text-entry").val(), false);
        // lengthCheck();

        var todayTime = currentYear + "년 " + Number(currentMonth + 1) + "월 " + currentDate + "일";
        addMyList({ text: $("#text-entry").val(), checked: false, date: todayTime });
    }
})

$("#button-addon2").on("click", function () {
    if ($("#text-entry").val() != "") {
        //리스트에 입력 값 넣기
        // console.log("list");
        // addList($("#text-entry").val(), false);
        // lengthCheck();

        var todayTime = currentYear + "년 " + Number(currentMonth + 1) + "월 " + currentDate + "일";
        addMyList({ text: $("#text-entry").val(), checked: false, date: todayTime });
    }
})

//todo리스트에 추가
function addList(text, checked, date, _id) {
    var inputGroup = $("<div class='input-group mb-3 list-item'></div>");
    var form = $("<div class='form-control', aria-label='Example text with button addon', aria-describedby='button-addon1'></div>");

    var task = $("<span id='task'></span>").text(text);
    var check = $("<button class='material-symbols-outlined' type='button' id='check' value=" + checked + " >check_circle</button>");

    var data = { text, checked, date, _id };
    // console.log(data);

    $(check).on('click', function () {
        if ($(this).attr('value') == "false") {
            $(this).attr("value", "true"); //체크 시 True로 속성값 변경
            $(this).css({ "color": "#677e25" });
            $(task).css({ "color": "#7D7D7D" });
            checkedCount();

            data.checked = !data.checked;
            editMyList(data);
        } else if ($(this).attr('value') == "true") {
            $(this).attr("value", "false"); //한 번 더 체크 시 False로 속성값 변경
            $(this).css({ "color": "#D4D4D4" });
            $(task).css({ "color": "black" });
            checkedCount();

            data.checked = !data.checked;
            editMyList(data);
        }
    });

    var del = $("<button class='material-symbols-outlined', id='del'>close</button>").on('click', function () {
        inputGroup.fadeOut(function () {
            inputGroup.remove();
            lengthCheck();
            checkedCount();

            data.checked = null;
            editMyList(data);
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
}
//한 일 개수 세기
function checkedCount() {
    var checked = $(".list-item button[value = true]").length;
    $("#success").text(checked);
}

//todolist 등록하기
//기존에 있던 리스트 불러오기
// var userId = fetch("http://localhost:5000/users")
// .then((response) => response.json())
// .then((data) => {
//     userId = data.id;
// });

// fetch('http://localhost:5000/groupMember')
// .then((response) => response.json())
// .then((data) => {
//     console.log(data);
// });


function loadList(currentYear, currentMonth, currentDate) {
    fetch("/api/get_todo")
        .then((response) => response.json())
        .then((data) => {
            var member = data;
            const userId = member[0].id;
            member.splice(0, 1);
            var memberNumber = member.length;
            var count = 0;

            for (var i = 0; i < memberNumber; i++) {
                var todayTime = currentYear + "년 " + Number(currentMonth + 1) + "월 " + currentDate + "일";
                //id가 user id일 경우
                if (member[i].id == userId) {
                    //todolist
                    var myTodo = member[i].todo;
                    _myTodoList = myTodo;
                    // console.log(_myTodoList);
                    //선택된 날짜 년월일

                    for (var j = 0; j < myTodo.length; j++) {
                        var myTodoDate = myTodo[j].date;
                        if (myTodoDate == todayTime) {
                            var myTodoList = myTodo[j].text;
                            var myTodoValue = myTodo[j].checked;
                            var _id = myTodo[j]._id;

                            addList(myTodoList, myTodoValue, myTodoDate, _id);
                            lengthCheck();
                            checkedCount();
                        }
                    }
                } else {
                    var memberName = member[i].name; //멤버 이름
                    var memberTodo = member[i].todo; //멤버 투두리스트

                    addMemberList(memberName); //멤버 수만큼 버튼 추가

                    for (var j = 0; j < memberTodo.length; j++) {
                        var memberTodoDate = memberTodo[j].date;
                        if (memberTodoDate == todayTime) { //리스트 날짜랑 현재 선택된 날짜가 같을 때만 추가
                            var memberTodoList = memberTodo[j].text;
                            var memberTodoValue = memberTodo[j].checked;

                            addMemberTask(memberTodoList, memberTodoValue, count); //리스트 추가
                        }
                    }
                    count++;
                }
            }
        })
}

function editMyList(updateData) {
    var removeIndex = -1;
    for (var i = 0; i < _myTodoList.length; i++) {
        if (_myTodoList[i]._id == updateData._id) {
            _myTodoList[i] = updateData;
            if (updateData.checked == null) removeIndex = i;
        }
    }
    if (removeIndex != -1) _myTodoList.splice(removeIndex, 1);
    fetch("/api/edit_todo", {
        method: "PUT",
        body: JSON.stringify(_myTodoList),
        headers: {
            "content-type": "application/json; charset=UTF-8"
        }
    })
}

function addMyList(listInfo) {
    fetch("/api/add_todo", {
        method: "POST",
        body: JSON.stringify(listInfo),
        headers: {
            "content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json()).then((json) => {
        _myTodoList.push(json);
        addList(json.text, json.checked, json.date, json._id);
        lengthCheck();
    });
}

function addMemberList(name) {
    var dropdownGroup = $("<div class='dropdown mb-4'></div>");
    var dropdownButton = $("<button class='btn btn-secondary dropdown-toggle' id='dropbox' type='button' data-bs-toggle='dropdown' aria-expanded='false'></button>").text(name + "의 목표");
    var dropdownMenu = $("<div class='dropdown-menu p-2 text-muted'></div>");
    var memberList = $("<div id='check-list' id='member-list'></div>");


    dropdownMenu.append(memberList);
    dropdownGroup.append(dropdownButton, dropdownMenu);
    $(dropdownGroup).appendTo("#mb-todo");
}

function addMemberTask(text, value, index) {
    var inputGroup = $("<div class='input-group mb-3'></div>");
    var form = $("<div class = 'form-control' aria-label='Example text with button addon' aria-describedby='button-addon1'></div>")
    var task = $("<span id='task'></span>").text(text);
    var check = $("<button class='material-symbols-outlined' type='button' id='check' value=" + value + ">check_circle</button>");
    form.append(task);
    inputGroup.append(check, form);
    $(inputGroup).appendTo($('#mb-todo').children().eq(index).children().eq(1).children(":first"));
}