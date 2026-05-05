import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload }: any = await jwtVerify(token, secret);

        let userId = payload.id;
        if (typeof userId === 'string' && userId.includes("[object Object]")) {
            return NextResponse.json({ error: "Invalid session format. Please logout and login again." }, { status: 401 });
        }
        
        const cleanId = typeof userId === 'object' ? userId.toString() : userId;

        const user = await User.findById(cleanId).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error("Auth API Error:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}