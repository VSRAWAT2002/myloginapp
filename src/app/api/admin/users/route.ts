import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== "admin") {
            return NextResponse.json({ error: "Access Denied: Admins only" }, { status: 403 });
        }

        const users = await User.find({}).select("-password").sort({ createdAt: -1 });

        const totalUsers = users.length;
        const adminCount = users.filter(u => u.role === 'admin').length;
        
        return NextResponse.json({
            users,
            stats: {
                totalUsers,
                adminCount,
                regularUsers: totalUsers - adminCount
            }
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
    }
}