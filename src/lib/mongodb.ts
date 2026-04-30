import mongoose from 'mongoose';

const MONGODB_URI="mongodb+srv://vijaysinghrawat2002:<db_password>@cluster0.uqxh3.mongodb.net/?appName=Cluster0";

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};