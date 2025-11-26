import mongoose from "mongoose";

const connectDb = async () => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    console.log("💡 Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "egg",   // 👈 VERY IMPORTANT
    });
    console.log("🌐 Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

export default connectDb;
