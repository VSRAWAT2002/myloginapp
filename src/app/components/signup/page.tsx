"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("New User:", { username, email, password });
    alert("Account created successfully!");
    router.push('/components/login');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Create Account</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-green-500 outline-none" 
            placeholder="John Doe"
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-green-500 outline-none" 
            placeholder="name@company.com"
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-green-500 outline-none" 
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button className="w-full bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700 transition duration-200">
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/components/login" className="text-green-600 font-medium hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}