// routes/userRoutes.js
import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/userController.js";
import { sendOtp, verifyOtp } from "../utils/authController.js";
import userAuth from "../middlewares/Auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", userAuth, logoutUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/userdata", userAuth, async (req, res) => {
    res.status(200).json(req.user); 
  });


export default router;