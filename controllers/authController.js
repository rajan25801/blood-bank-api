const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const registerController = async (req, res) => {
//   try {
//     const existingUser = await userModel.findOne({ email: req.body.email });
    
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     req.body.password = hashedPassword;

//     const user = new userModel(req.body);
//     await user.save();

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error in Register API",
//       error: error.message,
//     });
//   }
// };

// const registerController = async (req, res) => {
//   try {
//     const existingUser = await userModel.findOne({ email: req.body.email });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     req.body.password = hashedPassword;

//     // ✅ DEBUG LOGGING
//     console.log("Registering user with:", {
//       email: req.body.email,
//       role: req.body.role,
//       name: req.body.name,
//     });

//     const user = new userModel(req.body);
//     await user.save();

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error in Register API",
//       error: error.message,
//     });
//   }
// };

// const loginController = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     console.log("Login attempt:", { email, role });

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid Credentials",
//       });
//     }

//     console.log("Stored Role:", user.role);
//     console.log("Requested Role:", role);

//     if (user.role.toLowerCase().trim() !== role.toLowerCase().trim()) {
//       return res.status(403).json({
//         success: false,
//         message: `Role doesn't match. Expected: ${user.role}, Received: ${role}`,
//       });
//     }
    

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid Credentials",
//       });
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user,
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error in Login API",
//       error: error.message,
//     });
//   }
// };

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ Just create the user with plain password (will be hashed by Mongoose pre-save hook)
    const user = new userModel(req.body);
    await user.save();

    console.log("✅ Registered user:", {
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in Register API",
      error: error.message,
    });
  }
};
 
const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Login attempt:", { email, role });

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    console.log("Stored Role:", user.role);
    console.log("Requested Role:", role);

    if (user.role.toLowerCase().trim() !== role.toLowerCase().trim()) {
      return res.status(403).json({
        success: false,
        message: `Role doesn't match. Expected: ${user.role}, Received: ${role}`,
      });
    }

    console.log("Entered password:", password);
    console.log("Stored hashed password:", user.password);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in Login API",
      error: error.message,
    });
  }
};

const currentUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Current User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to get current user",
      error: error.message,
    });
  }
};

module.exports = { registerController, loginController, currentUserController };