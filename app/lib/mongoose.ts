import mongoose from "mongoose";
let isConnected = false;
const connectDb = async () => {
  if (isConnected) return;
  const MONGODB_URI = process.env.MONGO_URI!;
  console.log("Mongo db uri is : ", MONGODB_URI);

  try {
    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
      );
    }
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Mongoose connected successfully");
    isConnected = true;
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
  }
};

export default connectDb;
