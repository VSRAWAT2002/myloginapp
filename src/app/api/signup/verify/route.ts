import { NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbconnect";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { sendEmail } from "@/lib/sendEmail"; 

export const maxDuration = 60; 

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { username, email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            profilePic: "", 
            role: "user",
            isVerified: true 
        });

        try {
            await sendEmail({
                to: newUser.email,
                subject: "Welcome to MyLoginApp! 🎉",
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #16a34a;">Congratulations, ${username}!</h2>
                        <p>Your account has been successfully created and verified.</p>
                        <p>You are now part of our community. Explore your dashboard to get started!</p>
                        <br />
                        <p style="font-size: 0.8rem; color: #888;">If you didn't create this account, please ignore this email.</p>
                    </div>
                `,
            });
        } catch (emailError) {
             
        }

         
        const payload = {
            id: newUser._id.toString(), 
            email: newUser.email,
            role: "user",
        };

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(secret);

        const cookieStore = await cookies();
        cookieStore.set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8,
        });

        return NextResponse.json({ 
            message: "User created and logged in successfully",
            user: { username: newUser.username, email: newUser.email }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
    }
}