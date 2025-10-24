// Seed some sample products into MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  { name: "Laptop", description: "15 inch laptop", price: 120000, category: "Electronics", stock: 10, image_url: "" },
  { name: "Phone", description: "Android smartphone", price: 45000, category: "Electronics", stock: 20, image_url: "" },
  { name: "Headphones", description: "Wireless headphones", price: 4000, category: "Accessories", stock: 30, image_url: "" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Seeded products");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();