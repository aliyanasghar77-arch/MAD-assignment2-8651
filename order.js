import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
      name: String,
      image_url: String
    }
  ],
  totalAmount: Number,
  status: { type: String, default: "Pending" },
  shippingAddress: String,
  paymentMethod: String,
  orderDate: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);