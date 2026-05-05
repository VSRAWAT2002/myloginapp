import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    profilePic: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpires: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpires: Date,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
