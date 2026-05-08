"use client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {

    const response = await fetch("/api/logout", { method: "POST" });
    
    if (response.ok) {
      router.refresh();

      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out safely.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        router.push("/login");
      });
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="hover:text-red-400 font-medium transition"
    >
      Logout
    </button>
  );
}