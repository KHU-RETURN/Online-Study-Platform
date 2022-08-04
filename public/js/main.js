const userName = document.getElementById("user-name");
const groupButton = document.getElementById("grouplayer");
const profile = document.getElementById("circle");

//id 임의로 지정
const id = "msm4167";

//id로 값 가져오기
const getGroupInfo = fetch(`http://localhost:5000/main/${id}`)
.then((response)=>response.json())
.then((response)=>{
    let originalData = response;
    let name = originalData.name;
    let groupNameArray = originalData.groupName;
    let groupExplainArray = originalData.groupExplain;
    let groupNumberArray = originalData.groupNumber;
    let groupColor = originalData.color;
    let profileSrc = originalData.profileImage;
    let groupLink = originalData.pageLink;
    
    //사용자 이름 
    userName.innerHTML = name;

    //프로필 사진 등록
    if(profileSrc.length != ""){
        profile.setAttribute("src",profileSrc);
    }else{
        profile.style.padding = "50px" 
    }
    
    //그룹 있을 때만 버튼 생성
    if(groupNameArray.length != 0){
        for(let i = 0; i < groupNameArray.length; i++){
            const El = document.createElement("a");
            groupButton.appendChild(El);
            groupButton.children[i].classList.add("col");
            groupButton.children[i].id = "group-icon";
            groupButton.children[i].setAttribute("href",groupLink[i]); //링크 연결
        }
    }
    //버튼 생성
    makeGroupButton(groupNameArray, groupExplainArray, groupNumberArray, groupColor);
});

//버튼 생성 함수
function makeGroupButton(array1, array2, array3, array4){
    for(let i = 0; i < array1.length; i++){
        const El = document.createElement("div");
        groupButton.children[i].appendChild(El);
        groupButton.children[i].children[0].classList.add("group-information");
        groupButton.children[i].children[0].style.backgroundColor = array4[i];
    }
    for(let i = 0; i< array1.length; i++){
        for(let j = 0; j < 3; j++){
            const El = document.createElement("div");
            groupButton.children[i].children[0].appendChild(El);
        }
            groupButton.children[i].children[0].children[0].className = "group_name";
            groupButton.children[i].children[0].children[1].className = "group_explain";
            groupButton.children[i].children[0].children[2].className = "group_number";

            groupButton.children[i].children[0].children[0].innerHTML = array1[i];
            groupButton.children[i].children[0].children[1].innerHTML = array2[i];
            groupButton.children[i].children[0].children[2].innerHTML = array3[i]+"명";
    }

    //그룹 설명 길어질 경우 글자 크기 조절
    const nameLine = document.getElementsByClassName("group_name");
    const explainLine = document.getElementsByClassName("group_explain");
    const numberLine = document.getElementsByClassName("group_number");

    for(let i = 0; i < explainLine.length; i++){
        if(explainLine[i].childNodes[0].length > 23){
            nameLine[i].style.marginBottom = "2px";
            explainLine[i].style.fontSize = "0.7rem";
            numberLine[i].style.marginTop = "0px";
        }
    }
}

