import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } 
) {
   try {
        await dbConnect();
        const { id } = await params;  

        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (payload.id === id) {
            return NextResponse.json({ error: "You cannot delete your own admin account!" }, { status: 400 });
        }

        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: "User deleted successfully" });

    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}