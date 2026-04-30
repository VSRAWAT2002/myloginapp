import { dbConnect } from "@/lib/dbconnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const formData = await req.formData();

        const rawData = Object.fromEntries(formData.entries());
        const validation = signupSchema.safeParse(rawData);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message }, 
                { status: 400 }
            );
        }

        const { username, email, password } = validation.data;
        const file = formData.get("profilePic") as File | null;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        let profilePicData = ""; 
        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const base64String = buffer.toString("base64");

            profilePicData = `data:${file.type};base64,${base64String}`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
            profilePic: profilePicData, 
        });

        return NextResponse.json(
            { message: "User registered successfully!" },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}