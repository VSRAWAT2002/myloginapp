"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';  
import users from '../../data/user.json'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userExists = users.find((u: any) => u.email === email && u.password === password);

    if (userExists) {
      router.push('/components/dashboard');
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
     <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-100">
  <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Login</h2>

  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input 
      type="email" 
      className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
      placeholder="Enter your email"
      onChange={(e) => setEmail(e.target.value)} 
      required 
    />
  </div>

  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
    <input 
      type="password" 
      className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
      placeholder="Enter your password"
      onChange={(e) => setPassword(e.target.value)} 
      required 
    />
  </div>

  <button className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition duration-200">
    Sign In
  </button>

  <p className="mt-4 text-center text-sm text-gray-600">
    New User? <Link href="/components/signup" className="text-blue-600 font-medium hover:underline">Create an account</Link>
  </p>
</form>
    </div>
  );
}