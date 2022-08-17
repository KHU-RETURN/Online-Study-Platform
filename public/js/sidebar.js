const userName = document.getElementById("user-name");
const group = document.getElementById("group-name");
const explain = document.getElementById("explain");
const number = document.getElementById("number");

const btns = document.getElementsByClassName("col-2 sidebar")[0].querySelectorAll("a");
btns.forEach((element) => {
    element.setAttribute("href", "/"+element.getAttribute("data-value"));
})

const getGroupInfo = fetch(`/api/get_user`)
.then((response)=>response.json())
.then((response)=>{
    let originalData = response;
    let name = originalData.name;

     //사용자 이름 
    userName.innerHTML = name + "님";

})

fetch(`api/group/`+groupId)
.then((response)=>response.json())
.then((response)=>{
    let originalData = response;
    let groupName = originalData.name;
    let groupDescription = originalData.description;
    let groupNumber = originalData.groupMember.length;

    // 그룹 이름
    group.innerHTML = groupName;
    
    // 그룹 설명
    explain.innerHTML = (groupDescription.length > 15)?(groupDescription.substring(0,15)+"..."):(groupDescription);

    //그룹 인원
    number.innerHTML = "/ "+groupNumber+"명";
})