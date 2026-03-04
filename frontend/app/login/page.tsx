'use client'
import { useState } from 'react';
import { BatteryCharging, Lock, CheckCircle2, UserCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type AuthMode = 'signin' | 'signup' | 'forgot_password';

export default function LoginPage() {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [consumerId, setConsumerId] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const router = useRouter();

    const clearMessages = () => {
        setErrorMsg('');
        setSuccessMsg('');
    };

    const handleSwitchMode = (newMode: AuthMode) => {
        setMode(newMode);
        clearMessages();
        setPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        clearMessages();

        try {
            if (mode === 'signin') {
                const res = await api.login(consumerId, password);
                localStorage.setItem('token', res.token);
                localStorage.setItem('consumer_id', res.consumer_id);

                setSuccessMsg(`Welcome back, ${res.name}! Redirecting...`);
                setTimeout(() => router.push('/'), 1000);
            }
            else if (mode === 'signup') {
                const res = await api.signup(consumerId, password);
                localStorage.setItem('token', res.token);
                localStorage.setItem('consumer_id', res.consumer_id);

                setSuccessMsg(`Account created for ${res.consumer_id}! Redirecting...`);
                setTimeout(() => router.push('/'), 1000);
            }
            else if (mode === 'forgot_password') {
                await api.resetPassword(consumerId, password);
                setSuccessMsg('Password updated successfully! Please sign in.');
                setTimeout(() => handleSwitchMode('signin'), 1500);
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-w-[320px] bg-neutral-950 flex flex-col items-center justify-center font-sans text-gray-100 p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-8 relative z-10">
                <div className="flex flex-col items-center mb-8 gap-3">
                    <div className="bg-blue-900/30 p-3 rounded-2xl border border-blue-500/20 text-blue-400">
                        <BatteryCharging size={36} className="fill-current" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">PowerWise</h1>
                        <p className="text-sm text-gray-400">
                            {mode === 'signin' && 'Sign in to your dashboard'}
                            {mode === 'signup' && 'Create a new client account'}
                            {mode === 'forgot_password' && 'Reset your password'}
                        </p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-4 p-3 bg-green-900/20 border border-green-500/30 text-green-400 text-sm rounded-xl text-center">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-300 ml-1">Consumer ID</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <UserCircle size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                value={consumerId}
                                onChange={(e) => setConsumerId(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-neutral-600 shadow-inner"
                                placeholder={mode === 'signin' ? "e.g. CUST-001" : "Enter new Consumer ID"}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-gray-300">
                                {mode === 'forgot_password' ? 'New Password' : 'Password'}
                            </label>
                            {mode === 'signin' && (
                                <button
                                    type="button"
                                    onClick={() => handleSwitchMode('forgot_password')}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            )}
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

                    {mode === 'signin' && (
                        <div className="flex items-center gap-2 mt-2 ml-1">
                            <label className="relative flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-4 h-4 bg-neutral-950 border border-neutral-700 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                    <CheckCircle2 size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                </div>
                            </label>
                            <span className="text-xs text-gray-400 cursor-pointer select-none">Remember me for 30 days</span>
                        </div>
                    )}

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
                                    Processing...
                                </span>
                            ) : (
                                <span>
                                    {mode === 'signin' && 'Sign In'}
                                    {mode === 'signup' && 'Create Account'}
                                    {mode === 'forgot_password' && 'Update Password'}
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 flex flex-col gap-2">
                    {mode === 'signin' ? (
                        <p>Don't have an account? <button onClick={() => handleSwitchMode('signup')} className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Request access</button></p>
                    ) : (
                        <button onClick={() => handleSwitchMode('signin')} className="text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center justify-center gap-1 w-full">
                            <ArrowLeft size={16} /> Back to Sign In
                        </button>
                    )}
                </div>

                {mode === 'signin' && (
                    <div className="mt-4 pt-4 border-t border-neutral-800 text-xs text-center text-gray-600">
                        <p>Demo Credentials:</p>
                        <p>Consumer ID: <span className="text-gray-400 font-mono">CUST-001</span></p>
                        <p>Password: <span className="text-gray-400 font-mono">password123</span></p>
                    </div>
                )}
            </div>
        </div>
    );
}
