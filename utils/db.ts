import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

export async function connectToDB() {
  try {
    await mongoose.connect(MONGO_URI!); // ! define that it is null
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
    throw err;
  }
}
