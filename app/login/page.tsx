'use client'
import { useState } from 'react';
import { BatteryCharging, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate authentication delay
        setTimeout(() => {
            setIsLoading(false);
            router.push('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen min-w-[320px] bg-neutral-950 flex flex-col items-center justify-center font-sans text-gray-100 p-4">

            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden group">
                {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div> */}

                <div className="flex flex-col items-center mb-8 gap-3">
                    <div className="bg-blue-900/30 p-3 rounded-2xl border border-blue-500/20 text-blue-400">
                        <BatteryCharging size={36} className="fill-current" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1 text-center">PowerWise</h1>
                        <p className="text-sm text-gray-400">Sign in to your dashboard</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-neutral-600 shadow-inner"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-neutral-600 shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 ml-1">
                        <label className="relative flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-4 h-4 bg-neutral-950 border border-neutral-700 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                <CheckCircle2 size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                            </div>
                        </label>
                        <span className="text-xs text-gray-400 cursor-pointer select-none">Remember me for 30 days</span>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 rounded-xl font-medium transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${isLoading
                                ? 'bg-blue-600/70 text-white/70 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Don't have an account? <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Request access</a></p>
                </div>
            </div>

            {/* Background decorations */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
    );
}
