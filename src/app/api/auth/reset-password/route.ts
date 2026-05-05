import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, otp, newPassword } = await req.json();

        const user = await User.findOne({ 
            email: email.toLowerCase(),
            resetPasswordOtp: otp,
            resetPasswordOtpExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();

        return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}