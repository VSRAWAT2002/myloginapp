"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                Swal.fire("Sent!", "Check your email for the OTP code.", "success")
                    .then(() => router.push(`/reset-password?email=${email}`));
            } else {
                Swal.fire("Error", "Failed to send OTP. Try again.", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
                <p className="text-sm text-gray-600 mb-4 text-center">
                    Enter your email and we'll send you a 6-digit code to reset your password.
                </p>
                <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    disabled={loading}
                    className="w-full bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
                <div className="mt-4 text-center">
                    <Link href="/login" className="text-sm text-green-600 hover:underline">Back to Login</Link>
                </div>
            </form>
        </div>
    );
}