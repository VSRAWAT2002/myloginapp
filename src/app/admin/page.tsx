"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    profilePic?: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                Swal.fire("Error", "Unauthorized access", "error");
            }
        } catch (err) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const result = await Swal.fire({
            title: `Make user an ${newRole}?`,
            text: "This will change their permissions immediately.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        });

        if (result.isConfirmed) {
            const res = await fetch("/api/users/role", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newRole }),
            });

            if (res.ok) {
                Swal.fire("Updated!", `User role changed to ${newRole}.`, "success");
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            } else {
                Swal.fire("Error", "Failed to update role", "error");
            }
        }
    };

    const handleDelete = async (userId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This user will be permanently removed!",
            icon: "danger",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Delete User"
        });

        if (result.isConfirmed) {
            const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== userId));
                Swal.fire("Deleted!", "User removed.", "success");
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading User Database...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10 text-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800">User Management</h1>
                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">
                        Total Users: {users.length}
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <img 
                                            src={user.profilePic || `https://ui-avatars.com/api/?name=${user.username}`} 
                                            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                            alt="Avatar"
                                        />
                                        <span className="font-medium text-gray-800">{user.username}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {user.role === "user" ? (
                                            <button 
                                                onClick={() => handleRoleChange(user._id, "admin")}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold border border-blue-600 px-2 py-1 rounded transition"
                                            >
                                                Promote
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleRoleChange(user._id, "user")}
                                                className="text-orange-600 hover:text-orange-800 text-xs font-bold border border-orange-600 px-2 py-1 rounded transition"
                                            >
                                                Demote
                                            </button>
                                        )}
                                        
                                        <button 
                                            className="text-red-500 hover:text-red-700 font-medium text-sm ml-4"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}