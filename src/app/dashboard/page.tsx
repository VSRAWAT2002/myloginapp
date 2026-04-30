"use client";
import { useEffect, useState } from "react";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-600">Loading directory...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">
          Here is the current directory of all registered users in the system.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            {/* Profile Picture Logic */}
            <div className="w-24 h-24 mb-4 relative">
              {user.profilePic ? (
                <img 
                  src={user.profilePic} 
                  alt={user.username} 
                  className="w-full h-full object-cover rounded-full border-2 border-green-500 shadow-sm"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">
              {user.username}
            </h2>
            {/* <p className="text-sm text-gray-500 mb-2">{user.email}</p> */}
            
            <p className="text-xs text-green-500 font-medium mt-1 bg-green-50 px-3 py-1 rounded-full">
              Active User
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}