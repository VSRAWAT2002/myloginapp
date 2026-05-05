import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";
import { jwtVerify } from "jose";

export default async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value; 
    
    let userRole = null;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            userRole = payload.role;
        } catch (e) {
            console.error("Invalid token in Navbar:", e);
        }
    }

    return (
        <nav className="flex justify-between items-center p-6 bg-gray-800 text-white shadow-md">
            <div className="text-xl font-bold">
               
                <Link href={token ? "/dashboard" : "/"}>MyLogo</Link>
            </div>

            <div className="space-x-6 flex items-center">
                <Link href="/contactus" className="hover:text-blue-400">
                    Contact Us
                </Link>

                {userRole === 'admin' && (
                    <Link href="/admin" className="text-yellow-400 font-bold hover:text-yellow-300">
                        Admin Panel
                    </Link>
                )}

                {token ? (
                    <>
                        {/* <Link href="/dashboard" className="hover:text-blue-400">
                            Dashboard
                        </Link> */}
                        {/* LogoutButton must clear 'session_token' */}
                        <LogoutButton />
                    </>
                ) : (
                    <Link href="/login" className="hover:text-blue-400 font-medium">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}