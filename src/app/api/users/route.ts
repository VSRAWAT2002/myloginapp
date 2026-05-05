import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";

export async function GET() {
    await dbConnect();
    const allUsers = await User.find({}).select("-password");
    return NextResponse.json(allUsers);
}