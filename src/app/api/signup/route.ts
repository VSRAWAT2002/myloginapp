import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { signupSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";

export const maxDuration = 60; 

export async function POST(req: Request) {
    try {
        await dbConnect();
        
        const body = await req.json();
        const validation = signupSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message }, 
                { status: 400 }
            );
        }

        const { username, email } = validation.data;
        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" }, 
                { status: 400 }
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        try {
            await sendEmail({
                to: normalizedEmail,
                subject: "Verify Your Account - OTP",
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #16a34a;">Welcome!</h2>
                        <p>Hi ${username},</p>
                        <p>Please use the following One-Time Password (OTP) to verify your email:</p>
                        <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; color: #333;">${otp}</h1>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Email Sending Error:", emailError);
            return NextResponse.json({ error: "Failed to send verification email." }, { status: 500 });
        }

        return NextResponse.json({ message: "OTP sent successfully", otp: otp }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}