const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getOrganisationController,
  registerOrganisationController, // Import the new controller
} = require("../controllers/organisationController");

const router = express.Router();

// Register Organisation Route (No Auth Required)
router.post("/register-organisation", registerOrganisationController);

// GET Organisations (Requires Auth)
router.get("/get-organisations", authMiddleware, getOrganisationController);

module.exports = router;
