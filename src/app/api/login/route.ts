import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();

        
        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);


        if (!isPasswordMatch) {
            return NextResponse.json(
                { error: "Invalid Credentials" },
                { status: 401 },
            );
        }

        return NextResponse.json({ 
      message: "Login successful!", 
      user: { username: user.username, email: user.email } 
    });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
