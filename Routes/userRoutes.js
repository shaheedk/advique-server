import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { sendOtp, verifyOtp } from "../utils/authController.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
export default router;
