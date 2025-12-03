const express = require("express");
const router = express.Router();
const { createProject } = require("../controllers/projectsController");

router.post("/", createProject);

module.exports = router;
