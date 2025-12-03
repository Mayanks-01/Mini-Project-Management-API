const express = require("express");
const router = express.Router();
const { createTask, listTasks } = require("../controllers/tasksController");

router.post("/", createTask);
router.get("/", listTasks);

module.exports = router;
