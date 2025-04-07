const express = require("express");
const authMiddelware = require("../middlewares/authMiddleware");
const {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalController,
  getOrgnaisationController,
  getInventoryHospitalController,
  getRecentInventoryController,
  getDonorAssociationsController,
} = require("../controllers/inventoryController");

const router = express.Router();

// ADD INVENTORY || POST
router.post("/create-inventory", authMiddelware, createInventoryController);

// GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddelware, getInventoryController);

// GET RECENT BLOOD RECORDS
router.get("/get-recent-inventory", authMiddelware, getRecentInventoryController);

// GET HOSPITAL BLOOD RECORDS
router.post("/get-inventory-hospital", authMiddelware, getInventoryHospitalController);

// GET DONOR RECORDS
router.get("/get-donars", authMiddelware, getDonarsController);

// GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddelware, getHospitalController);

// GET ORGANISATION RECORDS
router.get("/get-orgnaisation", authMiddelware, getOrgnaisationController);

// GET DONOR ASSOCIATED ORGANISATIONS & HOSPITALS
router.get("/donor-associations/:donorId", authMiddelware, getDonorAssociationsController);

module.exports = router;
