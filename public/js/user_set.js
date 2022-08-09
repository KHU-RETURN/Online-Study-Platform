


let original_value;

let image = document.getElementById("image_icon");
var input=document.querySelector('input[type="file"]');
const group_name = document.getElementById("group_name");

var send=document.getElementById("name2");
var _name = document.getElementById("name");
let priginal_value;


fetch("http://localhost:5000/users/1") //id로 불러올 때. 
  // 다른걸로 불러 올 때 /?user_name=정주희"
  .then((response) => response.json())
  .then((data) => {
    original_value=data;
    console.log(original_value);
    user_name = original_value.user_name;
    image.src=original_value.profile_image;
    _name.value = user_name;
    group_list = original_value.groups; 
    group_list.forEach((element) => {
      if (element.owner === user_name) {
        let groupname = `<option value=${element.id}>${element.group_name}</option>`;
        group_name.innerHTML += groupname;
        //console.log(element.id);
      }
    });

});

const reader = new FileReader();
reader.onload = (readerEvent) => {
    document.querySelector("#image_icon").setAttribute("src", readerEvent.target.result);
};

document.querySelector("#form_data").addEventListener("change", (changeEvent) => {
    const imgFile = changeEvent.target.files[0];   
    reader.readAsDataURL(imgFile);
    //changeImage(~~)
    
});
send.addEventListener("click",function(){
  var forms=document.getElementById("name_form");
  var nname=document.getElementById("name");
  console.log(nname);
  fetch("http://localhost:5000/users/"+original_value.id, {
    method: "PUT",
    body: JSON.stringify({
      "id": original_value.id,
      "user_name": nname.value,
      "profile_image": original_value.profile_image,
      "groups": original_value.groups
    }),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
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
  _data.profile_image="images/icon.png";
  fetch("http://localhost:5000/users/1", {
    method: "PUT",
    body: JSON.stringify(_data),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
  image.src="images/icon.png";
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
