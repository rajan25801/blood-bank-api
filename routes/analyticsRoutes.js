const express = require("express");
const authMiddelware = require("../middlewares/authMiddleware");
const { bloodGroupDetailsContoller } = require("../controllers/analyticsController");

const router = express.Router();

// GET BLOOD GROUP ANALYTICS
router.get("/blood-analytics", authMiddelware, bloodGroupDetailsContoller);

module.exports = router;
