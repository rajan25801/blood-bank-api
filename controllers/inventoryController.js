const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
const Inventory = require("../models/inventoryModel");
// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { inventoryType, bloodGroup, quantity, email, organisation, hospital, donar } = req.body;

    if (!inventoryType || !bloodGroup || !quantity || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newInventory = new Inventory({
      inventoryType,
      bloodGroup,
      quantity,
      email,
      organisation,
      hospital,
      donar,
    });

    await newInventory.save();
    res.status(201).json({ success: true, message: "Inventory added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in Create Inventory API", error: error.message });
  }
};



// GET ALL BLOOD RECORDS
const getInventoryController = async (req, res) => {
  try {
    // Fetch all inventories without filtering by userId
    const inventory = await inventoryModel
      .find({})
      .populate("donar", "name email phone") // Show donor details
      .populate("hospital", "hospitalName email phone") // Show hospital details
      .populate("organisation", "organisationName email phone") // Show organisation details
      .sort({ createdAt: -1 }); // Latest records first

    // Check if inventory exists
    if (inventory.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No inventory records found",
      });
    }

    // Success Response
    return res.status(200).send({
      success: true,
      message: "All inventory records fetched successfully",
      totalRecords: inventory.length,
      inventory,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error: error.message,
    });
  }
};

// GET HOSPITAL BLOOD RECORDS
const getInventoryHospitalController = async (req, res) => {
  const inventory = await inventoryModel
    .find(req.body.filters)
    .populate("donar", "name email phone")
    .populate("hospital", "hospitalName email phone")
    .populate("organisation", "organisationName email phone")
    .sort({ createdAt: -1 });

  return res.status(200).send({
    success: true,
    message: "Get hospital consumer records successfully",
    inventory,
  });
};


// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    // Fetch all inventory records regardless of the user's organization
    const inventory = await inventoryModel
      .find({})
      .limit(1000)
      .sort({ createdAt: -1 });
      
    return res.status(200).send({
      success: true,
      message: "Recent Inventory Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};


// GET DONOR RECORDS
const getDonarsController = async (req, res) => {
  try {
    // Find distinct donor IDs from the inventory
    const donorId = await inventoryModel.distinct("donar");

    // Fetch all donor details based on the collected IDs
    const donars = await userModel.find({ _id: { $in: donorId } });

    return res.status(200).send({
      success: true,
      message: "Donar Records Fetched Successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Donar records",
      error,
    });
  }
};

// GET HOSPITAL RECORDS
const getHospitalController = async (req, res) => {
  try {
    // Find distinct hospital IDs from the inventory
    const hospitalId = await inventoryModel.distinct("hospital");

    // Fetch all hospital details based on the collected IDs
    const hospitals = await userModel.find({ _id: { $in: hospitalId } });

    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get Hospital API",
      error,
    });
  }
};

// GET ORGANISATION PROFILES FOR USERS (Donors and Hospitals)
const getOrgnaisationController = async (req, res) => {
  try {
    const userId = req.body.userId; // Get the user ID (donor or hospital)

    // Determine the role of the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    let organisations;

    if (user.role === "donar") {
      // Fetch distinct organisations associated with the donor
      const orgId = await inventoryModel.distinct("organisation", { donar: userId });
      organisations = await userModel.find({ _id: { $in: orgId } });
    } else if (user.role === "hospital") {
      // Fetch distinct organisations associated with the hospital
      const orgId = await inventoryModel.distinct("organisation", { hospital: userId });
      organisations = await userModel.find({ _id: { $in: orgId } });
    } else {
      return res.status(403).send({
        success: false,
        message: "Unauthorized Role",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Organisation Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Fetching Organisation Data",
      error,
    });
  }
};


const getDonorAssociationsController = async (req, res) => {
  try {
    const { donorId } = req.params;

    const donorRecords = await Inventory.find({ donar: donorId })
      .populate("organisation", "organisationName email")
      .populate("hospital", "hospitalName email");

    if (!donorRecords.length) {
      return res.status(404).json({ message: "No associations found for this donor" });
    }

    const organisations = new Set();
    const hospitals = new Set();

    donorRecords.forEach((record) => {
      if (record.organisation) {
        organisations.add(JSON.stringify(record.organisation));
      }
      if (record.hospital) {
        hospitals.add(JSON.stringify(record.hospital));
      }
    });

    res.status(200).json({
      donorId,
      organisations: [...organisations].map(JSON.parse),
      hospitals: [...hospitals].map(JSON.parse),
    });

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalController,
  getOrgnaisationController,
  getInventoryHospitalController,
  getRecentInventoryController,
  getDonorAssociationsController, // Ensure this is included
};



