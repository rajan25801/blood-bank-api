const express = require("express");
const authMiddelware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  registerAdmin,
  getDonarsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
  getDonorAssociationsController,
} = require("../controllers/adminController");

// Router object
const router = express.Router();

// =======================
// ADMIN ROUTES
// =======================

// POST || Register Admin
router.post("/register", registerAdmin);

// GET || Donar List
router.get(
  "/donar-list",
  authMiddelware,
  adminMiddleware,
  getDonarsListController
);

// GET || Hospital List
router.get(
  "/hospital-list",
  authMiddelware,
  adminMiddleware,
  getHospitalListController
);

// GET || Organization List
router.get(
  "/org-list",
  authMiddelware,
  adminMiddleware,
  getOrgListController
);


// DELETE || Donar
router.delete(
  "/delete-donar/:id",
  authMiddelware,
  adminMiddleware,
  deleteDonarController
);

// GET || Donor Associations (optional, uncomment if implemented)
// router.get(
//   "/donor-associations/:id",
//   authMiddelware,
//   adminMiddleware,
//   getDonorAssociationsController
// );

// Export router
module.exports = router;
