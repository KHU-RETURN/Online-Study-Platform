let original_value;

let image = document.getElementById("image_icon");
var input=document.querySelector('input[type="file"]');
const group_name = document.getElementById("group_name");

var send=document.getElementById("name2");
var _name = document.getElementById("name");
var btn = document.getElementById("btn");
let priginal_value;


fetch("/api/get_user") //id로 불러올 때. 
  // 다른걸로 불러 올 때 /?user_name=정주희"
  .then((response) => response.json())
  .then((data) => {
    original_value=data;
    user_name = original_value.name;
    image.src="data:image/png;base64, "+original_value.profileImage;
    _name.value = user_name;
    group_list = original_value.groups; 
    group_list.forEach((element) => {
      if (element.owner) {
        let groupname = `<option value=${element.id}>${element.groupName}</option>`;
        group_name.innerHTML += groupname;
        //console.log(element.id);
      }
    });

});

// const reader = new FileReader();
// reader.onload = (readerEvent) => {
//     document.querySelector("#image_icon").setAttribute("src", readerEvent.target.result);
// };

// document.querySelector("#form_data").addEventListener("change", (changeEvent) => {
//     const imgFile = changeEvent.target.files[0];   
//     reader.readAsDataURL(imgFile);
//     //changeImage(~~)
    
// });

const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file.size <= 100000) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = reader.result.split("base64,")[1];
            $.ajax({
                url: '/api/edit_profile_image',
                dataType: 'json',
                type: 'POST',
                data: { image: img }
            });
        };
        reader.readAsDataURL(file);
        setTimeout(() => { location.href = "/user_setting"; }, 100);
    } else {
        alert("100KB이하의 사진 만 가능합니다.");
    }
});


send.addEventListener("click",function(){
  var nname = document.getElementById("name");
  $.ajax({
    url: '/api/edit_profile_name',
    dataType: 'json',
    type: 'POST',
    data: { displayName: nname.value }
  });
  setTimeout(() => { location.href = "/user_setting"; }, 100);

  // fetch("http://localhost:5000/users/"+original_value.id, {
  //   method: "PUT",
  //   body: JSON.stringify({
  //     "id": original_value.id,
  //     "user_name": nname.value,
  //     "profile_image": original_value.profile_image,
  //     "groups": original_value.groups
  //   }),
  //   headers: {
  //     "content-type": "application/json",
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((json) => console.log(json));
})
  
btn.addEventListener("click",function(){
  if(group_name.value !== "")
    location.href = "/edit_group/"+group_name.value;
})

/*
function changeImage(_img){
  _data.profile_image=_img;
  
  fetch("http://localhost:5000/users/1", {
    method: "PUT",
    body: JSON.stringify(_data),
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
    
}*/
function deleteFile(){
  var img = "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"
  $.ajax({
    url: '/api/edit_profile_image',
    dataType: 'json',
    type: 'POST',
    data: { image: img }
  });
  setTimeout(() => { location.href = "/user_setting"; }, 100);

  // _data.profile_image="images/icon.png";
  // fetch("http://localhost:5000/users/1", {
  //   method: "PUT",
  //   body: JSON.stringify(_data),
  //   headers: {
  //     "content-type": "application/json",
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((json) => console.log(json));
  // image.src="images/icon.png";
}

/*
const formData = new FormData();
const fileField=document.querySelector('input[type="file"]');
formData.append("profile_image",fileField.files[0]);

fetch('http://localhost:5000/users/'+image.src, {
  method: 'PUT',
  body: formData,
  image.src=fileField.files[0]
})
.then((response) => response.json())
.then((result) => {
  console.log('Success:', result);
  console.log(formData);
})
.catch((error) => {
  console.error('Error:', error);
});*/