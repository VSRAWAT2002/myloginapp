"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire("Success", "Password updated! You can now login.", "success")
                    .then(() => router.push("/login"));
            } else {
                Swal.fire("Error", data.error || "Failed to reset password", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleReset} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
                <p className="text-xs text-gray-500 mb-4 text-center">Resetting for: {email}</p>
                
                <input
                    type="text"
                    required
                    placeholder="6-Digit OTP"
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-center text-xl tracking-widest"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                />
                
                <input
                    type="password"
                    required
                    placeholder="New Password"
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-900"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="w-full bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}