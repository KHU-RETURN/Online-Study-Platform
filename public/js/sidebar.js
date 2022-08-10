const userName = document.getElementById("user-name");
const group = document.getElementById("group-name");
const explain = document.getElementById("explain");
const number = document.getElementById("number");

const getGroupInfo = fetch(`http://localhost:5000/users/id`)
.then((response)=>response.json())
.then((response)=>{
    let originalData = response;
    let name = originalData.displayname;

     //사용자 이름 
    userName.innerHTML = name;

})

fetch(`http://localhost:5000/groups/groupName`)
.then((response)=>response.json())
.then((response)=>{
    let originalData = response;
    let groupName = originalData.groupName;
    let groupDescription = originalData.groupDescription;
    let groupNumber = originalData.groupMember.length;

    // 그룹 이름
    group.innerHTML = groupName;
    
    // 그룹 설명
    explain.innerHTML = groupDescription;

    //그룹 인원
    number.innerHTML = groupNumber;
})