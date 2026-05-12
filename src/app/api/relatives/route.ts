import { NextRequest, NextResponse } from "next/server";
import {dbConnect} from "@/lib/dbconnect";
import Relative from "@/models/Relative";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
        const userId = await getDataFromToken(req);
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const newRelative = await Relative.create({
            ...body,
            ownerId: userId,
        });

        return NextResponse.json(newRelative, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/relatives Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        const userId = await getDataFromToken(req);
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const relatives = await Relative.find({ ownerId: userId });
        
        return NextResponse.json(relatives);
    } catch (error: any) {
        console.error("GET /api/relatives Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}