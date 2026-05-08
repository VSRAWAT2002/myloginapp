import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Connection error:", error);
    throw error; 
  }
}
export default dbConnect;