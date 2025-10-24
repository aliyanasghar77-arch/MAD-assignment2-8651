import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/profile
router.get("/", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// PUT /api/profile/update
router.put("/update", verifyToken, async (req, res) => {
  const { name, address, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, address, phone }, { new: true }).select("-password");
  res.json({ message: "Profile updated", user });
});

export default router;