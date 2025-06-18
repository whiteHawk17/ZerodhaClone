// const jwt = require('jsonwebtoken');
// console.log('JWT imported:', jwt ? 'Success' : 'Failed');
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    console.log("Auth Headers:", JSON.stringify(req.headers, null, 2));
    const authHeader = req.header("Authorization");
    console.log("Raw Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Invalid Authorization header format");
      return res
        .status(401)
        .json({ message: "Invalid token format, access denied" });
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Extracted token:", token);

    if (!token) {
      console.log("No token found in Authorization header");
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    try {
      console.log(
        "Attempting to verify token with secret:",
        process.env.JWT_SECRET
      );
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified successfully:", verified);
      req.user = verified;
      next();
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError.message);
      return res.status(401).json({
        message: "Token verification failed, authorization denied",
        error: verifyError.message,
      });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({
      message: "Token verification failed, authorization denied",
      error: err.message,
    });
  }
};

// module.exports = auth;
export default auth;
