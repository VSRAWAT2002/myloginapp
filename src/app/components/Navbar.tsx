import Link from "next/link";


export default function Navbar() {
    return (
        <nav className="flex justify-between items-center p-6 bg-gray-800 text-white">
            <div className="space-x-6">
                <Link href="/dashboard" className="hover:text-blue-400">
                    Dashboard
                </Link>
                <Link href="/login" className="hover:text-blue-400">
                    Login
                </Link>
                <Link href="contactus" className="hover:text-blue-400">
                    Contact Us
                </Link>
            </div>
        </nav>
    );
}
