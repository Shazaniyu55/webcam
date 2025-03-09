import mongoose from "mongoose";
// Load environment variables

const MONGO_URI = "mongodb+srv://shazaniyu:webcam@cluster0.23vbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    
  }
};

export default connectDB;
