import mongoose from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log("Database connection failed");
  }
} ;