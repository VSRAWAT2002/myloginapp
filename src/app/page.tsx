import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
        Welcome to the User Manager
      </h1>
      <p className="text-gray-600 text-xl mb-8 max-w-lg">
        The ultimate platform for managing your professional network and user directory with ease.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/dashboard" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg"
        >
          Get Started
        </Link>
        <Link 
          href="/signup" 
          className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}