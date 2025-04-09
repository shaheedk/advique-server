import nodemailer from 'nodemailer';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import otpModel from '../models/otpModel.js';
// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP generator
function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  return { otp, expiresAt };
}


const sendOtp = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const { otp, expiresAt } = generateOtp();

   
    await otpModel.findOneAndUpdate(
      { email },
      { otp, otpExpires: expiresAt, name, password },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"AdviqueAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const record = await otpModel.findOne({ email });
    if (!record) return res.status(404).json({ success: false, message: "OTP not found" });

    if (record.otp !== Number(otp)) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    if (new Date() > record.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // If user doesn't exist, create from record
    let user = await userModel.findOne({ email });
    if (!user) {
      user = new userModel({
        email,
        name: record.name,
        password: record.password,
      });
      await user.save();
    }

    await otpModel.deleteOne({ email }); // Remove OTP record after success

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { sendOtp, verifyOtp };
