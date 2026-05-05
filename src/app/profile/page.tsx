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

export default function ProfilePage() {
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
                console.error("Profile fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5* 1024 * 1024) {
            return Swal.fire("Error", "Image must be under 5MB", "error");
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
                    setUser((prev) => prev ? { ...prev, profilePic: base64 } : null);
                    Swal.fire("Success", "Logo updated successfully!", "success");
                } else {
                    const errorData = await res.json();
                    Swal.fire("Error", errorData.error || "Update failed", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Something went wrong during upload", "error");
            } finally {
                setUploading(false);
            }
        };
    };

    if (loading) return <div className="p-10 text-center font-semibold text-gray-600">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-green-600 p-6 flex items-center justify-between">
                    <h2 className="text-white text-xl font-bold">User Profile</h2>
                    <Link href="/dashboard" className="text-white text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition shadow-sm">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="p-8 text-center">
                    <div className="relative group mx-auto w-32 h-32">
                        <img
                            src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=random`}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                        />
                        
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 border-2 border-dashed border-white/50">
                            <span className="text-[10px] font-bold tracking-widest uppercase">
                                {uploading ? "Uploading..." : "Add Logo"}
                            </span>
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={handleUpload} 
                                accept="image/*" 
                                disabled={uploading} 
                            />
                        </label>
                    </div>
                    
                    <h1 className="mt-6 text-2xl font-black text-gray-800 tracking-tight">
                        {user?.username?.toUpperCase() || "USER"}
                    </h1>
                    <p className="text-gray-500 font-medium">{user?.email}</p>
                    
                    <div className="mt-8 border-t border-gray-100 pt-6 text-left space-y-4">
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Account Type</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                {user?.role}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Status</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                <span className="text-blue-600 font-bold text-sm">Active</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-[11px] text-gray-400 italic">
                        Tip: Hover over your avatar to change your logo.
                    </p>
                </div>
            </div>
        </div>
    );
}