import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/orders  -> user orders
router.get("/", verifyToken, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
  res.json(orders);
});

// POST /api/orders/create  -> create order from cart
router.post("/create", verifyToken, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart empty" });

  const items = cart.items.map(i => ({
    productId: i.productId._id,
    quantity: i.quantity,
    price: i.productId.price,
    name: i.productId.name,
    image_url: i.productId.image_url
  }));

  const totalAmount = items.reduce((s, it) => s + it.price * it.quantity, 0);

  const order = new Order({
    userId: req.user.id,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod
  });

  await order.save();
  await Cart.findOneAndDelete({ userId: req.user.id }); // clear cart
  res.json({ message: "Order placed", order });
});

// GET /api/orders/:id
router.get("/:id", verifyToken, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;