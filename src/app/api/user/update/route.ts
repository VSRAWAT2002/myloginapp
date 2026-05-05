import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbconnect";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload }: any = await jwtVerify(token, secret);
        
        
        const userId = typeof payload.id === 'object' ? payload.id.toString() : payload.id;

        const { profilePic } = await req.json();

        if (!profilePic) {
            return NextResponse.json({ error: "No image data provided" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic },
            { new: true } 
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Profile picture updated", 
            profilePic: updatedUser.profilePic 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Update API Error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}