"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signupSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import Link from "next/link";


type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    
    if (data.profilePic?.[0]) {
      formData.append("profilePic", data.profilePic[0]);
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      router.push("/login");
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Create Account</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input {...register("username")} className="w-full p-2 border border-gray-300 rounded text-gray-900" placeholder="John Doe" />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input {...register("email")} type="email" className="w-full p-2 border border-gray-300 rounded text-gray-900" placeholder="name@company.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input {...register("password")} type="password" className="w-full p-2 border border-gray-300 rounded text-gray-900" placeholder="••••••••" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input {...register("profilePic")} type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
        </div>

        <button disabled={isSubmitting} className="w-full bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400">
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-green-600 font-medium hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}