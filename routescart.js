import express from "express";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/cart  => get cart for current user
router.get("/", verifyToken, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
  res.json(cart || { userId: req.user.id, items: [] });
});

// POST /api/cart/add  => add item
router.post("/add", verifyToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [{ productId, quantity }] });
  } else {
    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx >= 0) cart.items[idx].quantity += quantity;
    else cart.items.push({ productId, quantity });
    cart.updatedAt = Date.now();
  }

  await cart.save();
  res.json(cart);
});

// PUT /api/cart/update/:itemId => update quantity
router.put("/update/:itemId", verifyToken, async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(400).json({ message: "Cart not found" });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });
  item.quantity = quantity;
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
});

// DELETE /api/cart/remove/:itemId
router.delete("/remove/:itemId", verifyToken, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(400).json({ message: "Cart not found" });
  cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
});

// DELETE /api/cart/clear
router.delete("/clear", verifyToken, async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.id });
  res.json({ message: "Cart cleared" });
});

export default router;