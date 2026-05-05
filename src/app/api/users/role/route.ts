import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token!, secret);

        if (payload.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { userId, newRole } = await req.json();
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { role: newRole }, 
            { new: true }
        );

        return NextResponse.json({ message: "Role updated", user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}