"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Login Successful!");
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/dashboard"); 
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            {...register("email")} 
            type="email" 
            className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-green-500 outline-none" 
            placeholder="name@company.com" 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>


        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            {...register("password")} 
            type="password" 
            className="w-full p-2 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-green-500 outline-none" 
            placeholder="••••••••" 
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button 
          disabled={isSubmitting} 
          className="w-full bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link href="/signup" className="text-green-600 font-medium hover:underline">Sign up here</Link>
        </p>
      </form>
    </div>
  );
}