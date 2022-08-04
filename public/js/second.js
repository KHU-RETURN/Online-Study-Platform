var select = $('#groups');

var selectId;

fetch("/api/get_my_groups", {
    method: "POST",
})
    .then((response) => response.json())
    .then((json) => {
        selectId = json[0].id;
        json.forEach((group) => {
            $('<option>', {
                value: group.id,
                text: group.groupName
            }).appendTo(select);
        })
    });

function edit() {
    if (selectId)
        location.href = "/edit_group/" + selectId;
}

const changeValue = (target) => {
    selectId = target.value;
}