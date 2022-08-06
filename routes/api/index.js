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

router.get('/group/:id', async function (req, res) {
  const group = await groupModel.findById(req.params.id);
  var result = {};
  result.name = group.groupName;
  result.description = group.groupDescription;
  result.color = group.color;

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
    group.groupMember.push({ id: user.id });
    await groupModel.findByIdAndUpdate(req.body.code, group);

    user.groups.push({ id: req.body.code, owner: false, });
    await userModel.findOneAndUpdate({ id: req.session.user.id }, user);
    res.send("finish");
  } catch (error) {
    return res.send("no");
  }
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


module.exports = router;