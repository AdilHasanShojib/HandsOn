const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Middleware to Protect Routes
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // ✅ Debugging step
  
    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
  
    const token = authHeader.split(" ")[1]; // Extract token
    console.log("Extracted Token:", token); // ✅ Debugging step
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded Token:", decoded); // ✅ Check what is inside the token
      req.user = decoded; // ✅ Assign decoded payload to req.user
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  };

  module.exports = authMiddleware;