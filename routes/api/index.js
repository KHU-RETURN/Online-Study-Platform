const express = require('express'),
  router = express.Router(),
  userModel = require('../../models/users.js'),
  groupModel = require('../../models/groups.js');

router.get('/main', async function (req, res) {
  var result = {};
  result.name = req.session.user.displayName;
  result.profileImage = req.session.user.photos;

  result.groupName = [];
  result.groupExplain = [];
  result.groupNumber = [];
  result.color = [];
  result.pageLink = [];

  var groupArr = req.session.user.groups;

  for (var i = 0; i < groupArr.length; i++) {
    var group = await groupModel.findById(groupArr[i].id);
    result.groupName.push(group.groupName);
    result.groupExplain.push(group.groupDescription);
    result.groupNumber.push(group.groupMember.length);
    result.color.push(group.color);
    result.pageLink.push("/group?id="+groupArr[i].id);
  }
  res.send(result);
});

router.get('/get_user', async function (req, res) {
  var result = {};
  result.name = req.session.user.displayName;
  result.profileImage = req.session.user.photos;
  result.groups = req.session.user.groups;
  for (var i = 0; i < result.groups.length; i++) {
    var group = await groupModel.findById(result.groups[i].id);
    result.groups[i].groupName = group.groupName;
  }
  res.send(result);
});

router.get('/get_user/:id', async function (req, res) {
  var result = {};
  var user = await userModel.findOne({ id: req.params.id });
  result.displayName = user.displayName;
  result.photos = user.photos;
  res.send(result);
});

router.get('/group/:id', async function (req, res) {
  const group = await groupModel.findById(req.params.id);
  var result = {};
  result.name = group.groupName;
  result.description = group.groupDescription;
  result.color = group.color;
  result.groupMember = group.groupMember;
  result.conference = group.conference;

  res.send(result);
});

router.post('/edit_profile_image', async function (req, res) {
    await userModel.findOneAndUpdate({ id: req.session.user.id }, {photos:req.body.image});
});

router.post('/edit_profile_name', async function (req, res) {
    await userModel.findOneAndUpdate({ id: req.session.user.id }, {displayName:req.body.displayName});
});

router.post('/make_group', async function (req, res) {
  var user = await userModel.findOne({ id: req.session.user.id });
  var newGroup = req.body;
  newGroup.groupMember = [{id: user.id}];
  const group = new groupModel(newGroup);
  const result = await group.save();
  const code = result._id;

  user.groups.push({id: code, owner: true,});
  await userModel.findOneAndUpdate({ id: req.session.user.id }, user);
  res.send("finish");
});

router.post('/join_group', async function (req, res) {
  var user = await userModel.findOne({ id: req.session.user.id });
  try {
    var group = await groupModel.findOne({ _id: req.body.code });
    if (!group) return res.send("no");
    if (user.groups.find((item) => { return (item.id == req.body.code) })) return res.send("already");
    group.groupMember.push({ id: user.id });
    await groupModel.findByIdAndUpdate(req.body.code, group);

    user.groups.push({ id: req.body.code, owner: false, });
    await userModel.findOneAndUpdate({ id: req.session.user.id }, user);
    res.send("finish");
  } catch (error) {
    return res.send("no");
  }
});

router.delete('/exit_group/:code', async function (req, res) {
  var user = await userModel.findOne({ id: req.session.user.id });
  var group = await groupModel.findById(req.params.code);
  group.groupMember.pop(group.groupMember.findIndex((item)=> { return (item.id == req.params.code) }));
  await groupModel.findByIdAndUpdate(req.params.code, group);
  user.groups.pop(user.groups.find((item)=> { return (item.id == req.params.code) }));
  await userModel.findOneAndUpdate({id: user.id}, user);
  res.send("finish");
});

router.put('/modify_group/:code', async function (req, res) {
  var group = await groupModel.findById(req.params.code);
  group.groupName = req.body.groupName;
  group.groupDescription = req.body.groupDescription;
  group.color = req.body.color;
  await groupModel.findByIdAndUpdate(req.params.code, group);
  res.send("finish");
});

router.get('/modify_group/:code', async function (req, res) {
  var user = await userModel.findOne({ id: req.session.user.id });
  var group = await groupModel.findById(req.params.code);
  var result = {success: false};
  if (group == null) return res.send(result);
  if (!user.groups.find((item) => { return (item.id == req.params.code) }).owner) return res.send(result);
  result.groupName = group.groupName;
    result.groupDescription = group.groupDescription;
    result.color = group.color;
    result.success = true;
  res.send(result);
});

router.delete('/delete_group/:code', async function (req, res) {
  var group = await groupModel.findById(req.params.code);
  group.groupMember.forEach(async (element) => {
    var user = await userModel.findOne({ id: element.id });
    user.groups.splice(user.groups.findIndex((item) => { return (item.id == req.params.code) }), 1);
    await userModel.findOneAndUpdate({ id: req.session.user.id }, user);
  })
  await groupModel.findByIdAndDelete(req.params.code);
});

router.get('/get_chat', async function (req, res) {
  var result = [{id: req.session.user.id}];
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  var chat = currGroup.chat;
  for(var i = 0; i < chat.length; i++){
    var prevObj = {id: chat[i].id, message: chat[i].message, date: chat[i].date};
    var user = await userModel.findOne({ id: chat[i].id });
    prevObj.name = user.displayName;
    prevObj.profileImage = user.photos;
    result.push(prevObj);
  }
  res.send(result);
});

router.get('/get_conference/:confId', async function (req, res) {
  var result = {};
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  const confId = req.params.confId;
  result = currGroup.conference.find((item)=> {return item._id.toString() === confId});
  res.send(result);
});

router.put('/edit_conference/:confId', async function (req, res) {
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  const confId = req.params.confId;
  for(var i = 0; i <currGroup.conference.length; i++) {
    if(currGroup.conference[i]._id == confId){
      currGroup.conference[i].record = req.body.record.ops;
    }
  }
  await groupModel.findByIdAndUpdate(groupId, currGroup);
  res.send("finished");
});

router.get('/get_penalty', async function (req, res) { // 벌금 목록 가져오기
  var result = [];
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  var fine = currGroup.fine;
  for(var i = 0; i < fine.length; i++){
    var prevObj = {id: fine[i].id, amount: fine[i].amount, date: fine[i].date};
    var user = await userModel.findOne({ id: fine[i].id });
    prevObj.name = user.displayName;
    prevObj.profileImage = user.photos;
    result.push(prevObj);
  }
  
  res.send(result);
});

router.post('/add_penalty', async function (req, res) { // 벌금 추가
  var result = {};
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  currGroup.fine.push(req.body);
  await groupModel.findByIdAndUpdate(groupId, currGroup);
  res.send("finish");
});

router.get('/get_todo', async function (req, res) { // 벌금 목록 가져오기
  var userId = [{id: req.session.user.id}];
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  var groupMember = [];
  for(var i = 0; i < currGroup.groupMember.length; i++){
    var prevObj = {id: currGroup.groupMember[i].id, todo: currGroup.groupMember[i].todo};
    var user = await userModel.findOne({ id: currGroup.groupMember[i].id });
    prevObj.name = user.displayName;
    groupMember.push(prevObj);
  }
  var groupMember = userId.concat(groupMember);
  
  res.send(groupMember);
});

router.post('/add_todo', async function (req, res) { // 벌금 목록 가져오기
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  for(var i = 0; i < currGroup.groupMember.length; i++) {
    if(currGroup.groupMember[i].id == req.session.user.id){
      currGroup.groupMember[i].todo.push(req.body);
    }
  }
  currGroup = await groupModel.findByIdAndUpdate(groupId, currGroup, {new: true});
  var result = currGroup.groupMember.find((item)=> {return item.id === req.session.user.id});
  res.send(result.todo[result.todo.length-1]);
});

router.put('/edit_todo', async function (req, res) { // 벌금 목록 가져오기
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  for(var i = 0; i < currGroup.groupMember.length; i++) {
    if(currGroup.groupMember[i].id == req.session.user.id){
      currGroup.groupMember[i].todo = req.body;
    }
  }
  await groupModel.findByIdAndUpdate(groupId, currGroup);
  res.send("finish");
});

router.get('/get_goal', async function (req, res) { //목표 조회
  var result = {};
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  result.goal = currGroup.todo;
  res.send(result);
})

router.post('/edit_goal', async function (req, res) { //목표 추가
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  for(var i = 0; i < currGroup.todo.length; i++) {
    if(currGroup.todo[i]._id == req.session.code) {
      currGroup.todo[i]._id.push(req.body);
    }
  }
  currGroup = await groupModel.findByIdAndUpdate(groupId, currGroup, {new: true});
  var result = currGroup.todo.find((item)=> {return item.id === req.session.code});
  res.send(result.todo[result.todo.length-1]);
  res.send("finish");
})

router.put('/edit_goal', async function (req, res) { //목표 수정
  const groupId = req.session.groupId;
  var currGroup = await groupModel.findById(groupId);
  for(var i = 0; i < currGroup.todo.length; i++) {
    if(currGroup.todo[i]._id == req.session.code) {
      currGroup.todo[i]._id == req.body;
    }
  }
  await groupModel.findByIdAndUpdate(groupId, currGroup);
  res.send("finish");
})


module.exports = router;