const express = require("express");
const router = express.Router();
const { addComment } = require("../controllers/commentsController");

router.post("/:id/comments", addComment);

module.exports = router;
