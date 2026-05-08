"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Users, ShieldCheck, UserPlus, Trash2, Edit3 } from "lucide-react";

interface UserData {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Stats {
    totalUsers: number;
    adminCount: number;
    regularUsers: number;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                setStats(data.stats);
            } else {
                Swal.fire("Error", data.error, "error");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to load admin data", "error");
        } finally {
            setLoading(false);
        }
    };

const handleDelete = async (id: string) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This user will be permanently removed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) {
                Swal.fire("Deleted!", "User has been removed.", "success");
                fetchAdminData();  
            } else {
                const err = await res.json();
                Swal.fire("Error", err.error, "error");
            }
        } catch (error) {
            Swal.fire("Error", "Network error", "error");
        }
    }
};

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-blue-400">Admin Command Center</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center space-x-4 shadow-lg">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Users size={32} /></div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Users</p>
                            <p className="text-2xl font-bold">{stats?.totalUsers}</p>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center space-x-4 shadow-lg">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><ShieldCheck size={32} /></div>
                        <div>
                            <p className="text-gray-400 text-sm">Admins</p>
                            <p className="text-2xl font-bold">{stats?.adminCount}</p>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center space-x-4 shadow-lg">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500"><UserPlus size={32} /></div>
                        <div>
                            <p className="text-gray-400 text-sm">Regular Users</p>
                            <p className="text-2xl font-bold">{stats?.regularUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">User Management</h2>
                        <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-400 font-mono">Live Data</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800/50 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    {/* <th className="px-6 py-4">Joined Date</th> */}
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-800/30 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-100">{user.username}</span>
                                                <span className="text-sm text-gray-500">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-300'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td> */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button className="p-2 hover:bg-blue-500/20 rounded text-blue-400 transition">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 hover:bg-red-500/20 rounded text-red-400 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}