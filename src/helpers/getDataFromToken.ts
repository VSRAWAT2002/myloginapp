import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const getDataFromToken = async (request: NextRequest) => {
    try {
        const token = request.cookies.get("session_token")?.value || "";
        if (!token) {
            throw new Error("No session token found");
        }
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.id as string;
    } catch (error: any) {
        
        throw new Error(error.message);
    }
};
