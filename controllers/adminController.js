const userModel = require("../models/userModel");

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Create admin user with role = 'admin'
    const admin = new userModel({
      name,
      email,
      password,
      phone,
      address,
      role: "admin",
    });

    await admin.save();

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin,
    });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in Admin Registration API",
      error: error.message,
    });
  }
};


//GET DONAR LIST
const getDonarsListController = async (req, res) => {
  try {
    const donarData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: donarData.length,
      message: "Donar List Fetched Successfully",
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Donar List API",
      error,
    });
  }
};
//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: hospitalData.length,
      message: "Hospital List Fetched Successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Hospital List API",
      error,
    });
  }
};
//GET ORG LIST
// const getOrgListController = async (req, res) => {
//   try {
//     const orgData = await userModel
//       .find({ role: "organisation" })
//       .sort({ createdAt: -1 });

//     return res.status(200).send({
//       success: true,
//       Toatlcount: orgData.length,
//       message: "ORG List Fetched Successfully",
//       orgData,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: "Error In ORG List API",
//       error,
//     });
//   }
// };
// =======================================

const getOrgListController = async (req, res) => {
  try {
    const organizations = await userModel.find({ role: "organization" });
    res.status(200).json({
      success: true,
      message: "Organization List Fetched Successfully",
      organizations,
    });
  } catch (error) {
    console.error("Org List Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in Organization List API",
      error: error.message,
    });
  }
};

//DELETE DONAR
const deleteDonarController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: " Record Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting ",
      error,
    });
  }
};

//EXPORT
module.exports = {
  registerAdmin,
  getDonarsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
};