"use client";
import { useEffect, useState } from "react";
import { TreeDeciduous, Plus, Users, Baby } from "lucide-react";
import Swal from "sweetalert2";

export default function TreeView() {
    const [relatives, setRelatives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRelatives = async () => {
        const res = await fetch("/api/relatives");
        if (res.ok) setRelatives(await res.json());
        setLoading(false);
    };

    useEffect(() => { fetchRelatives(); }, []);

    const handleAddRelative = async (baseMemberId?: string) => {
        const { value: formValues } = await Swal.fire({
            title: baseMemberId ? "Add Connection" : "Add Root Member",
            html: `
                <input id="name" class="swal2-input" placeholder="Name">
                <select id="gender" class="swal2-input">
                    <option value="Male">Male (Right)</option>
                    <option value="Female">Female (Left)</option>
                </select>
                ${baseMemberId ? `
                <select id="relationType" class="swal2-input">
                    <option value="parent">Parent (Move Up)</option>
                    <option value="child">Child (Move Down)</option>
                </select>` : ''}
            `,
            preConfirm: () => ({
                name: (document.getElementById("name") as HTMLInputElement).value,
                gender: (document.getElementById("gender") as HTMLSelectElement).value,
                relationType: baseMemberId ? (document.getElementById("relationType") as HTMLSelectElement).value : 'root'
            })
        });

        if (formValues?.name) {
            const payload = {
                name: formValues.name,
                gender: formValues.gender,
                ...(formValues.relationType === 'child' && { fatherId: formValues.gender === 'Male' ? baseMemberId : null, motherId: formValues.gender === 'Female' ? baseMemberId : null }),
            };

            await fetch("/api/relatives", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            fetchRelatives();
        }
    };

    return (
        <div className="w-full h-600px bg-slate-50 relative p-10 overflow-auto">
            <div className="flex flex-col items-center space-y-20">
                {relatives.map((person) => (
                    <div key={person._id} className="relative group">
                        <div className={`p-4 bg-white border-2 rounded-xl shadow-md w-40 text-center ${person.gender === 'Male' ? 'border-blue-200 ml-20' : 'border-pink-200 mr-20'}`}>
                            <p className="font-bold">{person.name}</p>
                            <p className="text-xs text-gray-400">{person.gender}</p>
                            
                            <button 
                                onClick={() => handleAddRelative(person._id)}
                                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        
                        <div className="absolute top-full left-1/2 w-0.5 h-20 bg-gray-200 -z-10"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}