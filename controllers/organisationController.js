const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

// Controller to fetch all organisations
const getOrganisationController = async (req, res) => {
  try {
    // Fetch only users with role "organisation"
    const organisations = await userModel.find({ role: "organization" }).select("-password");


    if (!organisations.length) {
      return res.status(404).json({
        success: false,
        message: "No Organisations Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Organisation Data Fetched Successfully",
      organisations,
    });
  } catch (error) {
    console.error("Error fetching organisations:", error);
    return res.status(500).json({
      success: false,
      message: "Error Fetching Organisation Data",
      error: error.message,
    });
  }
};
const registerOrganisationController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if email already exists
    const existingOrg = await userModel.findOne({ email });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new organisation
    const organisation = new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "organisation",
    });

    await organisation.save();

    return res.status(201).json({
      success: true,
      message: "Organisation Registered Successfully",
      organisation: {
        _id: organisation._id,
        name: organisation.name,
        email: organisation.email,
        phone: organisation.phone,
        address: organisation.address,
        role: organisation.role,
        createdAt: organisation.createdAt,
      },
    });
  } catch (error) {
    console.error("Error registering organisation:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering organisation",
      error: error.message,
    });
  }
};

module.exports = { getOrganisationController, registerOrganisationController };
