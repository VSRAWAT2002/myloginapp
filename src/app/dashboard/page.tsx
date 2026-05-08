"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { TreeDeciduous, Plus } from "lucide-react";
import TreeView from "@/app/components/FamilyTree/TreeView";

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

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
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
                    
                    setUser((prev) =>
                        prev ? { ...prev, profilePic: base64 } : null,
                    );
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
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100">
                    <div className="flex flex-col md:flex-row items-center md:justify-between space-y-6 md:space-y-0">
                        <div className="flex items-center space-x-6">
                            <div className="relative group w-24 h-24">
                                <img
                                    src={
                                        user?.profilePic ||
                                        `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=random`
                                    }
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
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                                    Welcome, {user?.username || "User"}!
                                </h1>
                                <p className="text-slate-500">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 rounded-full border border-green-100">
                                    {user?.role || "User"} Account
                                </span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <Link
                                href="/profile"
                                className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-500/20"
                            >
                                Edit Profile
                            </Link>
                            {user?.role === "admin" && (
                                <Link
                                    href="/admin"
                                    className="px-6 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-900 transition"
                                >
                                    Admin Panel
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {user?.role === "user" && (
                    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                                    <TreeDeciduous
                                        className="text-green-600"
                                        size={24}
                                    />
                                    <span>My Family Tree</span>
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Interactive visualization of your lineage
                                </p>
                            </div>
                            {/* <button className="hidden md:flex items-center space-x-2 text-green-600 font-semibold text-sm hover:underline">
                            <Plus size={16} />
                            <span>Add Relative</span>
                        </button> */}
                        </div>

                        <TreeView />
                    </div>
                )}

                <p className="text-center text-xs text-slate-400 pb-8">
                    Signed in as{" "}
                    <span className="font-medium text-slate-600">
                        {user?.email}
                    </span>
                </p>
            </div>
        </div>
    );
}
