export default function TreeView() {
    return (
        <div className="w-full h-[600px] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
            <div className="text-center">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 inline-block mb-4">

                     <p className="text-slate-400 font-medium">Your Family Tree will render here</p>
                </div>
                <button className="block mx-auto bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
                    + Add Your First Relative  
                </button>
            </div>
        </div>
    );
}