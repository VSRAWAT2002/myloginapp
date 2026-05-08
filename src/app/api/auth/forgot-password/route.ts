import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ message: "If an account exists, an OTP has been sent." }, { status: 200 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = otpExpiry;
        await user.save();

        await sendEmail({
            to: user.email,
            subject: "Your Password Reset OTP",
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Password Reset Request</h2>
                    <p>Use the following One-Time Password (OTP) to reset your password. This code expires in 10 minutes.</p>
                    <h1 style="color: #16a34a; letter-spacing: 5px;">${otp}</h1>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        });

        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}