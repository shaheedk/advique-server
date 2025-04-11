import TokenBlacklist from "../models/tokenBlacklist.js";
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
const userAuth = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      const isBlacklisted = await TokenBlacklist.findOne({ token });
      if (isBlacklisted) {
        return res.status(401).json({ message: "Token is invalid or expired" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id).select("name email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = { name: user.name, email: user.email };
      next();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  };
  export default userAuth