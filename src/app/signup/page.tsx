"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [otpSent, setOtpSent] = useState("");
    const [userOtp, setUserOtp] = useState("");
    const [pendingData, setPendingData] = useState<SignupFormData | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSignupSubmit = async (data: SignupFormData) => {
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setOtpSent(result.otp);
                setPendingData(data);
                setStep(2);
                Swal.fire("OTP Sent", "Check your email for the code.", "info");
            } else {
                Swal.fire(
                    "Error",
                    result.error || "Something went wrong",
                    "error",
                );
            }
        } catch (error) {
            Swal.fire("Error", "Internal Server Error", "error");
        }
    };

    const handleVerifyOtp = async () => {
        if (userOtp !== otpSent) {
            return Swal.fire("Invalid OTP", "The code is incorrect.", "error");
        }

        setIsVerifying(true);
        try {
            const response = await fetch("/api/signup/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pendingData),
            });

            if (response.ok) {
                router.refresh();
                Swal.fire("Success!", "Account created.", "success").then(() =>
                    router.push("/login"),
                );
            } else {
                const res = await response.json();
                Swal.fire(
                    "Error",
                    res.error || "Failed to create account",
                    "error",
                );
            }
        } catch (error) {
            Swal.fire("Error", "Verification failed", "error");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
                {step === 1 ? (
                    <form onSubmit={handleSubmit(onSignupSubmit)}>
                        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">
                            Create Account
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                {...register("username")}
                                className="w-full p-2 border border-gray-300 rounded text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="John Doe"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="name@company.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded text-gray-900 outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                        >
                            {isSubmitting ? "Sending OTP..." : "Sign Up"}
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-green-600 font-medium hover:underline"
                            >
                                Login here
                            </Link>
                        </p>
                    </form>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">
                            Verify Email
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Enter code sent to <b>{pendingData?.email}</b>
                        </p>
                        <input
                            type="text"
                            maxLength={6}
                            value={userOtp}
                            onChange={(e) => setUserOtp(e.target.value)}
                            placeholder="000000"
                            className="w-full p-3 border border-gray-300 rounded-md text-center text-3xl tracking-[10px] font-bold mb-6 outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            disabled={isVerifying}
                            className="w-full bg-green-600 text-white p-2 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                        >
                            {isVerifying
                                ? "Verifying..."
                                : "Verify & Create Account"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
