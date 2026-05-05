import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { loginSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 },
            );
        }

        const { email, password } = validation.data;
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 },
            );
        }

        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role || "user",
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

        return NextResponse.json(
            {
                message: "Login successful!",
                user: { username: user.username, email: user.email },
            },
            { status: 200 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}