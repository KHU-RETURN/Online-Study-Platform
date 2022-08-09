const express = require("express"),
  router = express.Router();
  
router.get("/user_set", function (req, res, next) {
  res.render("user_set/index.html", { title: "main" });
});

router.get("/edit_group", function (req, res, next) {
  res.render("edit_group/index.html", { title: "main" });
});

module.exports = router;
