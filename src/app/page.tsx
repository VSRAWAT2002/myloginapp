"use client";
import Link from "next/link";
import Image from "next/image";
import { TreeDeciduous, Users, Heart, Zap } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="relative bg-[#f8fafc] overflow-hidden border-b border-slate-100">
                <div className="absolute inset-0 opacity-[0.03]">
                    <svg
                        viewBox="0 0 1000 1000"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M790.5,618Q657,736,500,736Q343,736,209.5,618Q76,500,209.5,382Q343,264,500,264Q657,264,790.5,382Q924,500,790.5,618Z"
                            fill="#16a34a"
                        />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-16 items-center relative">
                    <div className="flex flex-col space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-semibold self-center md:self-start border border-green-100">
                            <TreeDeciduous size={16} />
                            <span>Visualize Your Heritage</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-[#1e293b] leading-tight tracking-tighter">
                            Your Story,{" "}
                            <span className="text-green-600">
                                Beautifully Rooted
                            </span>
                            .
                        </h1>

                        <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
                            Trace generations, uncover connections, and build a
                            lasting, interactive memory of your family's
                            journey.
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-6 justify-center md:justify-start">
                            <Link
                                href="/signup"
                                className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-500/20 text-center"
                            >
                                Start Your Tree →
                            </Link>
                            {/* <Link href="/about" className="bg-white text-[#1e293b] px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition border border-slate-200 text-center">
                                Learn More
                            </Link> */}
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="absolute -inset-10 bg-green-200/40 rounded-full blur-3xl opacity-60"></div>

                        <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 transform rotate-[-2deg] transition hover:rotate-0 duration-300">
                            <Image
                                src="/family-tree-hero.jpg"
                                alt="Visual Family Tree Example"
                                width={500}
                                height={400}
                                sizes="(max-width: 768px) 100vw, 500px"
                                className="w-full max-w-[500px] h-auto rounded-2xl animate-float"
                                style={{ height: "auto" }}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-bold text-[#1e293b] tracking-tight">
                            Everything is Connected
                        </h2>
                        <p className="mt-4 text-slate-600 text-lg">
                            Powerful tools designed to make preserving family
                            history simple, secure, and intuitive.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition">
                            <div className="p-3 bg-white w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm text-green-600 mb-6">
                                <Users size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-[#1e293b]">
                                Collab with Kin
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Invite relatives to contribute stories, photos,
                                and vital dates.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition">
                            <div className="p-3 bg-white w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm text-blue-600 mb-6">
                                <Zap size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-[#1e293b]">
                                Instant Updates
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Changes reflect instantly across the tree for
                                everyone.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition">
                            <div className="p-3 bg-white w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm text-red-600 mb-6">
                                <Heart size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-[#1e293b]">
                                Private & Secure
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Your data stays safe with industry-standard
                                encryption.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition">
                            <div className="p-3 bg-white w-14 h-14 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm text-purple-600 mb-6">
                                <TreeDeciduous size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-semibold text-[#1e293b]">
                                Dynamic Views
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Swap between modern, classic, and circular tree
                                views.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
