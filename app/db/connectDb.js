import mongoose from "mongoose";

const connectDb = async () => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    console.log("💡 Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/egg");
    // console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

export default connectDb;
