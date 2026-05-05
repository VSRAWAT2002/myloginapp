"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

interface UserData {
    username: string;
    email: string;
    profilePic?: string;
    role: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return Swal.fire("Error", "Image must be less than 5MB", "error");
        }

        setUploading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64 = reader.result as string;

            try {
                const res = await fetch("/api/user/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profilePic: base64 }),
                });

                if (res.ok) {
                    setUser(prev => prev ? { ...prev, profilePic: base64 } : null);
                    Swal.fire("Success", "Profile picture updated!", "success");
                } else {
                    Swal.fire("Error", "Failed to upload image", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Something went wrong", "error");
            } finally {
                setUploading(false);
            }
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500 font-medium">
                <div className="animate-pulse">Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                
                <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-6">
                        <div className="relative group w-24 h-24">
                            <img
                                src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-green-100 shadow-sm"
                            />

                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                {uploading ? "..." : "Change"}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleImageUpload} 
                                    accept="image/*"
                                    disabled={uploading}
                                />
                            </label>
                            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Welcome, {user?.username || "User"}!
                            </h1>
                            <p className="text-gray-500">{user?.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-800 bg-green-100 rounded-full">
                                {user?.role || "User"} Account
                            </span>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <Link 
                            href="/profile" 
                            className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition shadow-md"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>

                <hr className="my-8 border-gray-100" />

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="font-bold text-blue-800">Account Summary</h3>
                        <p className="text-sm text-blue-600 mt-1">
                            Your account is active. You can now update your personal details and profile picture here.
                        </p>
                    </div>
                    
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                        <h3 className="font-bold text-purple-800">Security</h3>
                        <p className="text-sm text-purple-600 mt-1">
                            Your session is verified. Remember to logout when using a public device.
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Logged in as <span className="font-medium text-gray-600">{user?.username}</span>
                </p>
            </div>
        </div>
    );
}