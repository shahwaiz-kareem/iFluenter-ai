import mongoose from "mongoose";

const isconnected = false;

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    if (isconnected) return console.log("Database is already connected!");
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(`Database not connected! error: ${error.message}`);
  }
};

export default connectDB;
