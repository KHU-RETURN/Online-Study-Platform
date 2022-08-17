init();

function init() {
  var confId = getParameter("id");
  console.log(groupId, confId);
  fetch("/api/get_conference/"+confId)
  .then((response)=>response.json())
  .then((response)=>{
    var dateFormat = new Date(response.date);
    dateFormat = (dateFormat.getFullYear()) + "년 " + (dateFormat.getMonth()+1) + "월 " + dateFormat.getDate() + "일";
    document.getElementById("date").innerHTML = dateFormat;
    document.getElementById("title").innerHTML = response.title;
    document.getElementById("record").innerHTML = response.record;
  })
}

function getParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
